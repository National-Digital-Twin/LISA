import cookie from 'cookie';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { WebSocket, WebSocketServer } from 'ws';

import { createAuthenticator } from '../auth/middleware';
import { User } from '../auth/user';
import { cookieManager, tokenVerifier } from '../util';
import Broker from './broker';
import PubSubManager from './manager';

const authenticator = createAuthenticator(tokenVerifier, cookieManager);

const wss = new WebSocketServer({ noServer: true });
const broker = new Broker();

wss.on('connection', (ws: WebSocket, request: IncomingMessage, user: User) => {
  const id = randomUUID();
  broker.addClient(id, ws, user);

  ws.on('message', (message) => {
    PubSubManager.getInstance().processMessage(id, user, ws, message.toString());
  });

  ws.on('pong', () => {
    broker.pong(id);
  });

  ws.on('close', () => {
    PubSubManager.getInstance().removeById(id);
    broker.remove(id);
  });

  ws.on('error', (err) => {
    console.error('got error ', err);
  });
});

wss.on('close', () => {
  PubSubManager.getInstance().clear();
  broker.clear();
});

export async function handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
  const cookies = cookie.parse(request.headers.cookie);

  const user = await authenticator(cookies);
  if (!user) {
    socket.write('HTTP/1.1 403 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request, user);
  });
}

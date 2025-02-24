import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { WebSocket, WebSocketServer } from 'ws';
import { User } from '../auth/user';
import Broker from './broker';
import PubSubManager from './manager';

const wss = new WebSocketServer({ noServer: true });
const broker = new Broker();

wss.on('connection', (ws: WebSocket, request: IncomingMessage, user: User) => {
  const id = randomUUID();
  broker.addClient(id, ws, user);

  ws.on('message', (data) => {
    let message: string;

    if (typeof data === 'string') {
      message = data;
    } else if (Buffer.isBuffer(data)) {
      message = data.toString('utf8');
    } else {
      // For any other type (or object), use JSON.stringify to get a readable string
      message = JSON.stringify(data);
    }

    PubSubManager.getInstance().processMessage(id, user, ws, message);
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

export async function handleUpgrade(
  request: IncomingMessage,
  socket: Duplex,
  head: Buffer,
  user: User
) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request, user);
  });
}

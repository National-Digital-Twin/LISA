// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { WebSocket, WebSocketServer } from 'ws';
import { User } from '../auth/user';
import Broker from './broker';
import PubSubManager from './manager';

const wss = new WebSocketServer({ noServer: true });
const broker = new Broker();

wss.on('connection', async (ws: WebSocket, request: IncomingMessage) => {
  let user: User;

  try {
    const username = request.headers['sec-websocket-protocol'].split(',')[1].trim();
    user = new User(username, '');
  } catch (error) {
    ws.close();
    console.log(error);
    return;
  }

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

export async function handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
}

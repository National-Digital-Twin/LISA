import { WebSocket } from 'ws';
import { User } from '../auth/user';

type Client = {
  ws: WebSocket;
  user: User;
  isAlive: boolean;
};

export default class Broker {
  private clients: Record<string, Client> = {};

  private interval: ReturnType<typeof setInterval>;

  constructor() {
    this.interval = setInterval(() => {
      Object.keys(this.clients).forEach((key) => {
        this.checkClient(key);
      });
    }, 3000);
  }

  public addClient(id: string, ws: WebSocket, user: User) {
    this.clients[id] = {
      ws,
      user,
      isAlive: true,
    };
    ws.ping();
  }

  public pong(id: string) {
    const client = this.clients[id];
    if (client) {
      client.isAlive = true;
    }
  }

  public remove(id: string) {
    delete this.clients[id];
  }

  public clear() {
    this.clients = {};
    clearInterval(this.interval);
  }

  private checkClient(id: string) {
    const client = this.clients[id];
    if (!client.isAlive) {
      client.ws.terminate();
      delete this.clients[id];
    } else {
      client.isAlive = false;
      client.ws.ping();
    }
  }
}

// eslint-disable-next-line import/no-relative-packages
import { User } from '../../../common/User';

export class WebSocketClient {
  private ws: WebSocket | undefined;

  private readonly pendingMessages: string[] = [];

  private attemptCount = 0;

  private timer: ReturnType<typeof setTimeout> | undefined;

  private readonly messageCallback: (msg: string) => void | undefined;

  private readonly connectionCallback: () => void | undefined;

  private readonly user: User;

  constructor(connectionCallback: () => void, messageCallback: (msg: string) => void, user: User) {
    this.connectionCallback = connectionCallback;
    this.messageCallback = messageCallback;
    this.user = user;
    this.connect();
  }

  send(message: string) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      this.pendingMessages.push(message);
      return;
    }
    this.ws.send(message);
  }

  close() {
    this.ws?.close();
  }

  private connect(isRestoration: boolean = false) {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    /* eslint-disable-next-line no-restricted-globals */
    const backendHost = import.meta.env.VITE_BACKEND_HOST || self.window.location.host;
    const ws = new WebSocket(`${protocol}://${backendHost}/api/ws`, [protocol, this.user.username]);
    ws.onopen = () => {
      this.handleOpen(isRestoration);
    };
    ws.onmessage = (msg: MessageEvent) => {
      this.handleMessage(msg);
    };
    ws.onclose = () => {
      this.handleClose();
    };
    this.ws = ws;
  }

  private handleMessage(message: MessageEvent) {
    this.messageCallback(message.data);
  }

  private handleOpen(isRestoration: boolean = false) {
    this.attemptCount = 0;
    clearTimeout(this.timer);
    this.pendingMessages.forEach((msg) => this.send(msg));
    this.connectionCallback();
    if (isRestoration) {
      // eslint-disable-next-line no-console
      console.info('ws connection was restored');
    }
  }

  private handleClose() {
    const delay = Math.min(500 * 2 ** this.attemptCount, 32000);
    // eslint-disable-next-line no-console
    console.warn('ws connection was closed, retrying in', delay / 1000, 's');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.connect(true);
    }, delay);
    this.attemptCount += 1;
  }
}

 
import { User } from 'common/User';
import { WebSocketClient } from '../ws';

jest.mock('../config', () => ({
  config: {
    apiUrl: 'https://localhost:mock'
  }
}));

describe('WebSocketClient', () => {
  let originalWebSocket: never;
   
  let webSocketInstances: MockWebSocket[];

  const user: User = { username: 'testUser', displayName: 'Test User', email: 'test@test.com', groups: [] };

  // A mock WebSocket class to simulate behaviour
  class MockWebSocket {
    static readonly CONNECTING = 0;

    static readonly OPEN = 1;

    static readonly CLOSING = 2;

    static readonly CLOSED = 3;

    public readyState = MockWebSocket.CONNECTING;

    public sentMessages: string[] = [];

    public url: string;

    public protocols: string[];

    public onopen: (() => void) | null = null;

    public onmessage: ((msg: MessageEvent) => void) | null = null;

    public onclose: (() => void) | null = null;

    constructor(url: string, protocols: string[]) {
      this.url = url;
      this.protocols = protocols;
      webSocketInstances.push(this);
    }

    send(message: string) {
      this.sentMessages.push(message);
    }

    close() {
      this.readyState = MockWebSocket.CLOSED;
      // Invoke onclose handler if set
      if (this.onclose) {
        this.onclose();
      }
    }
  }

  // Before each test, override the global.WebSocket and reset our instances array.
  beforeEach(() => {
    webSocketInstances = [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    originalWebSocket = global.WebSocket;
    global.WebSocket = MockWebSocket as never;
  });

  afterEach(() => {
    global.WebSocket = originalWebSocket;
    jest.useRealTimers();
  });

  it('calls connectionCallback on open and flushes pending messages', () => {
    const connectionCallback = jest.fn();
    const messageCallback = jest.fn();

    // Instantiation calls connect() internally.
    const client = new WebSocketClient(connectionCallback, messageCallback, user);

    // Get the current (first) websocket instance
    const ws = webSocketInstances[0];

    // Send a message while WebSocket is not yet open – it should be queued.
    client.send('test message');
    expect(ws.sentMessages).toHaveLength(0);

    // Simulate the open event.
    ws.readyState = MockWebSocket.OPEN;
    if (ws.onopen) {
      ws.onopen();
    }

    // connectionCallback should have been called and the queued message should be sent.
    expect(connectionCallback).toHaveBeenCalled();
    expect(ws.sentMessages).toContain('test message');
  });

  it('calls messageCallback on receiving a message', () => {
    const connectionCallback = jest.fn();
    const messageCallback = jest.fn();

    const client = new WebSocketClient(connectionCallback, messageCallback, user);
    client.send('msg1');
    const ws = webSocketInstances[0];
    ws.readyState = MockWebSocket.OPEN;

    // Simulate a successful connection.
    if (ws.onopen) ws.onopen();

    // Simulate an incoming message event.
    const testData = 'incoming message';
    if (ws.onmessage) ws.onmessage({ data: testData } as MessageEvent);
    expect(messageCallback).toHaveBeenCalledWith(testData);
  });

  it('queues messages when connection is not open and sends them after connection opens', () => {
    const connectionCallback = jest.fn();
    const messageCallback = jest.fn();

    jest.useFakeTimers();
    const client = new WebSocketClient(connectionCallback, messageCallback, user);
    const ws = webSocketInstances[0];

    // Queue multiple messages while still in connecting state.
    client.send('msg1');
    client.send('msg2');
    expect(ws.sentMessages).toHaveLength(0);

    // Simulate the open event.
    ws.readyState = MockWebSocket.OPEN;
    if (ws.onopen) {
      ws.onopen();
    }

    expect(connectionCallback).toHaveBeenCalled();
    expect(ws.sentMessages).toContain('msg1');
    expect(ws.sentMessages).toContain('msg2');
  });

  it('attempts to reconnect on close', () => {
    const connectionCallback = jest.fn();
    const messageCallback = jest.fn();

    jest.useFakeTimers();
    const client = new WebSocketClient(connectionCallback, messageCallback, user);
    client.send('msg1');
    const ws = webSocketInstances[0];

    // Simulate a successful connection.
    ws.readyState = MockWebSocket.OPEN;
    if (ws.onopen) ws.onopen();

    // Simulate connection close.
    if (ws.onclose) ws.onclose();

    // A reconnection should be scheduled. Advance the timers by the expected delay.
    jest.runOnlyPendingTimers();

    // After the timer, a new WebSocket connection should have been created.
    expect(webSocketInstances.length).toBe(2);

    const newWs = webSocketInstances[1];
    newWs.readyState = MockWebSocket.OPEN;
    if (newWs.onopen) newWs.onopen();

    // The connection callback should now have been triggered twice – once for each successful connection.
    expect(connectionCallback).toHaveBeenCalledTimes(2);
  });

  it('close() calls ws.close()', () => {
    const connectionCallback = jest.fn();
    const messageCallback = jest.fn();

    // Create a new instance which triggers the connect method and creates a MockWebSocket.
    const client = new WebSocketClient(connectionCallback, messageCallback, user);
    const ws = webSocketInstances[0];

    // Replace ws.close with a Jest spy function.
    ws.close = jest.fn();

    // Call close on the client.
    client.close();

    // Assert that ws.close has been called.
    expect(ws.close).toHaveBeenCalled();
  });
});

// Global imports
import { createServer } from 'http';

// Local imports
import app from './app';
import { env } from './settings';
import { handleUpgrade } from './pubSub/server';

const server = createServer(app);
server.on('upgrade', async (request, socket, head) => {
  if (request.url !== '/api/ws') {
    socket.destroy();
    return;
  }
  await handleUpgrade(request, socket, head);
});

server.listen(env.PORT, env.HOST, () => {
  console.log(`Server is running on http://${env.HOST}:${env.PORT}`);
});

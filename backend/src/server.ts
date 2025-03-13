// Global imports
import { createServer } from 'http';

// Local imports
import app from './app';
import { handleUpgrade } from './pubSub/server';
import { settings } from './settings';

const server = createServer(app);
server.on('upgrade', async (request, socket, head) => {
  if (request.url !== '/api/ws') {
    socket.destroy();
    return;
  }

  await handleUpgrade(request, socket, head);
});

server.listen(settings.PORT, settings.HOST, () => {
  console.log(`Server is running on http://${settings.HOST}:${settings.PORT}`);
});

// Global imports
import { createServer } from 'http';

// Local imports
import app from './app';
import { settings } from './settings';
import { handleUpgrade } from './pubSub/server';

const server = createServer(app);
server.on('upgrade', async (request, socket, head) => {
  const url = new URL(request.url || '', 'http://localhost');
  if (url.pathname !== '/api/ws') {
    socket.destroy();
    return;
  }

  const userParam = url.searchParams.get('user');
  let user;
  try {
    user = JSON.parse(decodeURIComponent(userParam));
  } catch (error) {
    console.error('Error parsing user parameter:', error);
    socket.destroy();
    return;
  }

  await handleUpgrade(request, socket, head, user);
});

server.listen(settings.PORT, settings.HOST, () => {
  console.log(`Server is running on http://${settings.HOST}:${settings.PORT}`);
});

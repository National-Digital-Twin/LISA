// Global imports
import { createServer } from 'http';

// Local imports
import app from './app';
import { handleUpgrade } from './pubSub/server';
import { getUserDetailsForWs } from './services/auth';
import { settings } from './settings';

const server = createServer(app);
server.on('upgrade', async (request, socket, head) => {
  let user;
  if (request.url !== '/api/ws') {
    socket.destroy();
    return;
  }
  try {
    user = await getUserDetailsForWs(request, socket);
  } catch (error) {
    console.log('Error fetching user details', error);
    socket.destroy();
  }

  if (user?.email && user?.username) {
    await handleUpgrade(request, socket, head, user);
  }
});

server.listen(settings.PORT, settings.HOST, () => {
  console.log(`Server is running on http://${settings.HOST}:${settings.PORT}`);
});

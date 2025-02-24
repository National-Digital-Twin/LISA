// Global imports
import { createServer } from 'http';

// Local imports
import app from './app';
import { settings } from './settings';
import { handleUpgrade } from './pubSub/server';

const server = createServer(app);
server.on('upgrade', async (request, socket, head) => {
  let user;
  if (request.url !== '/api/ws') {
    socket.destroy();
    return;
  }
  try {
    const response = await fetch(`${settings.IDENTITY_API_URL}/api/v1/user-details`, {
      method: 'GET',
      headers: {
        Cookie: request.headers.cookie
      },
      credentials: 'include'
    });

    if (!response.ok) {
      socket.destroy();
    }

    if (response.redirected) {
      socket.destroy();
    }

    const userDetails = await response.json();

    user = userDetails.content;
  } catch (error) {
    console.log('Error fetching user details', error);
    socket.destroy();
  }

  if (user && user.email && user.username) {
    await handleUpgrade(request, socket, head, user);
  }
});

server.listen(settings.PORT, settings.HOST, () => {
  console.log(`Server is running on http://${settings.HOST}:${settings.PORT}`);
});

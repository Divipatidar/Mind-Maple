const { WebSocketServer } = require('ws');
require('dotenv').config();

const port = `${process.env.PORT}` || 3001;
const wss = new WebSocketServer({ port: port });
let counter = 0; 
const map = new Map();
const staleConnectionTimeout = 30 * 60 * 1000; // 30 minutes

console.log(`WebSocket server is running on port ${port}`);

wss.on('connection', (ws, req) => {
  console.log("WebSocket connection established");
  const address = req.url;
  console.log(`Incoming connection URL: ${address}`);

  try {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const id = params?.get('id');
    const isServer = params?.get('isServer') === 'true' || false;
    if (!id) {
      console.log('Invalid connection: No ID provided');
      ws.terminate();
      return;
    }
    if (!id || !isServer) {
      console.log('Invalid connection: No ID or isServer provided');
      ws.terminate();
      return;
    }

    if (!map.has(id)) {
      map.set(id, {});
    }

    if (isServer) {
      map.get(id).server = ws;
    } else {
      map.get(id).client = ws;
    }

    const connectId = counter++;

    ws.on('message', (data, isBinary) => {
      const arr = map.get(id);
      console.log(`Message received from ID ${id}`);

      if (isServer) {
        map.get(id)?.client?.send(data, { binary: isBinary });
      } else {
        map.get(id)?.server?.send(data, { binary: isBinary });
      }
    });

    ws.on('close', () => {
      console.log(`Connection closed for ID ${id}`);
      if (isServer) {
        map.get(id)?.client?.terminate();
      } else {
        map.get(id)?.server?.terminate();
      }
      map.delete(id);
      setTimeout(() => {
        // Remove stale connections after 30 minutes
        map.forEach((value, key) => {
          if (!value.server && !value.client) {
            map.delete(key);
          }
        });
      }, staleConnectionTimeout);
    });
  } catch (error) {
    console.log(`Invalid URL: ${address}`);
    console.error(error);
  }
});
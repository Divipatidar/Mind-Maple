const { WebSocketServer } = require('ws');
require('dotenv').config();

const port = `${process.env.PORT}` || 3001;
const wss = new WebSocketServer({ port: port });

const map = new Map();

let counter = 0;

console.log(`WebSocket server is running on port ${port}`);

wss.on('connection', (ws, req) => {
  console.log("WebSocket connection established"); // Add this line
  const address = req.url;
  console.log(`Incoming connection URL: ${address}`);

  try {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const id = params?.get('id');
    console.log('New connection established');
    console.log(`Client ID: ${id}`);

    if (!id) {
      console.log('Invalid connection: No ID provided');
      ws.terminate();
      return;
    }

    const isServer = params?.get('isServer') === 'true';
    console.log("websocket server",isServer)

    if (!isServer && (!map.has(id) || map.get(id).server === undefined)) {
      console.log('Invalid connection: No server associated with this ID');
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
    });
  } catch (error) {
    console.log(`Invalid URL: ${address}`);
    console.error(error);
  }
});
const { WebSocketServer } = require('ws');
require('dotenv').config();

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ 
  port: port,
  perMessageDeflate: false,
  clientTracking: true
});

const map = new Map();
let counter = 0;

console.log(`WebSocket server is running on port ${port}`);

const pingInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('connection', (ws, req) => {
  console.log("WebSocket connection established");
  
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

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
    console.log("websocket server", isServer);

    // REMOVE THIS CHECK - Allow clients to connect before servers
    // if (!isServer && (!map.has(id) || map.get(id).server === undefined)) {
    //   console.log('Invalid connection: No server associated with this ID');
    //   ws.terminate();
    //   return;
    // }

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
        if (map.get(id)?.client && map.get(id).client.readyState === ws.OPEN) {
          map.get(id).client.send(data, { binary: isBinary });
        }
      } else {
        if (map.get(id)?.server && map.get(id).server.readyState === ws.OPEN) {
          map.get(id).server.send(data, { binary: isBinary });
        }
      }
    });

    ws.on('close', (code, reason) => {
      console.log(`Connection closed for ID ${id}, Code: ${code}, Reason: ${reason}`);
      
      const roomData = map.get(id);
      if (roomData) {
        if (isServer) {
          roomData.server = null;
        } else {
          roomData.client = null;
        }
        
        if (!roomData.server && !roomData.client) {
          map.delete(id);
        }
      }
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ID ${id}:`, error);
    });

  } catch (error) {
    console.log(`Invalid URL: ${address}`);
    console.error(error);
    ws.terminate();
  }
});

wss.on('close', () => {
  clearInterval(pingInterval);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  clearInterval(pingInterval);
  wss.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  clearInterval(pingInterval);
  wss.close(() => {
    process.exit(0);
  });
});
const { WebSocketServer } = require('ws');
require('dotenv').config();

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({
  port: port,
  perMessageDeflate: false,
  clientTracking: true
});

const map = new Map();
const messageQueue = new Map();
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
  console.log("Connection time:", new Date().toISOString());
  
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
    console.log("Connection type:", isServer ? "SERVER" : "CLIENT");

    if (!map.has(id)) {
      map.set(id, { server: null, client: null });
      messageQueue.set(id, []); 
    }

    const roomData = map.get(id);
    const queue = messageQueue.get(id);

    if (isServer && roomData.server) {
      console.log(`Closing existing server connection for ID ${id}`);
      roomData.server.close(1000, 'New server connection');
    } else if (!isServer && roomData.client) {
      console.log(`Closing existing client connection for ID ${id}`);
      roomData.client.close(1000, 'New client connection');
    }

    if (isServer) {
      roomData.server = ws;
      ws.connectionType = 'server';
      console.log("SERVER connection established for room:", id);
      
      if (queue && queue.length > 0) {
        console.log(`Processing ${queue.length} queued messages for room ${id}`);
        queue.forEach(({ data, isBinary }, index) => {
          try {
            if (ws.readyState === 1) { 
              ws.send(data, { binary: isBinary });
              console.log(`Queued message ${index + 1} forwarded to server for ID ${id}`);
            }
          } catch (sendError) {
            console.error(`Error sending queued message ${index + 1} for ID ${id}:`, sendError.message);
          }
        });
        queue.length = 0; 
        console.log("All queued messages processed for room:", id);
      }
    } else {
      roomData.client = ws;
      ws.connectionType = 'client';
      console.log("CLIENT connection established for room:", id);
    }

    ws.roomId = id;
    ws.isServerConnection = isServer;

    const connectId = counter++;

    ws.on('message', (data, isBinary) => {
      const arr = map.get(id);
      console.log(`Message received from ID ${id}`);

      if (!arr) {
        console.log(`No room data found for ID ${id}`);
        return;
      }

      try {
        if (isServer) {
          if (arr.client && arr.client.readyState === 1) { 
            arr.client.send(data, { binary: isBinary });
            console.log(`Message forwarded from server to client for ID ${id}`);
          } else {
            console.log(`Client not available for ID ${id}, client state:`, arr.client?.readyState);
          }
        } else {
          if (arr.server && arr.server.readyState === 1) { 
            arr.server.send(data, { binary: isBinary });
            console.log(`Message forwarded from client to server for ID ${id}`);
          } else {
            const queue = messageQueue.get(id);
            if (queue) {
              console.log(`Server not available for ID ${id}, queuing message (queue size: ${queue.length + 1})`);
              queue.push({ data, isBinary });
              
              if (queue.length > 50) {
                queue.shift(); 
                console.log(` Queue size limit reached for ID ${id}, removed oldest message`);
              }
            } else {
              console.log(` Server not available for ID ${id}, server state:`, arr.server?.readyState);
            }
          }
        }
      } catch (sendError) {
        console.error(`Error forwarding message for ID ${id}:`, sendError.message);
      }
    });

    ws.on('close', (code, reason) => {
      console.log(`Connection closed for ID ${id}, Code: ${code}, Reason: ${reason}`);
      
      const roomData = map.get(id);
      if (roomData) {
        if (isServer) {
          roomData.server = null;
          console.log(`Server connection removed for ID ${id}`);
        } else {
          roomData.client = null;
          console.log(`Client connection removed for ID ${id}`);
        }
        
        if (!roomData.server && !roomData.client) {
          map.delete(id);
          messageQueue.delete(id); 
          console.log(`Room ${id} cleaned up`);
        }
      }
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for ID ${id}:`, error.message);
      
      const roomData = map.get(id);
      if (roomData) {
        if (isServer) {
          roomData.server = null;
        } else {
          roomData.client = null;
        }
        
        if (!roomData.server && !roomData.client) {
          map.delete(id);
          messageQueue.delete(id); 
        }
      }
    });

    console.log(`Connection established successfully for ID ${id} as ${isServer ? 'server' : 'client'}`);

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
  
  wss.clients.forEach((ws) => {
    if (ws.readyState === 1) { 
      ws.close(1000, 'Server shutting down');
    }
  });
  
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  clearInterval(pingInterval);
  
  wss.clients.forEach((ws) => {
    if (ws.readyState === 1) { 
      ws.close(1000, 'Server shutting down');
    }
  });
  
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});
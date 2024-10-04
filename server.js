const net = require('node:net');

const PORT = 3008;
const HOST = '127.0.0.1';

// all clients sockets
const clients = [];

const server = net.createServer();

server.on('connection', (socket) => {
  console.log('A new connection to the server!');

  const clientId = clients.length + 1;

  // Broadcasting a message when someone enters the chat room
  clients.forEach((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  socket.write(`id-${clientId}`);
  clients.push({ id: clientId.toString(), socket });

  socket.on('data', (data) => {
    const dataString = data.toString('utf-8');
    const id = dataString.substring(0, dataString.indexOf('-'));
    const message = dataString.substring(dataString.indexOf('-message-') + 9);

    clients.forEach((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  // Broadcasting a message when someone leaves from the chat room
  socket.on('error', () => {
    clients.forEach((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log('opened server on', server.address());
});

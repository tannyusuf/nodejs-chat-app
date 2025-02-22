const { ClientRequest } = require("http");
const net = require("net");

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  const clientID = clients.length + 1;
  console.log("A new connection to the server User id is", clientID);

  clients.map((client) => {
    client.socket.write(`> The new user is joined with id: ${clientID}`);
    //add data to txt file
  });

  socket.write(`id-${clientID}`);
  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    clients.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
      //add data to txt file
    });
  });

  clients.push({ id: clientID.toString(), socket });

  socket.on("error", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientID} left!`);
    });
  });
});

server.listen(3008, "127.0.0.1", () => {
  console.log("Opened server on", server.address());
});

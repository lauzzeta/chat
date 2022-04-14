const server = require("./app"),
  SocketIO = require("socket.io"),
  io = SocketIO(server);

let users = {};

io.on("connection", (socket) => {
  socket

    .on("user:connect", (data) => {
      users[socket.id] = data;
      socket.broadcast.emit("user:connect", data);
      io.sockets.emit("user:online", users);
      console.log(`User ${users[socket.id]} connected`);
      console.log(`Online users: ${Object.values(users)}`);
    })

    .on("chat:message", (data) => {
      io.sockets.emit("chat:message", data);
    })

    .on("chat:typing", (data) => {
      socket.broadcast.emit("chat:typing", data);
    })

    .on("disconnect", () => {
      if (users[socket.id]) {
        socket.broadcast.emit("user:disconnect", users[socket.id]);
        console.log(`User ${users[socket.id]} disconnected`);
        delete users[socket.id];
        io.sockets.emit("user:online", users);
        console.log(`Online users: ${Object.values(users)}`);
      }
    });
});

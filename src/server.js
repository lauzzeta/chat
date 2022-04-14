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
      socket.emit("connected", data);
      console.log(`User ${users[socket.id]} connected`);
      console.log(`Online users: ${Object.values(users)}`);
    })

    .on("chat:message", (data) => {
      io.sockets.emit("chat:message", data);
    })

    .on("chat:typing", (data) => {
      socket.broadcast.emit("chat:typing", data);
    })

    .on("user:colorChange", (data) => {
      socket.emit("user:colorChange", data);
      socket.broadcast.emit("broadcastColor", data);
    })

    .on("user:status", (data) => {
      socket.emit("user:status", data);
      socket.broadcast.emit("broadcastStatus", data);
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

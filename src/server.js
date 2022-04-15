const server = require("./app"),
  SocketIO = require("socket.io"),
  io = SocketIO(server);

let users = {};

io.on("connection", (socket) => {
  socket

    .on("user:connect", (data) => {
      users[socket.id] = data;
      socket.emit("myConnection", data);
      socket.broadcast.emit("broadcastConnection", data);
      io.sockets.emit("updateUserList", users);
      console.log(`User ${users[socket.id]} connected`);
      console.log(`Online users: ${Object.values(users)}`);
    })

    .on("chat:message", (data) => {
      io.sockets.emit("newMesssage", data);
    })

    .on("chat:typing", (data) => {
      socket.broadcast.emit("typing", data);
    })

    .on("user:colorChange", (data) => {
      socket.emit("colorChange", data);
      socket.broadcast.emit("broadcastColor", data);
    })

    .on("user:status", (data) => {
      socket.emit("myStatus", data);
      socket.broadcast.emit("broadcastStatus", data);
    })

    .on("disconnect", () => {
      if (users[socket.id]) {
        socket.broadcast.emit("broadcastDisconnection", users[socket.id]);
        console.log(`User ${users[socket.id]} disconnected`);
        delete users[socket.id];
        io.sockets.emit("updateUserList", users);
        console.log(`Online users: ${Object.values(users)}`);
      }
    });
});

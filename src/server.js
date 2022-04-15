const server = require("./app"),
  SocketIO = require("socket.io"),
  io = SocketIO(server);

let users = {};

io.on("connection", (socket) => {
  socket

    .on("user:connect", (data) => {
      users[socket.id] = data;
      socket.emit("myConnection", users[socket.id].username);
      socket.broadcast.emit("broadcastConnection", users[socket.id].username);
      io.sockets.emit("updateUserList", data, users);
      console.log(`User ${users[socket.id].username} connected`);
      console.log(users);
    })

    .on("chat:message", (data) => {
      io.sockets.emit("newMesssage", data);
    })

    .on("chat:typing", (data) => {
      socket.broadcast.emit("typing", data);
    })

    .on("user:colorChange", (data) => {
      users[socket.id].color = data.color;
      socket.emit("colorChange", data, users);
      socket.broadcast.emit("broadcastColor", data, users);
    })

    .on("user:status", (data) => {
      users[socket.id].status = data.status;
      socket.emit("myStatus", data, users);
      socket.broadcast.emit("broadcastStatus", data, users);
    })

    .on("disconnect", (data) => {
      if (users[socket.id]) {
        socket.broadcast.emit(
          "broadcastDisconnection",
          users[socket.id].username
        );
        console.log(`User ${users[socket.id].username} disconnected`);
        delete users[socket.id];
        io.sockets.emit("updateUserList", data, users);
        console.log(users);
      }
    });
});

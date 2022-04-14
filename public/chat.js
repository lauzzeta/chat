const socket = io(),
  colorArray = ["008000", "ff8000", "ff0000"];

let message = document.getElementById("message"),
  color = document.getElementById("color"),
  btn = document.getElementById("send"),
  output = document.getElementById("output"),
  actions = document.getElementById("actions"),
  chatWindow = document.getElementById("chat-window"),
  userStatus = document.getElementById("status"),
  usersOn = document.querySelector(".users"),
  statusColor = "";

function scroll() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendMessage() {
  if (username) {
    if (message.value) {
      socket.emit("chat:message", {
        username,
        message: message.value,
        color: color.value,
      });
      message.value = "";
    }
  } else {
    window.location.reload();
  }
}

window.addEventListener("load", () => {
  if ((username = window.prompt("Username"))) {
    userStatus.value = "Online";
    socket.emit("user:connect", username);
    socket.emit("connected", username);
  } else {
    window.location.reload();
  }
});

color.addEventListener("change", () => {
  socket.emit("user:colorChange", {
    username,
    color: color.value,
  });
});

btn.addEventListener("click", () => {
  sendMessage();
});

userStatus.addEventListener("change", () => {
  socket.emit("user:status", {
    username,
    status: userStatus.value,
  });
});

message.addEventListener("keypress", (e) => {
  if (userStatus.value === "AFK") {
    userStatus.value = "Online";
    socket.emit("user:status", {
      username,
      status: userStatus.value,
    });
  }
  if (e.key !== "Enter") {
    socket.emit("chat:typing", username);
  } else {
    sendMessage();
  }
});

socket

  .on("chat:message", (data) => {
    actions.innerHTML = "";
    output.innerHTML += `<p class="messages"><strong style="color :${data.color}; ">${data.username}</strong>: ${data.message}</p>`;
    scroll();
  })

  .on("user:online", (users) => {
    Object.values(users).forEach((e) => {
      usersOn.innerHTML += `
        <div class="user">
        <img src="img/profile-default.png" alt="">
        <div class="username">${e}</div>
        </div>
        `;
    });
  })

  .on("chat:typing", (data) => {
    if (data) {
      actions.innerHTML = `<p class="output-text">${data} is typing...</p>`;
      scroll();
    }
  })

  .on("user:connect", (data) => {
    if (data) {
      output.innerHTML += `<p class="output-text">${data} <strong style="color:#${colorArray[0]}; ">connected</strong></p>`;
      scroll();
      usersOn.innerHTML = "";
    }
  })

  .on("connected", (data) => {
    if (data) {
      output.innerHTML += `<p class="output-text"><strong style="color:#${colorArray[0]}; ">Connected</strong> as ${data}</p>`;
      scroll();
    }
  })

  .on("user:colorChange", (data) => {
    if (data) {
      output.innerHTML += `<p class="output-text">Succesfully changed your username color to: <strong style="color :${data.color}; ">${data.color}</strong></p>`;
      scroll();
    }
  })

  .on("broadcastColor", (data) => {
    if (data) {
      output.innerHTML += `<p class="output-text">${data.username} changed his username color to: <strong style="color :${data.color}; ">${data.color}</strong></p>`;
      scroll();
    }
  })

  .on("user:status", (data) => {
    if (data) {
      if (data.status === "Online") {
        statusColor = colorArray[0];
      } else if (data.status === "AFK") {
        statusColor = colorArray[1];
      } else {
        statusColor = colorArray[2];
      }
      output.innerHTML += `<p class="output-text">Status changed to <strong style="color :#${statusColor}; ">${data.status}</strong></p>`;
      console.log(statusColor);
      scroll();
    }
  })

  .on("broadcastStatus", (data) => {
    if (data) {
      if (data.status === "Online") {
        statusColor = colorArray[0];
      } else if (data.status === "AFK") {
        statusColor = colorArray[1];
      } else {
        statusColor = colorArray[2];
      }
      output.innerHTML += `<p class="output-text">${data.username} changed his status to <strong style="color :#${statusColor}; ">${data.status}</strong></p>`;
      console.log(statusColor);
      scroll();
    }
  })

  .on("user:disconnect", (data) => {
    if (data) {
      output.innerHTML += `<p class="output-text">${data} <strong style="color:#${colorArray[2]}; ">disconnected</strong></p>`;
      scroll();
      usersOn.innerHTML = "";
    }
  });

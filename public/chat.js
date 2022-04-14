const socket = io();

let message = document.getElementById("message"),
  color = document.getElementById("color"),
  btn = document.getElementById("send"),
  output = document.getElementById("output"),
  actions = document.getElementById("actions"),
  chatWindow = document.getElementById("chat-window");
usersOn = document.querySelector(".users");

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
    socket.emit("user:connect", username);
    socket.emit("connected", username);
  } else {
    window.location.reload();
  }
});

btn.addEventListener("click", () => {
  sendMessage();
});

message.addEventListener("keypress", (e) => {
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
      actions.innerHTML = `<p class="output-text"${data} is typing...</p>`;
      scroll();
    }
  })

  .on("user:connect", (data) => {
    if (data) {
      output.innerHTML += `<p class="output-text">${data} connected</p>`;
      scroll();
      usersOn.innerHTML = "";
    }
  })
  .on("connected", (data) => {
    if (data) {
      output.innerHTML += `<p class="output-text">Connected as ${data}</p>`;
      scroll();
    }
  })

  .on("user:disconnect", (data) => {
    if (data) {
      output.innerHTML += `<p class="output-text">${data} disconnected</p>`;
      scroll();
      usersOn.innerHTML = "";
    }
  });

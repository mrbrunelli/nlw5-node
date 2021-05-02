const socket = io();
let connectionsUsers = [];

socket.on("admin_list_all_users", (connections) => {
  connectionsUsers = connections;
  document.getElementById("list_users").innerHTML = "";
  const template = document.getElementById("template").innerHTML;
  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });
    document.getElementById("list_users").innerHTML += rendered;
  });
});

const call = (id) => {
  const connection = connectionsUsers
    .find((connection) => connection.socket_id === id);
  const template = document.getElementById("admin_template").innerHTML;
  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user.id,
  });
  document.getElementById("supports").innerHTML += rendered;
  const params = {
    user_id: connection.user.id,
  };
  socket.emit("admin_user_in_support", params);
  socket.emit("admin_list_messages_by_user", params, (messages) => {
    const divMessages = document.getElementById(
      `allMessages${connection.user_id}`,
    );
    messages.forEach((message) => {
      const createDiv = document.createElement("div");
      if (message.admin_id === null) {
        createDiv.className = "admin_message_client";
        createDiv.innerHTML = `<small>${connection.user.email}:`;
        createDiv.innerHTML += `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${
          dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")
        }</span>`;
      } else {
        createDiv.className = "admin_message_admin";
        createDiv.innerHTML = `<small>Atendente:</small>`;
        createDiv.innerHTML += `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date">${
          dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")
        }</span>`;
      }
      divMessages.appendChild(createDiv);
    });
    scrollToBottom(".admin_list_messages");
  });
};

const sendMessage = (id) => {
  const text = document.getElementById(`send_message_${id}`);
  const params = {
    text: text.value,
    user_id: id,
  };
  socket.emit("admin_send_message", params);
  const divMessages = document.getElementById(`allMessages${id}`);
  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_admin";
  createDiv.innerHTML = `<small>Atendente:</small>`;
  createDiv.innerHTML += `<span>${params.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${
    dayjs().format("DD/MM/YYYY HH:mm:ss")
  }</span>`;
  divMessages.appendChild(createDiv);
  text.value = "";
  scrollToBottom(".admin_list_messages");
};

socket.on("admin_receive_message", (data) => {
  const connection = connectionsUsers.find((c) => c.socket_id = data.socket_id);
  const divMessages = document.getElementById(
    `allMessages${connection.user_id}`,
  );
  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_client";
  createDiv.innerHTML = `<small>${connection.user.email}:`;
  createDiv.innerHTML += `<span>${data.message.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${
    dayjs(data.message.created_at).format("DD/MM/YYYY HH:mm:ss")
  }</span>`;
  divMessages.appendChild(createDiv);
  scrollToBottom(".admin_list_messages");
});

const scrollToBottom = (selector) => {
  const listMessages = document.querySelector(selector);
  listMessages.scrollTop = listMessages.scrollHeight;
};

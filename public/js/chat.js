let socketAdminId = null;
let emailUser = null;
let socket = null;

document.querySelector("#start_chat").addEventListener("click", (event) => {
  socket = io();

  const chat_help = document.getElementById("chat_help");
  chat_help.style.display = "none";

  const chat_in_support = document.getElementById("chat_in_support");
  chat_in_support.style.display = "block";

  const email = document.getElementById("email").value;
  emailUser = email;
  const text = document.getElementById("txt_help").value;

  socket.on("connect", () => {
    const params = {
      email,
      text,
    };
    socket.emit("client_first_acesss", params, (callback, err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(callback);
      }
    });
  });

  socket.on("client_list_all_messages", (messages) => {
    const templateClient =
      document.getElementById("message-user-template").innerHTML;
    const templateAdmin = document.getElementById("admin-template").innerHTML;
    messages.forEach((message) => {
      if (message.admin_id === null) {
        const rendered = Mustache.render(templateClient, {
          message: message.text,
          email,
        });
        document.getElementById("messages").innerHTML += rendered;
      } else {
        const rendered = Mustache.render(templateAdmin, {
          message_admin: message.text,
        });
        document.getElementById("messages").innerHTML += rendered;
      }
    });
    scrollToBottom(".text_support");
  });

  socket.on("admin_send_to_client", (message) => {
    socketAdminId = message.socket_id;
    const templateAdmin = document.getElementById("admin-template").innerHTML;
    const rendered = Mustache.render(templateAdmin, {
      message_admin: message.text,
    });
    document.getElementById("messages").innerHTML += rendered;
    scrollToBottom(".text_support");
  });
});

document.querySelector("#send_message_button")
  .addEventListener("click", (event) => {
    const text = document.getElementById("message_user");
    const params = {
      text: text.value,
      socket_admin_id: socketAdminId,
    };
    socket.emit("client_send_to_admin", params);
    const templateClient =
      document.getElementById("message-user-template").innerHTML;
    const rendered = Mustache.render(templateClient, {
      message: text.value,
      email: emailUser,
    });
    document.getElementById("messages").innerHTML += rendered;
    text.value = "";
    scrollToBottom(".text_support");
  });

const scrollToBottom = (selector) => {
  const listMessages = document.querySelector(selector);
  listMessages.scrollTop = listMessages.scrollHeight;
};

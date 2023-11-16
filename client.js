$(document).ready(() => {
    const socket = io();

    const username = prompt("Enter your username:");
    socket.emit('authenticate', username);

    $('form').submit(() => {
        socket.emit('chat message', $('#message-input').val());
        $('#message-input').val('');
        return false;
    });

    socket.on('chat message', (msg) => {
        $('#chat').append($('<p>').text(`${msg.user}: ${msg.message}`));
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });

    socket.on('update users', (userList) => {
        $('#user-list').empty();
        userList.forEach((user) => {
            $('#user-list').append($('<li>').text(user));
        });
    });
});

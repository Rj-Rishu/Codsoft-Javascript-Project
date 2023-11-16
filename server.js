const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (users[socket.id]) {
            io.emit('chat message', { user: 'System', message: `${users[socket.id]} has left the chat.` });
            delete users[socket.id];
            io.emit('update users', Object.values(users));
        }
    });

    socket.on('authenticate', (username) => {
        users[socket.id] = username;
        io.emit('chat message', { user: 'System', message: `${username} has joined the chat.` });
        io.emit('update users', Object.values(users));
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', { user: users[socket.id], message: msg });
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

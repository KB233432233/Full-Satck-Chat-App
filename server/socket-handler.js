io = require('socket.io')();
const authentication = require('./middlewares/auth');
const Message = require('./models/message');
const User = require('./models/user');

const users = {}

io.use(authentication);

io.on('connection', socket => {
    onSocketConnected(socket);
    socket.on('message', data => onMessage(socket, data));
    initialData(socket);
    socket.on('disconnect', () => onSocketDisConnected(socket));
})


const onSocketConnected = (socket) => {
    console.log('New client connected: ' + socket.id);
    socket.join(socket.user.id);
    users[socket.user.id] = true;
    let room = io.sockets.adapter.rooms[socket.user.id];
    if (!room || room.length === 1) {
        io.emit('user_status', {
            [socket.user.id]: true,
        })
    }
}


const onSocketDisConnected = (socket) => {
    let room = io.sockets.adapter.rooms[socket.user.id];
    if (!room || room.length < 1) {
        let lastSeen = new Date().getTime();
        users[socket.user.id] = lastSeen;
        io.emit('user_status', {
            [socket.user.id]: lastSeen,
        });
    }

    console.log('Asshole disconnected: ' + socket.user.username);
}


const onMessage = (socket, data) => {
    let sender = socket.user.id;
    let receiver = data.receiver;
    let message = {
        sender: sender, receiver: receiver, content: data.content, date: new Date().getTime()
    };
    Message.create(message);
    socket.to(receiver).to(sender).emit('message', message);

}


const getMessages = userId => {
    let where = [
        { sender: userId }, { receiver: userId }
    ];
    return Message.find().or(where);
}


const getUsers = userId => {
    let where = {
        _id: { $ne: userId }
    };
    return User.find(where).select('-password');
}

const initialData = socket => {
    let user = socket.user;
    let messages = [];
    getMessages(user.id)
        .then(data => {
            messages = data;
            return getUsers(user.id);
        })
        .then(contacts => {
            socket.emit('data', user, contacts, messages, users);
        })
        .catch(() => socket.disconnect());


}
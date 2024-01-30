io = require('socket.io')();
const authentication = require('./middlewares/auth');
const Message = require('./models/message');
const User = require('./models/user');


io.use(authentication);

io.on('connection', socket => {
    initialData(socket);
    onSocketConnected(socket);
    socket.on('message', data => onMessage(socket, data));
    socket.on('typing', receiver => onTyping(socket, receiver));
    socket.on('seen', sender => onSeen(socket, sender));
    socket.on('disconnect', () => onSocketDisConnected(socket));
})


const onSocketConnected = async (socket) => {
    console.log('New client connected: ' + socket.id);
    socket.join(socket.user.id);
    let room = io.sockets.adapter.rooms[socket.user.id];

    if (!room || room.length === 1) {
        await User.updateOne({ username: socket.user.username }, { status: true });
        await socket.broadcast.emit('user_status', {
            [socket.user.id]: true,
        });
    }
}


const onSocketDisConnected = async (socket) => {
    let room = io.sockets.adapter.rooms[socket.user.id];
    if (!room || room.length < 1) {
        let lastSeen = new Date().getTime();
        await User.updateOne({ username: socket.user.username }, { status: lastSeen });
        await socket.broadcast.emit('user_status', {
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
    io.to(receiver).emit('message', message);

}


const onTyping = async (socket, receiver) => {
    let sender = socket.user.id;
    io.to(receiver).emit('typing', sender);
}

const onSeen = async (socket, sender) => {
    let receiver = socket.user.id;
    await Message.updateMany({ sender, receiver, seen: false }, { seen: true }, { multi: true });
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

const initialData = async socket => {
    let user = socket.user;
    let messages = await getMessages(user.id);
    let contacts = await getUsers(user.id);
    socket.emit('data', user, contacts, messages);
}
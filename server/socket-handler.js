io = require('socket.io')();
const authentication = require('./middlewares/auth');
const Message = require('./models/message');
const User = require('./models/user');

io.use(authentication);

io.on('connection', socket => {
    socket.join(socket.user.id);
    socket.on('message', data => onMessage(socket, data));
    console.log('New client connected: ' + socket.id);
    initialData(socket);
})


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
            socket.emit('data', user, contacts, messages);
        })
        .catch(() => socket.disconnect());


}
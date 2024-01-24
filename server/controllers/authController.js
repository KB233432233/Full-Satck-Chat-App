const User = require('../models/user');

const register = async (req, res, next) => {
    let data = { name, username, password } = req.body;

    const user = await User.findOne({ username });
    if (user) {
        return res.status(422).send('username already exits');
    }
    const user2 = await User.create(data);

    res.json(user2.signJwt());
    sendNewUser(user2);
}

const login = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !user.checkPassword(password)) {
        return res.status(401).send('invalid username or password');
    }
    return res.json(user.signJwt());
}

const sendNewUser = async (user) => {
    let data = { name, username, avatar } = user;

    io.emit('new_user', data);
}



module.exports = {
    register,
    login,
    sendNewUser,
}
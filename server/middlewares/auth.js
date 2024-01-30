const User = require('../models/user');

const createError = require('http-errors');

const jwt = require('jsonwebtoken');


const authentication = async (socket, next) => {
    if (!socket.handshake.query || !socket.handshake.query.token) {
        return next(createError(401, 'auth-error'));
    }
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return next(createError(401, 'auth_error'));
        const user = await User.findById(decoded.id)
        if (!user) return next(createError(401, 'auth_error'));
        socket.user = user;
        next()
    }).catch(next)
}



const authenticated = async (req, res, next) => {
    let token = req.headers['authorization'];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(createError(401));
        User.findById(decoded.id).then(user => {
            if (!user) throw createError(401);
            req.user = user;
            next();
        }).catch(next);
    });
};


module.exports = { authentication, authenticated };


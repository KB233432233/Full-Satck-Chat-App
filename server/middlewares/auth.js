const User = require('../models/user');

const createError = require('http-errors');

const jwt = require('jsonwebtoken');


// exports.socket = (socket, next) => {
//     if (!socket.handshake.query || !socket.handshake.query.token) {
//         return next(createError(401, 'auth_error'))
//     }
//     jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) return next(createError(401, 'auth_error'));
//         User.findById(decoded.id).then(user => {
//             if (!user) return next(createError(401, 'auth_error'));
//             socket.user = user;
//             next()
//         })
//             .catch(next);
//     })
// }


const authentication = async (socket, next) => {
    if (!socket.handshake.query || !socket.handshake.query.token) {
        return res.status(401).send('auth-error');
    }
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).send('auth_error');
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send('auth_error');
        socket.user = user;;
        next()
    }).catch(next)
}

module.exports = authentication
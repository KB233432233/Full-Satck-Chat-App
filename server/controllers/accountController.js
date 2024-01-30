


const profile = (req, res, next) => {


    const user = req.user;
    user.name = req.body.name;
    user.about = req.body.about;

    user.save()
        .then(updated => {
            sendUpdateUser(updated);
            res.json();
        })
        .catch(next);
}

const sendUpdateUser = (user) => {
    io.emit('update_user', user.getData());
};


module.exports = { profile };
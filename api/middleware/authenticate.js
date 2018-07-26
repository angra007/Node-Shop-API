var User = require ('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    
    if (token) {
        User.findByToken (token).then ( (user) => {
            if (!user) {
                console.log ('No User Here')
                const error = new Error ('Invalid token');
                error.status = 401;
                next (error)
            }
            req.user = user;
            req.token = token;
            next ();
        }, (error) => {
            next (error);
        })
    }
    else {
        const error = new Error ('Invalid token');
        error.status = 401;
        next (error)
    }

    
};

module.exports = {authenticate}
const express = require ('express');
const route = express.Router ();

const User = require ('./../models/user')

route.post ('/signup', (req, res, next) => {

    var user = new User ( {
        email : req.body.email,
        password : req.body.password
    })

    user.save ().then ( () => {
        return user.generateAuthToken ();
    }).then ((token) => {
        console.log (user);
        res.header('x-auth', token).send (user);
    }).catch ((error) => {
        res.status (400).send (error);
    });

})

route.post ('/login', (req, res, next) => { 


})


module.exports = route;
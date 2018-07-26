const express = require ('express');
const bcrypt = require ('bcryptjs');
const route = express.Router ();
const _ = require ('lodash');
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
    
    var email = req.body.email;
    var password = req.body.password;

    User.findOne ( { email }).then  ( (user) => {
        if (!user) {
            var response = {
                status : 400,
                message : "Invalid Username or Password"
            }
            res.status (400).send (response);
        }
        else {
            bcrypt.compare  (password, user.password, (error, response) => {
                if (response) {
                    user.generateAuthToken ().then ( (token) => {
                        res.header('x-auth', token).send (user);
                    }).catch ( (error) => {
    
                    })
                }
                else {
    
                    var response = {
                        status : 400,
                        message : "Invalid Username or Password"
                    }
                    res.status (400).send (response);
                }
            })
        }
    }).catch ( (error) => {
        
    })
    
})


module.exports = route;
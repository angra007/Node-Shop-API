
const mongoose = require ('mongoose');
const validator = require ('validator');
const jwt = require ('jsonwebtoken');
const _ = require ('lodash');
const bcrypt = require ('bcryptjs');

var UserSchema =  mongoose.Schema ({
    email : {
        type : String,
        minlength : 1,
        required : true,
        trim : true,
        validate : {
            validator: validator.isEmail,
            message : '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
        require : true,
        minlength : 6
    },
    tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject ();

    return _.pick (userObject, ['_id','email']);
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign ({ _id : user._id.toHexString (), access }, 'abc123').toString ();
    
    user.tokens = user.tokens.concat ([{access, token}]);
    return user.save ().then ( () => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    
    var User = this
    var decoded;
    try {
        decoded = jwt.verify (token, "abc123")

        return User.findOne ({
            '_id': decoded._id,
            'tokens.token' : token,
            'tokens.access' : 'auth'
        });
    }
    catch (e) {
        const error = new Error ('Invalid token');
        error.status = 401;
        return Promise.reject (error);
    }
}

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this


    
}

UserSchema.pre ('save', function (next) {
    var user = this;
    if (user.isModified ('password')) {
        bcrypt.genSalt (10, (error, salt) => {
            bcrypt.hash (user.password, salt, (error, hash) => {
                user.password = hash
                next ();
            })
        })
    } else {
        next ();
    }
})

module.exports = mongoose.model ('User', UserSchema);
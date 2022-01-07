const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema  = new mongoose.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
        uppercase: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
    },
    position:{
        type: String,
    }
});

UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({
        email:email
    }).exec(function(error,user){
        if(error){
            console.log(error)
        } else if(!user){
            var err = new Error("User not found");
            err.status = 401;
            console.log(err);
        }// if user exists
        bcrypt.compare(password, user.password, function(error,result){
            if(result === true){
                return callback(null, user);
            } else {
                return callback()
            }
        })
    })
}

UserSchema.pre("save", function(next){
    const user  = this;
    bcrypt.hash(user.password, 10,(err, hash)=>{
        if(err){
            return next();
        }
        user.password = hash;
        next();
    });
});

const User = mongoose.model("User", UserSchema); 
module.exports = User;
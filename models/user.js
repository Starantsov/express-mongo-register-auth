const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    }
});
userSchema.statics.authenticate = function(email, password, callback){
    User.findOne({ email })
        .exec((error, user) => {
            if(error) return callback(error);
            else if(!user) return callback(new Error("User not found!"));

            bcrypt.compare(password, user.password, function(err, result){
                if(err) return next(err);

                return result ? callback(null, user) : callback();
            })
        })
};
userSchema.statics.getName = function(id, callback){
    if(id){
        User.findById(id)
            .exec((err, user)=>{
                if(err) callback(err);
                callback(null, user.name);
            })
    }else {
        callback(new Error("User is not authorized"));
    }
};
userSchema.pre("save", function(next){
    const user = this;
    bcrypt.hash(user.password, 10, function(err,hash){
        if(err) return next(err);
        user.password = hash;
        next();
    })
});


const User = mongoose.model("User", userSchema);
module.exports = User;
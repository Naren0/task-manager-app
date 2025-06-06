const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task')

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }   

    },
    password:{
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            } else if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain the word "password"');
            } else if (!validator.isStrongPassword(value, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
                throw new Error('Password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol');

            }
        }
    },avatar: {
    type: Buffer
},
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
    
},

{
    timestamps:true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, jwtSecretKey, { expiresIn: '7 days' });
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject;

}
    

//hash the password before saving the user model
userSchema.pre('save', async function(next) {
    const user = this;

    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

//Delete user tasks when user is removed

userSchema.pre('deleteOne', async function(next){
    const user = this;
    await Task.deleteMany({owner: user._id})

    next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;
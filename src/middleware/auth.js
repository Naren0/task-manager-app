const jwt = require('jsonwebtoken')
const User = require('../models/user')

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, jwtSecretKey)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch(e){
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth;
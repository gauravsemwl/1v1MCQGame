const User = require('../db/models/users')
const jwt = require('jsonwebtoken')
const auth = async function (req, res, next) {

    try {
        let token


        token = req.cookies.jwt

        if (!token) {
            console.log('mkc')
            throw new Error('no token provided')
        }

        const decoded = jwt.verify(token, 'ihopeitworksforme')

        const user = await User.findOne({ _id: decoded._id })

        if (!user) {
            throw new Error('User Not Authenticated')
        }

        if (user)

            req.user = user



        next()
    }
    catch (e) {
        return res.status(401).send(e)
    }
}

module.exports = auth
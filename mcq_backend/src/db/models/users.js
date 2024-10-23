const mongoose = require('../mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')


const UserSchema = new Schema({
    gameName: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: [true, 'Username not availaible']
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                return new Error('Password cannot contain "passwoed"')
            }
        }
    }
})


UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens
    delete userObject.password

    return userObject
}

UserSchema.methods.genAuthToken = async function (res) {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'ihopeitworksforme', {
        expiresIn: '30d'
    })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/'
    })

}



UserSchema.statics.findByCredentials = async (gameName, password) => {
    const user = await User.findOne({ gameName: gameName })

    if (!user) {
        throw new Error('No such Username found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Wrong Password')
    }

    return user
}

UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User
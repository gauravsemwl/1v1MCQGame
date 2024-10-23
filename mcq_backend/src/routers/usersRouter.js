const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../db/models/users')
const auth = require('../middleware/auth')


router.get('/users/auth-check', async (req, res) => {
    try {
        let token


        token = req.cookies.jwt

        if (!token) {
            throw new Error('no token provided')
        }


        const decoded = jwt.verify(token, 'ihopeitworksforme')


        const user = await User.findOne({ _id: decoded._id })

        if (!user) {
            throw new Error('User Not Authenticated')
        }

        res.status(200).send({
            _id: user._id,
            gameName: user.gameName
        })
    }
    catch (e) {
        console.log(e)
        return res.status(401).send(e)
    }
})

router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        await user.genAuthToken(res)
        res.status(201).send(user)
    }
    catch (e) {
        res.status(400).send({ error: e.message, code: e.code })
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.gameName, req.body.password)
        if (!user) {
            return res.status(400).send({ error: 'user not found' })
        }
        await user.genAuthToken(res)
        res.send(user)
    }
    catch (e) {
        console.log(e)
        res.status(401).send({
            error: e.message
        })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).send("logged out successfully")
    }
    catch (e) {
        res.status(500).send({
            error: 'Sorry Could not logout'
        })
    }

})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }
    catch (e) {
        res.status(500).send({
            error: 'Sorry could not logout from all devices'
        })
    }

})

router.get('/users/me', auth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    }
    catch (e) {
        res.status(500).send({
            error: 'Couldnt fetch user Profile'
        })
    }
})


router.get('/users/:id', async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        res.send(user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/users', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["gameName", "password"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates " })
    }

    try {
        const user = req.user

        if (!user) {
            res.status(404).send({
                error: 'Could not find user'
            })
        }

        updates.forEach(function (update) {
            user[update] = req.body[update]
        })

        await user.save()


        res.send(user)
    }
    catch (e) {
        res.status(400).send({
            error: 'Unable to Update'
        })
    }

})

router.delete('/users', auth, async (req, res) => {
    try {
        const user = req.user

        if (!user) {
            return res.status(404).send({
                error: 'User not found'
            })
        }

        const countDel = await User.deleteOne(user)

        if (countDel == 0) {
            return res.status(404).send({
                error: 'Unable to delete'
            })
        }

        res.status(201).send("Deleted Successfully")

    }
    catch (e) {
        res.status(500).send({
            error: e.message,
        })
    }
})

module.exports = router
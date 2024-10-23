const pusher = require('../pusher.js')
const express = require('express')
const router = express.Router()
const Game = require('../db/models/games.js')
const User = require('../db/models/users.js')

router.post('/pusher/user-auth', async (req, res) => {
    try {
        const socketId = req.body.socket_id

        const user = {
            id: req.body._id,
            name: req.body.gameName
        }
        console.log(user, socketId)

        const authResponse = pusher.authenticateUser(socketId, user)

        if (!authResponse) {
            return res.status(403).send({ error: 'could not athenticate user' })
        }

        res.status(200).send(authResponse)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.post('/pusher/auth', async (req, res) => {
    const socketId = req.body.socket_id
    console.log(socketId)
    const channel = req.body.channel_name
    console.log(channel)
    const gameId = channel.split('-')[1]
    const fromUser = req.body._id
    console.log(fromUser)
    try {
        const game = await Game.findOne({ _id: gameId })

        const user = await User.findOne({ _id: fromUser })

        if (!game) {
            return res.status(404).send({ message: 'game not found' })
        }

        if (!user) {
            return res.status(404).send({ message: 'user not found' })
        }


        if (fromUser === game.player1.toString() || fromUser === game.player2.toString()) {
            const presenceData = {
                user_id: user._id,
                user_name: user.gameName
            }
            const authResponse = pusher.authorizeChannel(socketId, channel, presenceData)

            return res.status(200).send(authResponse)
        }


        res.status(403).send({ message: 'could not autharize' })

    }
    catch (e) {
        // console.log(e)
        res.status(500).send(e)
    }
})

module.exports = router
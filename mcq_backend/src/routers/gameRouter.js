const express = require('express')
const pusher = require('../pusher.js')
const router = express.Router()
const Game = require('../db/models/games.js')
const User = require('../db/models/users')
const auth = require('../middleware/auth')



router.post('/games', auth, async (req, res) => {
    const game = new Game(req.body)
    try {
        await game.save()
        pusher.trigger('new-games', 'created', game)
        res.status(201).send(game)
    }
    catch (e) {
        console.log(e)
        res.status(400).send({ error: 'could not start Game' })
    }
})

router.post('/games/join-req/:id', async (req, res) => {
    const gameId = req.params.id
    const fromUser = req.body.fromUser
    const userGameName = req.body.gameName

    try {
        const game = await Game.findOne({ _id: gameId })

        const toUser = game.player1

        if (!game) {
            return res.status(404).send({ error: 'game does not exist' })
        }

        pusher.sendToUser(`${toUser}`, 'join-req', {
            fromUser: fromUser,
            userGameName: userGameName,
            gameId: gameId,
            name: game.name
        })

        return res.status(200).send({ message: 'req sent' })
    }
    catch (e) {
        res.send(500).send(e)
    }


})

router.post('/games/join-req-res/:id', async (req, res) => {
    const gameId = req.params.id
    const toUser = req.body.toUser
    const response = req.body.response


    try {
        const game = await Game.findOne({ _id: gameId })

        if (!game) {
            return res.status(404).send({ error: 'game does not exist' })
        }


        if (response === "ACCEPTED") {
            game.player2 = toUser

            const player2 = await User.findOne({ _id: toUser })

            await game.save()
            pusher.sendToUser(`${game.player1}`, 'player2', {
                game_id: gameId,
                player2: game.player2,
                player2Name: player2.gameName
            })
        }

        pusher.sendToUser(`${toUser}`, 'join-req-res', {
            game_id: game._id.toString(),
            name: game.name,
            response: response
        })


        res.status(200).send({ message: 'responce accepted' })
        console.log("hi")

    }
    catch (e) {
        console.log(e)
    }
})


router.get('/games', auth, async (req, res) => {

    try {
        const games = await Game.find({})
        res.status(201).send(games)
    }
    catch (e) {
        res.status(500).send({ error: 'could not fetch games' })
    }
})

router.get('/games/:id', auth, async (req, res) => {

    try {
        const game = await Game.findOne({ _id: req.params.id })

        if (!game) {
            res.status(404).send({ error: "game not found" })
        }

        res.status(201).send(game)
    }
    catch (e) {
        res.status(500).send({ error: 'could not fetch game' })
    }
})

router.delete('games/:id', auth, async (req, res) => {
    const id = req.params.id
    try {
        const game = await Game.findOne({ _id: id })
        if (!game) {
            res.status(404).send('Game not found')
        }

        const countdel = await Game.deleteOne(game)

        if (!countdel) {
            res.status(404).send('Game not found')
        }
        req.io.emit('deletegame', id)

        req.io.to(id).emit('roomclosed')

        const clients = await req.io.in(id).allSockets()

        clients.forEach(clientId => {
            req.io.sockets.sockets.get(clientId).leave(id)
        })


        res.status(201).send('Game delted successfully')
    }
    catch (e) {

    }
})
module.exports = router


const express = require('express')
const pusher = require('../pusher.js')
const router = express.Router()
const Game = require('../db/models/games.js')
const MCQ = require('../db/models/mcq.js')
const MCQGame = require('../db/models/mcqGames.js')
const auth = require('../middleware/auth.js')
const { GAME_STATE } = require('../constants.js')
const User = require('../db/models/users.js')

const gameInterval = {}

const handlegame = async (game, action, options) => {
    if (action === "INITIALIZE") {
        game.timer = options.countDownTime

        game.state = "INITIALIZING"

        await game.save()

        gameInterval[game._id] = setInterval(async () => {
            pusher.trigger(`presence-${game._id}`, 'init-count', { timer: game.timer, state: game.state })
            game.timer = game.timer - 1
            await game.save()
            if (game.timer < 0) {
                clearInterval(gameInterval[game._id])
                gameInterval[game._id] = null;

                await handlegame(game, "REQ_ASK", {
                    countDownTime: 20,
                    currentTurn: game.player1
                })
            }
        }, 1000)

        return
    }
    if (action === "REQ_ASK") {
        game.timer = options.countDownTime

        game.state = "ASK"

        game.currentTurn = options.currentTurn

        await game.save()

        gameInterval[game._id] = setInterval(async () => {
            pusher.trigger(`presence-${game._id}`, 'ask', {
                timer: game.timer,
                state: game.state,
                currentTurn: game.currentTurn
            })
            game.timer = game.timer - 1
            await game.save()
            if (game.timer < 0) {
                clearInterval(gameInterval[game._id])
                gameInterval[game._id] = null;

                if (game.currentTurn.toString() === game.player1.toString()) {
                    game.player2Score = game.player2Score + 1
                }
                else {
                    game.player1Score = game.player1Score + 1
                }

                await game.save()

                pusher.trigger(`presence-${game._id}`, 'update-score', {
                    player1Score: game.player1Score,
                    player2Score: game.player2Score
                })

                if (game.player1Score + game.player2Score >= 6) {
                    await handlegame(game, "SEND_RESULT", {})
                    return
                }

                await handlegame(game, "REQ_ASK", {
                    countDownTime: 20,
                    currentTurn: game.currentTurn.toString() === game.player1.toString() ? game.player2 : game.player1
                })
            }
        }, 1000)

    }
    if (action === "REQ_ANSWER") {
        game.state = "ANSWER"

        game.timer = options.countDownTime

        game.currentTurn = options.currentTurn


        const mcq = options.mcq

        await game.save()

        gameInterval[game._id] = setInterval(async () => {
            pusher.trigger(`presence-${game._id}`, 'answer', {
                timer: game.timer,
                state: game.state,
                currentTurn: game.currentTurn,
                mcq: mcq
            })

            game.timer = game.timer - 1
            await game.save()

            if (game.timer < 0) {
                clearInterval(gameInterval[game._id])
                gameInterval[game._id] = null;

                if (game.currentTurn.toString() === game.player1.toString()) {
                    game.player2Score = game.player2Score + 1
                }
                else {
                    game.player1Score = game.player1Score + 1
                }

                await game.save()

                pusher.trigger(`presence-${game._id}`, 'update-score', {
                    player1Score: game.player1Score,
                    player2Score: game.player2Score
                })

                if (game.player1Score + game.player2Score >= 6) {
                    await handlegame(game, "SEND_RESULT", {})
                    return
                }

                await handlegame(game, "REQ_ASK", {
                    countDownTime: 20,
                    currentTurn: game.currentTurn
                })
            }

        }, 1000)
    }

    if (action === "SEND_RESULT") {
        if (game.player1Score.toString() === game.player2Score.toString()) {
            pusher.trigger(`presence-${game._id}`, 'result', {
                winner: [game.player1.toString(), game.player2.toString()]
            })
            return;
        }
        else if (game.player1Score > game.player2Score) {
            pusher.trigger(`presence-${game._id}`, 'result', {
                winner: [game.player1.toString()]
            })
            return
        }
        else if (game.player1Score < game.player2Score) {
            pusher.trigger(`presence-${game._id}`, 'result', {
                winner: [game.player2.toString()]
            })
            return
        }
        game.state = "OVER"
        await game.save()
    }

}


router.post('/gamearena/startgame/:id', auth, async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id })

        if (!game) {
            return res.status(404).send({ error: "could not find the game" })
        }

        const player1 = await User.findOne({ _id: game.player1 })
        const player2 = await User.findOne({ _id: game.player2 })


        gameInterval[game._id] = null
        await handlegame(game, "INITIALIZE", {
            countDownTime: 10,
        })

        res.status(200).send({ player1: player1.gameName, player2: player2.gameName })

    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.post(`/gamearena/ask/:id/:playerId`, async (req, res) => {
    const game_id = req.params.id
    const playerId = req.params.playerId

    req.body["game_id"] = game_id

    try {

        let game = await Game.findOne({ _id: game_id })

        if (!game) {
            return res.status(404).send({ error: "could not find the game" })
        }

        if (gameInterval[game_id] && game.currentTurn.toString() === playerId.toString()) {
            clearInterval(gameInterval[game_id])
        }
        else {
            return res.status(404).send({ message: "time is over" })
        }


        const mcq = new MCQGame(req.body)

        await mcq.save()

        game["mcq_id"] = mcq._id

        await game.save()

        await handlegame(game, "REQ_ANSWER", {
            mcq: mcq,
            currentTurn: game.currentTurn.toString() === game.player1.toString() ? game.player2 : game.player1,
            countDownTime: 10,
        })

        res.status(200).send({ message: "question sent" })
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

})

router.post(`/gamearena/save&ask/:id/:userId`, async (req, res) => {
    const game_id = req.params.id
    const user_id = req.params.userId

    req.body["game_id"] = game_id

    try {
        let game = await Game.findOne({ _id: game_id })

        if (!game) {
            return res.status(404).send({ error: "could not find the game" })
        }


        if (gameInterval[game_id] && game.currentTurn.toString() === user_id.toString()) {
            clearInterval(gameInterval[game_id])
        }
        else {
            return res.status(404).send({ message: "time is over" })
        }


        const mcq = new MCQGame(req.body)

        await mcq.save()

        game["mcq_id"] = mcq._id

        await game.save()

        const newMCQ = new MCQ({
            question: mcq.question,
            options: mcq.options,
            answer: mcq.answer,
            user_id: user_id
        })

        await newMCQ.save()

        console.log('jhii')

        await handlegame(game, "REQ_ANSWER", {
            mcq: mcq,
            currentTurn: game.currentTurn.toString() === game.player1.toString() ? game.player2 : game.player1,
            countDownTime: 10,
        })

        res.status(200).send({ message: "question sent" })
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

})

router.post('/gamearena/answer/:id/:playerId', async (req, res) => {
    const game_id = req.params.id
    const mcq_id = req.body.mcq_id
    const answer = req.body.answer
    const playerId = req.params.playerId

    try {

        const game = await Game.findOne({ _id: game_id })

        if (!game) {
            return res.status(404).send({ error: "game not found" })
        }

        if (gameInterval[game_id] && game.currentTurn.toString() === playerId.toString()) {
            clearInterval(gameInterval[game_id])
        }
        else {
            return res.status(404).send({ message: "time is over" })
        }

        const mcq = await MCQGame.findOne({ _id: mcq_id })

        if (!mcq) {
            return res.status(404).send({ error: "mcq not found" })
        }

        if (answer.toString() === mcq.answer.toString()) {
            if (game.currentTurn.toString() === game.player1.toString()) {
                game.player1Score = game.player1Score + 1
            }
            else {
                game.player2Score = game.player2Score + 1
            }
        } else {
            if (game.currentTurn.toString() === game.player1.toString()) {
                game.player2Score = game.player2Score + 1
            }
            else {
                game.player1Score = game.player1Score + 1
            }
        }

        await game.save()

        pusher.trigger(`presence-${game_id}`, 'update-score', {
            player1Score: game.player1Score,
            player2Score: game.player2Score
        })

        if (game.player1Score + game.player2Score >= 6) {
            await handlegame(game, "SEND_RESULT", {})
            return res.status(200).send({ message: "game-over" })
        }

        await handlegame(game, "REQ_ASK", {
            countDownTime: 20,
            currentTurn: game.currentTurn
        })

        res.status(200).send({ message: "score updated" })

    }
    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    currentTurn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    player1Score: {
        type: Number,
        default: 0
    },
    player2Score: {
        type: Number,
        default: 0
    },
    state: {
        type: String,
        default: "NOT INITIALIZED"
    },
    timer: {
        type: Number,
        default: null,
    },
    mcq_id: {
        type: String,
        default: null
    }
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game
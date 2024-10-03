const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mcq-game')

module.exports = mongoose
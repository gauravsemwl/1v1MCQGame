const mongoose = require('../mongoose')

const Schema = mongoose.Schema



const MCQSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },

    options: {
        type: [String],
        required: true,
        trim: true,
        validate: {
            validator: function (values) {
                values.forEach((value) => {
                    if (value.length === 0) {
                        throw new Error('Option cant be an empty String')
                    }
                })
                return values.length > 2
            },
            message: "provide atleast three options"
        }
    },
    answer: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 1 && value <= this.options.length;
            },
            message: 'Answer must be a valid index of the options array'
        }
    },

    user_id: {
        type: String,
        required: true,
        trim: true
    }
})

const MCQ = mongoose.model('mcq', MCQSchema)

module.exports = MCQ 
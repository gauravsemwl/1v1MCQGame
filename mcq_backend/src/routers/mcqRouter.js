const express = require('express')
const router = express.Router()
const MCQ = require('../db/models/mcq.js')
const auth = require('../middleware/auth')


router.post('/mcqs', auth, async (req, res) => {

    req.body["user_id"] = req.user._id.toString()
    const mcq = new MCQ(req.body)

    try {

        await mcq.save()

        res.status(201).send(mcq)
    }
    catch (e) {
        res.status(400).send({
            error: e.message,
            code: e.code,
            message: 'add mcq failed'
        })
    }
})



router.get('/mcqs', auth, async (req, res) => {
    try {
        const mcqs = await MCQ.find({ user_id: req.user._id })
        res.send(mcqs)
    }
    catch (e) {
        res.status(500).send({
            error: e.message,
            code: e.code,
            message: 'could not fetch MCQs'
        })
    }
})


router.get('/mcqs/:id', auth, async (req, res) => {
    const id = req.params.id
    try {
        const mcq = await MCQ.findOne(
            {
                _id: id,
                user_id: req.user._id
            })

        if (!mcq) {
            return res.status(404).send({
                message: 'mcq not found'
            })
        }
        res.send(mcq)
    }
    catch (e) {
        res.status(500).send({
            error: e.message,
            code: e.code,
            message: 'could not fetch MCQ'
        })
    }
})


router.patch('/mcqs/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["question", "options", "answer"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates " })
    }
    try {
        const mcq = await MCQ.findOne({ _id: req.params.id, user_id: req.user._id })

        if (!mcq) {
            return res.status(404).send({
                message: 'MCQ not found'
            })
        }

        updates.forEach((update) => { mcq[update] = req.body[update] })

        await mcq.save()
        res.send(mcq)
    }
    catch (e) {
        console.log(e)
        res.status(400).send({
            error: e.message,
            code: e.code,
            message: 'MCQ not updated'
        })
    }

})


router.delete('/mcqs/:id', auth, async (req, res) => {
    console.log('hi form delete mcq router')
    try {
        const mcq = await MCQ.findOne({ _id: req.params.id, user_id: req.user._id })

        if (!mcq) {
            return res.status(404).send({
                message: 'MCQ not found'
            })
        }

        const countDel = await MCQ.deleteOne(mcq)

        if (countDel === 0) {
            return res.status(404).send({
                message: 'Unable to delete'
            })
        }
        console.log(countDel)

        res.send({
            message: 'deleted'
        })
    }
    catch (e) {
        res.status(500).send({
            error: e.message,
            code: e.code,
            message: 'Could not delete'
        })
    }
})


module.exports = router
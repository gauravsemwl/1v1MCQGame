const path = require('path')
const express = require('express');
const http = require('http')
require('./src/pusher.js')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
require('./src/db/mongoose.js')
const userRouter = require('./src/routers/usersRouter.js')
const mcqRouter = require('./src/routers/mcqRouter.js')
const gameRouter = require('./src/routers/gameRouter.js')
const pusherRouter = require('./src/routers/pusherRouter.js')
const gameArenaRouter = require('./src/routers/gameArenaRouter.js')
const port = 5001
const cors = require('cors')

const app = express()

const server = http.createServer(app)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(userRouter)
app.use(mcqRouter)
app.use(gameRouter)
app.use(pusherRouter)
app.use(gameArenaRouter)

__dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/mcq_frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'mcq_frontend', 'build', 'index.html'))
    )
}
else {
    app.get('/', (req, res) => {
        res.send('apiiii')
    })
}

server.listen(port, () => {
    console.log("Server running at port " + port);
})
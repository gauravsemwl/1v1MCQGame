const express = require('express');
const http = require('http')
require('./pusher.js')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
require('./db/mongoose.js')
const userRouter = require('./routers/usersRouter.js')
const mcqRouter = require('./routers/mcqRouter.js')
const gameRouter = require('./routers/gameRouter.js')
const pusherRouter = require('./routers/pusherRouter.js')
const gameArenaRouter = require('./routers/gameArenaRouter.js')
const port = 5000
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


server.listen(port, () => {
    console.log("Server running at port " + port);
})
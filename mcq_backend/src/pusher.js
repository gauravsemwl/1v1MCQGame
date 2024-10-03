const Pusher = require('pusher')

const pusher = new Pusher({
    appId: "1843782",
    key: "825dedeb6f3b856eef05",
    secret: "796426aeb51f0bd0da49",
    cluster: "ap2",
    useTLS: true
})

module.exports = pusher
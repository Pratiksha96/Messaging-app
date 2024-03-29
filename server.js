var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = 'mongodb+srv://user:user@messaging-app-fbzmm.mongodb.net/test?retryWrites=true&w=majority'

var Message =   mongoose.model('Message',{
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save()
    .then(()=> {
        console.log("saved")
        return Message.findOne({message:'badword'})
   })
    .then(censored=>{
        if (censored) {
        console.log("Censored word found!")
        return Message.remove({ _id: censored.id })
        }
        io.emit('message', req.body)
        res.sendStatus(200)
    })    
    .catch((err) => {
        res.sendStatus(500)
        return console.error(err) 
    })  
})

mongoose.connect(dbUrl,{useNewUrlParser: true}, (err)=>{
    console.log("mongo db connection ",err)
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})
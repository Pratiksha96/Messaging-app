var express = require("express")
var bodyParser = require("body-parser")
var app = express()

var messages = [
    { name:'Tim',message:'Hi' },
    { name:'Jane', message:'Hey' }
]

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.get('/messages', (req,res) => {
    res.send(messages)
})

app.post('/messages', (req,res)=>{
    console.log(req.body)
    messages.push(req.body)
    res.sendStatus(200)
})

var server = app.listen(3000, () => {
    console.log("Server started on port",server.address().port)
})
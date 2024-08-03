const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const PORT = 3000
const path = require('path')
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
app.use(express.static(path.join(__dirname, 'public')))
const TOKEN = '7121504275:AAHPive5eXJbB8RssVnYWZeBgloZZ7nXGvs';
const chatId = '1132590035'
const bot = new TelegramBot(TOKEN, {polling: true})
mongoose.connect(`mongodb+srv://zubalana0:pscc865qqDLqzpv3@cluster0.n2nxzri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log(`Connected to mongo DB`)
})

io.on('connection', (socket)=>{
    console.log(`New user connected`)
    bot.sendMessage(chatId, `New user connected`)
    socket.on('disconnect', ()=>{
        console.log(`User disconnected`)
    })
})



app.get('/', (req,res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})

server.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})
const express = require('express');
const http = require('http')
const socketIo = require('socket.io')
const Telagrambot = require('node-telegram-bot-api')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const PORT = 3000
const path = require('path')
const mongoose = require('mongoose');
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req,res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})

server.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})
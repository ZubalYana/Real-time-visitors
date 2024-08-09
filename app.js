const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;
const path = require('path');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
app.use(express.static(path.join(__dirname, 'public')));
const TOKEN = '7121504275:AAHPive5eXJbB8RssVnYWZeBgloZZ7nXGvs';
const chatId = '1132590035';
const bot = new TelegramBot(TOKEN, { polling: true });

mongoose.connect(`mongodb+srv://zubalana0:pscc865qqDLqzpv3@cluster0.n2nxzri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
  });

const userCountSchema = new mongoose.Schema({
  usersCount: { type: Number, default: 0 }
});

const UserCount = mongoose.model('UserCount', userCountSchema);

async function countUserCount() {
  let countDoc = await UserCount.findOne();
  if (!countDoc) {
    countDoc = new UserCount({ usersCount: 0 });
    await countDoc.save();
  }
  return countDoc;
}

io.on('connection', async (socket) => {
  console.log(`New user connected`);
  bot.sendMessage(chatId, `New user connected`);
  try {
    const countDoc = await countUserCount();
    countDoc.usersCount += 1;
    await countDoc.save();
    const updatedCount = await UserCount.findOne();
    console.log(updatedCount);
    socket.on('disconnect', async () => {
      console.log(`User disconnected`);
      bot.sendMessage(chatId, `User disconnected`);
      countDoc.usersCount -= 1;
      await countDoc.save();
      const updatedCountAfterDisconnect = await UserCount.findOne();
      console.log(updatedCountAfterDisconnect);
    });
  } catch (err) {
    console.error(`Error updating user count: ${err.message}`);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

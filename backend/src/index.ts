import { IoManager } from './managers/IoManager';
import { UserManager } from './managers/UserManager';
import express from 'express'

const io = IoManager.getIo();

io.listen(8080);

const userManager = new UserManager();
io.on('connection', (socket) => {
  userManager.addUser(socket);
});


const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/quizes', (req, res) => {
  res.json(userManager.quizManager.quizes)
})

app.listen(8081)


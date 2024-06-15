import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

export class UserManager {
  private quizManager;

  constructor() {
    this.quizManager = new QuizManager
  }

  addUser(socket: Socket) {
    this.createHandler(socket);
  }

  private createHandler(socket: Socket) {
    socket.on("join", (data) => {
      const userId = this.quizManager.addUser(data.roomId, data.name);
      socket.emit("userId", {
        userId
      })
    });
    socket.on("submit", (data) => {
      const userId = data.userId
      const problemId = data.problemId
      const submission = data.submission
      const roomId = data.roomId

      if (submission != 0 || submission != 1 || submission != 2 || submission != 3) {
        console.error("issue while getting input", submission)
        return
      }

      this.quizManager.submit(userId, roomId, problemId, submission)
    })
  }
}

import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

const ADMIN_PASSWORD = "admin123"

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

    socket.on("joinAdmin", (data) => {
      if (data.password !== ADMIN_PASSWORD) {
          return;
      }
      console.log("join admi called");
      
      socket.on("createQuiz", data => {
          this.quizManager.addQuiz(data.roomId);
      })
  
      socket.on("createProblem", data => {
          this.quizManager.addProblem(data.roomId, data.problem);
      });

      socket.on("next", data => {
          this.quizManager.next(data.roomId);
      });
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

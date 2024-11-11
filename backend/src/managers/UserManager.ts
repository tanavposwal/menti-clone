import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

const ADMIN_PASSWORD = "admin123";

export class UserManager {
  public quizManager;

  constructor() {
    this.quizManager = new QuizManager();
  }

  addUser(socket: Socket) {
    this.createHandler(socket);
  }

  private createHandler(socket: Socket) {
    socket.on("joinAdmin", (data) => {
      if (data.password !== ADMIN_PASSWORD) {
        return;
      }

      socket.on("createQuiz", (data) => {
        this.quizManager.addQuiz(data.roomId);
      });

      socket.on("createProblem", (data) => {
        this.quizManager.addProblem(data.roomId, data.problem);
      });

      socket.on("next", (data) => {
        this.quizManager.next(data.roomId);
      });
      
      socket.on("previous", (data) => {
        this.quizManager.previous(data.roomId);
      });

      socket.on("start", (data) => {
        this.quizManager.start(data.roomId);
      });

      socket.on("sendLeaderboard", (data) => {
        this.quizManager.sendLeaderboard(data.roomId);
      });
    });

    // simple user
    socket.on("join", (data) => {
      const userId = this.quizManager.addUser(data.roomId, data.name);
      socket.emit("init", {
        userId,
        state: this.quizManager.getCurrentState(data.roomId),
      });
      socket.join(data.roomId);
    });

    socket.on("submit", ({userId, problemId, submission, roomId}: {userId: string; problemId: string; submission: 0|1|2|3; roomId: string}) => {

      if (submission > 3) {
        return;
      }

      this.quizManager.submit(userId, roomId, problemId, submission);
    });
  }
}

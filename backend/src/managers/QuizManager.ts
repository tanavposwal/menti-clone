import { Socket } from "socket.io";
import { Quiz } from "../Quiz";

let globalProblemId = 0;

export class QuizManager {
  public quizes: Quiz[];
  constructor() {
    this.quizes = [];
  }

  // start a room
  controls(roomId: string, options: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }
    quiz.controls(options);
  }

  addProblem(
    roomId: string,
    problem: {
      title: string;
      image?: string;
      options: {
        id: number;
        title: string;
      }[];
      answer: 0 | 1 | 2 | 3;
    }
  ) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }
    if (
      !problem.title &&
      !problem.options[0].title &&
      !problem.options[1].title &&
      !problem.options[2].title &&
      !problem.options[3].title
    ) {
      return;
    }
    quiz.addProblem({
      ...problem,
      id: (globalProblemId++).toString(),
      startTime: new Date(),
      submissions: [],
    });
  }

  sendLeaderboard(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }
    quiz.sendLeaderboard();
  }

  sendData(roomId: string, socket: Socket) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }
    quiz.sendData(socket);
  }

  addUser(roomId: string, name: string) {
    // todo debug
    return this.getQuiz(roomId)?.addUser(name);
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: 0 | 1 | 2 | 3
  ) {
    this.getQuiz(roomId)?.submit(userId, problemId, submission);
  }

  getQuiz(roomId: string) {
    return this.quizes.find((x) => (x.roomId = roomId)) ?? null;
  }

  getCurrentState(roomId: string) {
    const quiz = this.quizes.find((x) => x.roomId === roomId);
    if (!quiz) {
      return null;
    }
    return quiz.getCurrentState();
  }

  addQuiz(roomId: string) {
    if (this.getQuiz(roomId)) {
      return;
    }
    const quiz = new Quiz(roomId);
    this.quizes.push(quiz);
  }
}

import { Quiz } from "../Quiz";

let globalProblemId = 0;

export class QuizManager {
  public quizes: Quiz[];
  constructor() {
    this.quizes = [];
  }

  // start a room
  start(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }
    quiz.start();
  }

  addProblem(
    roomId: string,
    problem: {
      title: string;
      description: string;
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

  next(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }
    quiz.next();
  }

  previous(roomId: string) {
    const quiz = this.getQuiz(roomId);
    if (!quiz) {
      return;
    }
    quiz.previous();
  }

  addUser(roomId: string, name: string) {
    console.log(roomId, name);
    // todo debug
    return this.getQuiz(roomId)?.addUser(name);
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: 0 | 1 | 2 | 3
  ) {
    this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
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
    console.log("add quiz call ", roomId)
    if (this.getQuiz(roomId)) {
      console.log("already room ", roomId)
      return;
    }
    const quiz = new Quiz(roomId);
    this.quizes.push(quiz);
    console.log("new room ", roomId)
  }
}

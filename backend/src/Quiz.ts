import { IoManager } from "./managers/IoManager";
import randomstring from "randomstring";

const io = IoManager.getIo();

// this should be on database
interface Problem {
  id: string;
  title: string;
  description: string;
  image?: string;
  answer: 0 | 1 | 2 | 3;
  options: {
    id: number;
    title: string;
  }[];
  submissions: Submission[];
}

interface Submission {
  problemId: string;
  userId: string;
  isCorrect: boolean;
  optionSelected: 0 | 1 | 2 | 3;
}

interface User {
  name: string;
  id: string;
  points: number;
}

export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  public problems: Problem[];
  private activeProblem: number;
  public users: User[];
  private currentState: "leaderboard" | "question" | "not_started" | "ended";

  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.activeProblem = 0;
    this.users = [];
    this.currentState = "not_started";
    console.log(">> Room created");
  }

  addUser(name: string) {
    const id = randomstring.generate(7);
    console.log("id> ", id)
    this.users.push({
      name,
      id,
      points: 0,
    });
    return id;
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: 0 | 1 | 2 | 3
  ) {
    const problem = this.problems.find((x) => (x.id = problemId));
    const user = this.users.find((x) => x.id === userId);

    if (!problem || !user) {
      console.log("problem or user not found");
      return;
    }

    const existingSubmission = problem.submissions.find(
      (x) => (x.userId = userId)
    );

    if (existingSubmission) {
      return;
    }

    problem.submissions.push({
      problemId,
      userId,
      optionSelected: submission,
      isCorrect: problem.answer == submission,
    });
  }

  addProblem(problem: Problem) {
    this.problems.push(problem);
    console.log(">> problem added", problem);
  }

  start() {
    this.hasStarted = true;
    this.setActiveProblem(this.problems[0]);
  }

  setActiveProblem(problem: Problem) {
    this.currentState = "question";
    problem.submissions = [];
    io.to(this.roomId).emit("problem", {
      problem,
    });
  }

  sendLeaderboard() {
    console.log("send leaderboard");
    this.currentState = "leaderboard";
    const leaderboard = this.getLeaderboard();
    io.to(this.roomId).emit("leaderboard", {
      leaderboard,
    });
  }

  getLeaderboard() {
    return this.users
      .sort((a, b) => (a.points < b.points ? 1 : -1))
      .slice(0, 20);
  }

  next() {
    this.activeProblem++;
    const problem = this.problems[this.activeProblem];
    if (problem) {
      this.setActiveProblem(problem);
    } else {
      this.currentState = "ended";
      io.to(this.roomId).emit("QUIZ_END", {
        leaderboard: this.getLeaderboard(),
      });
    }
  }

  previous() {
    this.activeProblem--;
    const problem = this.problems[this.activeProblem];
    if (problem) {
      this.setActiveProblem(problem);
    }
  }

  getCurrentState() {
    if (this.currentState === "not_started") {
      return {
        type: "not_started",
      };
    }
    if (this.currentState === "ended") {
      return {
        type: "ended",
        leaderboard: this.getLeaderboard(),
      };
    }
    if (this.currentState === "leaderboard") {
      return {
        type: "leaderboard",
        leaderboard: this.getLeaderboard(),
      };
    }
    if (this.currentState === "question") {
      const problem = this.problems[this.activeProblem];
      return {
        type: "question",
        problem,
      };
    }
  }
}

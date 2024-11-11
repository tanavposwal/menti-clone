import { IoManager } from "./managers/IoManager";
import randomstring from "randomstring";

const io = IoManager.getIo();

// this should be on database
interface Problem {
  id: string;
  title: string;
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
    // room created
  }

  addUser(name: string) {
    const id = randomstring.generate(7);
    this.users.push({
      name,
      id,
      points: 0,
    });
    return id;
  }

  submit(
    userId: string,
    problemId: string,
    submission: 0 | 1 | 2 | 3
  ) {
    const problem = this.problems.find((x) => (x.id = problemId));
    const user = this.users.find((x) => x.id === userId);
    if (!problem || !user) return; // error handling
    const existingSubmission = problem.submissions.find(
      (x) => (x.userId == userId)
    );
    if (existingSubmission) return;
    // increase points
    if (problem.answer == submission) {
      user.points += 1
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
  }

  start() {
    this.hasStarted = true;
    if (this.hasStarted) this.currentState = "not_started";
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
    this.currentState = "leaderboard";
    const leaderboard = this.getLeaderboard();
    io.to(this.roomId).emit("leaderboard", {
      leaderboard,
    });
  }

  getLeaderboard() {
    // issue
    return this.users
      .sort((a, b) => (a.points < b.points ? 1 : -1))
      .slice(0, 10);
  }

  next() {
    this.activeProblem++;
    const problem = this.problems[this.activeProblem];
    if (problem) {
      this.setActiveProblem(problem);
    } else {
      this.currentState = "ended";
      io.to(this.roomId).emit("ended", {
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

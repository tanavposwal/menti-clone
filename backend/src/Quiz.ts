import { IoManager } from "./managers/IoManager";
import randomstring from "randomstring";

const io = IoManager.getIo();
const PER_PROBLEM_TIME = 10; // second

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
  startTime: Date;
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

  submit(userId: string, problemId: string, submission: 0 | 1 | 2 | 3) {
    const problem = this.problems.find((x) => (x.id = problemId));
    const user = this.users.find((x) => x.id === userId);
    if (!problem || !user) return; // error handling

    const existingSubmission = problem.submissions.find(
      (x) => x.userId === userId
    );
    if (existingSubmission) return;
    // increase points
    if (problem.answer == submission) {
      user.points +=
        1000 -
        (500 * (new Date().getTime() - problem.startTime.getTime())) /
          (PER_PROBLEM_TIME * 1000);
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

  setActiveProblem(problem: Problem) {
    this.currentState = "question";
    problem.startTime = new Date();
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

  sendData() {
    io.to(this.roomId).emit("data", {
      problems: this.problems,
      activeProblem: this.activeProblem,
      users: this.users,
      currentState: this.currentState,
    });
  }

  getLeaderboard() {
    // issue
    return this.users
      .sort((a, b) => (a.points < b.points ? 1 : -1))
      .slice(0, 10);
  }
  //TODO: change end to break state
  controls(options: string) {
    if (options == "togglePlay") {
      if (this.currentState == "question") {
        this.currentState = "ended";
        io.to(this.roomId).emit("ended", {
          leaderboard: this.getLeaderboard(),
        });
      }
      if (!this.hasStarted) {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
      }
    }
    if (options == "next") {
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
    if (options == "previous") {
      this.activeProblem--;
      const problem = this.problems[this.activeProblem];
      if (problem) {
        this.setActiveProblem(problem);
      }
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

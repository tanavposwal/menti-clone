"use client";

import { useEffect, useState } from "react";
import { Quiz } from "../components/Quiz";
import { LeaderBoard } from "../components/LeaderBoard";
import { socket } from "@/socket";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RoomId from "../components/RoomId";

export default function User() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");

  if (!submitted) {
    return (
      <div className="flex flex-col gap-3 p-8 mx-auto max-w-sm">
        <h1 className="text-2xl font-black">Enter the code to join</h1>
        <Label>Enter Room Id</Label>
        <Input
          placeholder="1234 5678"
          style={{ fontSize: "1rem" }}
          type="text"
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <Label>Enter Name</Label>
        <Input
          placeholder="Your name"
          style={{ fontSize: "1rem" }}
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Button
          style={{ fontSize: "1rem" }}
          onClick={() => {
            console.log(code, name);
            socket.emit("join", {
              roomId: code,
              name,
            });
            setSubmitted(true);
          }}
        >
          Join
        </Button>
      </div>
    );
  }

  return <UserLoggedin code={code} name={name} />;
}

export const UserLoggedin = ({
  name,
  code,
}: {
  name: string;
  code: string;
}) => {
  const roomId = code;
  const [currentState, setCurrentState] = useState("not_started");
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    socket.on("init", ({ userId, state }) => {
      setUserId(userId);

      if (state.leaderboard) {
        setLeaderboard(state.leaderboard);
      }

      if (state.problem) {
        setCurrentQuestion(state.problem);
      }

      setCurrentState(state.type);
    });

    socket.on("leaderboard", (data) => {
      setCurrentState("leaderboard");
      setLeaderboard(data.leaderboard);
    });
    socket.on("problem", (data) => {
      setCurrentState("question");
      setCurrentQuestion(data.problem);
    });
  }, []);

  if (currentState === "not_started") {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <div className="w-lg-screen flex flex-col h-fit items-center gap-5">
          <h1 className="text-3xl font-black">Quiz has not started</h1>
          <h3 className="text-xl font-bold text-muted-foreground">"{name}"</h3>
          <RoomId roomId={roomId} />
        </div>
      </section>
    );
  }
  if (currentState === "question") {
    return (
      <Quiz
        roomId={roomId}
        userId={userId}
        name={name}
        problemId={currentQuestion.id}
        quizData={{
          title: currentQuestion.title,
          options: currentQuestion.options,
        }}
        socket={socket}
      />
    );
  }

  if (currentState === "leaderboard") {
    return <LeaderBoard leaderboarddata={leaderboard} />;
  }

  if (currentState === "ended") {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <div className="w-lg-screen flex flex-col h-fit items-center gap-5">
          <h1 className="text-3xl font-black">Quiz has ended</h1>
          <h3 className="text-xl font-bold text-muted-foreground">"{name}"</h3>
          <RoomId roomId={roomId} />
        </div>
      </section>
    );
  }
};

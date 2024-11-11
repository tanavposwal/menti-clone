"use client";

import { useEffect, useState } from "react";
import { Quiz } from "./components/Quiz";
import { LeaderBoard } from "./components/LeaderBoard";
import { socket } from "@/socket";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const [name, setName] = useState("");
  const [log, setLog] = useState(false);
  const [code, setCode] = useState("");

  if (!log) {
    return (
      <div className="flex flex-col gap-3 p-8 mx-auto max-w-sm">
        <h2 className="text-3xl font-black mb-6">Enter the code to join</h2>
        <Label className="font-bold">Enter Room Id</Label>
        <Input
          placeholder="1234 5678"
          type="text"
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <Label className="font-bold">Enter Name</Label>
        <Input
          placeholder="Your name"
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <div className="flex items-center w-full justify-center">
        <Button
        className="mt-3 rounded-full text-lg py-6 px-10 w-fit"
          onClick={() => {
            socket.emit("join", {
              roomId: code,
              name,
            });
            setLog(true);
          }}
        >
          Join Quiz
        </Button>
        </div>
      </div>
    );
  }

  return <UserLoggedin code={code} name={name} />;
}

// now the room after login
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

      if (state.leaderboard) setLeaderboard(state.leaderboard);

      if (state.problem) setCurrentQuestion(state.problem);

      setCurrentState(state.type);
    });

    socket.on("leaderboard", (data) => {
      setCurrentState("leaderboard");
      setLeaderboard(data.leaderboard);
    });
    
    socket.on("ended", (data) => {
      setCurrentState("ended");
      setLeaderboard(data.leaderboard);
    }); // add to ui
    
    socket.on("not_started", (data) => {
      setCurrentState("not_started");
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
          <h2 className="text-4xl font-bold">Get ready to play {name}!</h2>
          <h3 className="text-muted-foreground">admin will start the quiz soon</h3>
          <Image src="/loading-gif.gif" alt="loading" width={500} height={500} className="w-8 select-none" draggable="false" />
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
          imageURL:currentQuestion.image,
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
          <h1 className="text-4xl font-bold">Lets see how you did!</h1>
          <h3 className="text-muted-foreground">admin can see your leaderboard now</h3>
          <Image src="/loading-gif.gif" alt="loading" width={500} height={500} className="w-8 select-none" draggable="false" />
        </div>
      </section>
    );
  }
};

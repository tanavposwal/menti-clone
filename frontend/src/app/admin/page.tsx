"use client";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { CreateProblem } from "../components/CreateProblem";
import { QuizControls } from "../components/QuizControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function Admin() {
  const [quizId, setQuizId] = useState("");
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("joinAdmin", {
        password: "admin123",
      });
    });
  });

  if (!quizId) {
    return (
      <div className="flex flex-col gap-3 p-8 mx-auto max-w-sm">
        <h2 className="text-2xl font-black">Login as admin</h2>
        <Label htmlFor="password">Enter Password</Label>
        <Input
        id="password"
          type="text"
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          autoComplete="false"
          placeholder="password"
        />
        <Button
          onClick={() => {
            socket.emit("createQuiz", {
              roomId,
            });
            setQuizId(roomId);
          }}
        >
          Create room
        </Button>
      </div>
    );
  }

  return (
    <div>
      <CreateProblem roomId={quizId} socket={socket} />
      <QuizControls socket={socket} roomId={roomId} />
    </div>
  );
}

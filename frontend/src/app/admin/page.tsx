"use client";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { CreateProblem } from "../components/CreateProblem";
import { QuizControls } from "../components/QuizControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Admin() {
  const [loged, setLoged] = useState(false);
  const [roomId, setRoomId] = useState("123");

  if (!loged) {
    return (
      <div className="flex flex-col gap-3 p-8 mx-auto max-w-sm">
        <h2 className="text-3xl font-black mb-6">Create a Room</h2>

        <Label className="font-bold" htmlFor="room">Enter Room Id</Label>
        <Input
          type="text"
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          autoComplete="false"
          placeholder="1234 5678"
          value={123}
        />
        <Button
          className="mt-3"
          onClick={() => {
            socket.emit("joinAdmin", { // add authentication here
              password: "admin123",
            });
            socket.emit("createQuiz", {
              roomId,
            });
            setLoged(true);
          }}
        >
          Create room
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div>
      <CreateProblem roomId={roomId} socket={socket} />
      </div>
      <div>
      <QuizControls socket={socket} roomId={roomId} />
      </div>
    </div>
  );
}

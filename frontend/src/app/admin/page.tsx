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
  const [roomId, setRoomId] = useState("");

  if (!loged) {
    return (
      <div className="flex flex-col gap-3 p-8 mx-auto max-w-sm">
        <h2 className="text-3xl font-black mb-6">Create a Room</h2>

        <Label className="font-bold" htmlFor="room">Enter Room Id</Label>
        <Input
          id="room"
          type="text"
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          autoComplete="false"
          placeholder="room-id"
        />
        <Button
          onClick={() => {
            socket.emit("joinAdmin", {
              password: "admin123",
            });
            socket.emit("createQuiz", {
              roomId,
            });
            setLoged(true);
            console.log("create quiz called", roomId, socket);
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

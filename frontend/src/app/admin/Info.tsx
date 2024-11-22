"use client";
import { Button } from "@/components/ui/button";
import { socket } from "@/socket";
import { useEffect, useState } from "react";

export default function Info({ roomId }: { roomId: string }) {
  useEffect(() => {
    socket.on("data", (data) => {
      console.log(data);
    });
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          socket.emit("sendData", {
            roomId,
          });
        }}
      >
        refresh
      </Button>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const CreateProblem = ({
  socket,
  roomId,
}: {
  socket: any;
  roomId: string;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState([
    {
      id: 0,
      title: "",
    },
    {
      id: 1,
      title: "",
    },
    {
      id: 2,
      title: "",
    },
    {
      id: 3,
      title: "",
    },
  ]);

  return (
    <div className="max-w-md mx-auto py-8">
      <Label>Title</Label>
      <Input
        type="text"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <Label>Description</Label>
      <Input
        type="text"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <br />

      {[0, 1, 2, 3].map((optionId) => (
        <div className="flex items-center justify-center gap-2 mb-2">
          <Checkbox
            checked={optionId === answer}
            onCheckedChange={() => {
              setAnswer(optionId);
            }}
            id={optionId.toString()}
          />
          <Input
            type="text"
            onChange={(e) => {
              setOptions((options) =>
                options.map((x) => {
                  if (x.id === optionId) {
                    return {
                      ...x,
                      title: e.target.value,
                    };
                  }
                  return x;
                })
              );
            }}
            placeholder={`option ${optionId + 1}`}
          />
        </div>
      ))}
      <br />
      <Button
        onClick={() => {
          socket.emit("createProblem", {
            roomId,
            problem: {
              title,
              description,
              options,
              answer,
            },
          });
        }}
      >
        Add problem
      </Button>
    </div>
  );
};

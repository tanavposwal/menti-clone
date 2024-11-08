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
  const [image, setImage] = useState("");
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
    <div className="w-96 py-8">
      <h2 className="text-3xl font-black mb-6">Add Problem</h2>
      <Label className="font-bold">Question</Label>
      <Input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <Label className="font-bold">Image URL</Label>
      <Input
        type="text"
        value={image}
        onChange={(e) => {
          setImage(e.target.value);
        }}
      />
      <br />

      {[0, 1, 2, 3].map((optionId) => (
        <div className="flex items-center justify-center gap-2 mb-2" key={optionId}>
          <Checkbox
            checked={optionId === answer}
            onCheckedChange={() => {
              setAnswer(optionId);
            }}
            id={optionId.toString()}
          />
          <Input
            type="text"
            value={options.find(x => x.id == optionId)?.title}
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
              image,
              description,
              options,
              answer,
            },
          });
          setOptions([
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
          setDescription("")
          setTitle("")
          setAnswer(0)
        }}
      >
        Add problem
      </Button>
    </div>
  );
};

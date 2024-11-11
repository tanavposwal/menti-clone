"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { use, useEffect, useState } from "react";
import RoomId from "./RoomId";

export function Quiz({
  quizData,
  socket,
  userId,
  problemId,
  roomId,
  name
}: {
  quizData: {
    title: string;
    imageURL: string;
    options: {
      id: number;
      title: string;
    }[];
  };
  socket: any;
  roomId: string;
  userId: string;
  problemId: number;
  name: string;
}) {
  const [submission, setSubmission] = useState<0 | 1 | 2 | 3 | null>(null);

  useEffect(() => {
    setSubmission(null);
  }, [socket]);

  return (
    <div className="h-screen max-w-md mx-auto py-8">
      <div className="flex flex-col w-full justify-center">
        <div className="flex justify-between items-center border-b pb-3">
          <p className="text-2xl font-bold capitalize">{name}</p>
          <p>
            <RoomId roomId={roomId} />
          </p>
        </div>
        <div className="mt-3">
          <SingleQuiz
            choices={quizData.options}
            title={quizData.title}
            socket={socket}
            imageURL={quizData.imageURL}
            selection={submission}
            setSelected={setSubmission}
            problemId={Number(problemId)}
          />
          <Button
            onClick={() => {
              socket.emit("submit", {
                userId,
                problemId,
                submission: Number(submission),
                roomId,
              });
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

type SingleQuizProps = {
  title: string;
  choices: {
    id: number;
    title: string;
  }[];
  socket: any;
  imageURL?: string;
  setSelected: any;
  selection: 0 | 1 | 2 | 3 | null;
  problemId: number;
};

function SingleQuiz({
  title,
  choices,
  imageURL,
  socket,
  setSelected,
  selection,
  problemId,
}: SingleQuizProps) {

  useEffect(() => {
    setSelected(null);
  }, [socket]);

  return (
    <article>
      <Label className="mt-10 opacity-70">Q{problemId + 1}</Label>
      <div className="text-3xl font-black">{title}</div>
      {imageURL && <img src={imageURL} alt="" className="border rounded-lg mt-6 max-w-full" />}
      <div className="flex flex-col gap-2 my-5">
        {choices.map((choice) => (
          <div
            className={
              "border rounded-md shadow-sm transition-colors px-4 py-2 select-none hover:border-neutral-300 cursor-pointer " +
              (selection == choice.id ? "bg-green-600 text-white" : "")
            }
            key={choice.id}
            onClick={() => setSelected(choice.id)}
          >
            <p className="text-lg font-semibold">{choice.title}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-start w-full"></div>
    </article>
  );
}

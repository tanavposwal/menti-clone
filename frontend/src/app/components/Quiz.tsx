"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import RoomId from "./RoomId";

export function Quiz({
  quizData,
  socket,
  userId,
  problemId,
  roomId,
  name,
  imageURL,
}: {
  quizData: {
    title: string;
    options: {
      id: number;
      title: string;
    }[];
  };
  socket: any;
  roomId: string;
  imageURL: string;
  userId: string;
  problemId: number;
  name: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    setSubmission(null);
    setSubmitted(false);
  }, [socket]);

  return (
    <div className="h-screen max-w-md mx-auto py-8">
      <div className="flex flex-col w-full justify-center">
        <div className="flex justify-between items-center border-b pb-3">
          <p className="text-2xl font-semibold capitalize">{name}</p>
          <p>
            <RoomId roomId={roomId} />
          </p>
        </div>
        <div className="mt-3">
          <SingleQuiz
            choices={quizData.options}
            title={quizData.title}
            imageURL={imageURL}
            selection={submission}
            setSelected={setSubmission}
            problemId={Number(problemId)}
          />
          <Button
            disabled={submitted}
            onClick={() => {
              setSubmitted(true);
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
  imageURL?: string;
  setSelected: any;
  selection: number;
  problemId: number;
};

function SingleQuiz({
  title,
  choices,
  imageURL,
  setSelected,
  selection,
  problemId,
}: SingleQuizProps) {
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

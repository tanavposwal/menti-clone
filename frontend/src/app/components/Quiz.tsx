"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import RoomId from "./RoomId";
import Timer from "./Timer";
import Info from "../admin/Info";

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
      <div>
      <Label className="mt-10 opacity-70">Q{problemId + 1}</Label>
      {/* <Timer /> */}
      {/* <Info roomId={"123"} /> */}
      </div>
      <div className="text-4xl font-extrabold">{title}</div>
      {imageURL && <img src={imageURL} alt="" className="border rounded-lg mt-6 max-w-full" />}
      <div className="flex flex-col gap-2 my-5">
        {choices.map((choice) => (
          <div
            className={
              "border rounded-lg transition-colors px-6 py-3 select-none hover:border-neutral-300 cursor-pointer " +
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

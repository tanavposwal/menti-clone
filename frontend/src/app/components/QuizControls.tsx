import { Button } from "@/components/ui/button";

export const QuizControls = ({
  socket,
  roomId,
}: {
  socket: any;
  roomId: string;
}) => {
  return (
    <div>
      <Button
        onClick={() => {
          socket.emit("next", {
            roomId,
          });
        }}
      >
        Start Quiz
      </Button>
      <Button
        onClick={() => {
          socket.emit("start", {
            roomId,
          });
        }}
      >
        Next problem
      </Button>
    </div>
  );
};

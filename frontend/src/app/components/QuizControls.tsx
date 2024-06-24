import { Button } from "@/components/ui/button";

export const QuizControls = ({
  socket,
  roomId,
}: {
  socket: any;
  roomId: string;
}) => {
  return (
    <div className="flex gap-2 p-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          socket.emit("previous", {
            roomId,
          });
        }}
      >
        Previous Problem
      </Button>
      <Button
        size="sm"
        onClick={() => {
          socket.emit("start", {
            roomId,
          });
        }}
      >
        Start Quiz
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          socket.emit("next", {
            roomId,
          });
        }}
      >
        Next problem
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          socket.emit("sendLeaderboard", {
            roomId,
          });
        }}
      >
        Show Leaderboard
      </Button>
    </div>
  );
};

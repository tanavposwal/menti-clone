export default function RoomId({ roomId }: { roomId: string }) {
  return (
    <div className="border rounded-lg h-fit py-1 bg-muted items-center justify-center flex gap-1 px-3">
      {roomId.split("").map((num) => (
        <span className="font-semibold text-lg text-black">{num}</span>
      ))}
    </div>
  );
}

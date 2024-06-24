export default function RoomId({ roomId }: { roomId: string }) {
  return <div className="border rounded-lg h-fit py-2 divide-x-[1.4px] select-none bg-muted items-center justify-center flex">
    {
        roomId.split("").map(num => (
            <span className="px-4 font-bold text-lg text-black">{num}</span>
        ))
    }
  </div>;
}

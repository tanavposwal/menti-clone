export const LeaderBoard = ({ leaderboarddata }: { leaderboarddata: {name: string; id: string; points: number}[] }) => {
  return (
    <div className="max-w-lg mx-auto pt-8">
      <h2 className="text-3xl font-black mb-6">Leaderboard</h2>
      <div className="flex flex-col gap-3">
        {
            leaderboarddata.map(leaderboard => (
                <div key={leaderboard.id}>
                    <p className="font-bold text-md mb-1 capitalize">{">"} {leaderboard.name} - {leaderboard.points}</p>
                    <div className="w-full flex border overflow-hidden rounded-lg">
                        <div className="bg-primary h-[20px]" style={{width: `${leaderboard.points*2 + 20}px`}}></div>
                    </div>
                </div>
            ))
        }
      </div>
    </div>
  );
};

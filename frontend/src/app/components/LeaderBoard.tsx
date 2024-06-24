export const LeaderBoard = ({ leaderboarddata }: { leaderboarddata: {name: string; id: string; points: number}[] }) => {
  return (
    <div className="max-w-lg mx-auto pt-8">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      <div className="flex flex-col gap-3">
        {
            leaderboarddata.map(leaderboard => (
                <div key={leaderboard.id}>
                    <p className="font-semibold text-sm">{leaderboard.name} / {leaderboard.points}</p>
                    <div className="w-full flex">
                        <div className="bg-blue-400 h-[20px] rounded-full " style={{width: `${leaderboard.points*2 + 20}px`}}></div>
                    </div>
                </div>
            ))
        }
      </div>
    </div>
  );
};

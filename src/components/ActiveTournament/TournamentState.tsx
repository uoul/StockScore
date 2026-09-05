import { useMemo } from "react";
import type { Tournament } from "../../domain/Tournament"

const TournamentState = ({ tournament }: { tournament: Tournament }) => {
  
  const totalGames = useMemo(
    () => (tournament.Teams.length * (tournament.Teams.length - 1)) / 2,
    [tournament.Teams]
  );
  const durchgang = useMemo(() => {
    if(tournament.Courts <= 0) return 0
    return Math.ceil(totalGames / tournament.Courts)
  }, [tournament.Courts, totalGames]);
  const playedGames = useMemo(
    () => tournament.Results.length,
    [tournament.Results]
  );

  const progress = useMemo(
    () => (totalGames > 0 ? (playedGames / totalGames) * 100 : 0),
    [totalGames, playedGames]
  );

  return (
    <div className="stats stats-vertical sm:stats-horizontal shadow w-full [box-shadow:0_0_8px_2px_rgba(0,0,0,0.1)] grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr]">
      <div className="stat">
        <div className="stat-title">Teams</div>
        <div className="stat-value text-primary">{tournament.Teams.length}</div>
        <div className="stat-desc">Angemeldet</div>
      </div>
      <div className="stat">
        <div className="stat-title">Bahnen</div>
        <div className="stat-value text-secondary">{tournament.Courts}</div>
        <div className="stat-desc">Verfügbar</div>
      </div>
      <div className="stat">
        <div className="stat-title">Durchgänge</div>
        <div className="stat-value text-accent">{durchgang}</div>
        <div className="stat-desc">⌈Teams / Bahnen⌉</div>
      </div>

      {/* Spiele stat with progress shown as a bottom border */}
      <div className="stat relative overflow-hidden">
        <div className="stat-title">Spiele</div>
        <div className="stat-value">
          {playedGames} / {totalGames}
        </div>
        <div className="stat-desc">
          {Math.round(progress)}% &middot; {totalGames - playedGames} verbleibend
        </div>

        {/* Progress as bottom border — width = progress %, full width means 100% */}
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${
            progress === 100 ? 'bg-success' : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default TournamentState
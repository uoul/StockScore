const TournamentBadge = ({ isStarted, isFinished }: { isStarted: boolean; isFinished: boolean }) => {
  if (isFinished) {
    return <span className="badge badge-xl badge-success badge-soft gap-1">
      <span className="status status-success"></span> Abgeschlossen
    </span>;
  }
  if (isStarted) {
    return <span className="badge badge-xl badge-info badge-soft gap-1">
      <span className="status status-info"></span> Laufend
    </span>;
  }
  return <span className="badge badge-xl badge-warning badge-soft gap-1">
    <span className="status status-warning"></span> Entwurf
  </span>;
}
export default TournamentBadge

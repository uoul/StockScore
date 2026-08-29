import { useMemo } from "react";
import CloseIcon from "../assets/CloseIcon";
import type { Tournament } from "../domain/Tournament"
import useDialog from "../hooks/useDialog";
import RemoveTournamentDialog from "../dialog/RemoveTournamentDialog";

const TournamentListItem = ({ tournament, onClick }: { tournament: Tournament, onClick?: (t: Tournament) => void }) => {
    const teamCount = useMemo(() => tournament.Teams?.length ?? 0, [tournament.Teams]);
    const totalGames = useMemo(() => teamCount > 1 ? (teamCount * (teamCount - 1)) / 2 : 0, [teamCount]);
    const resultsCount = useMemo(() => tournament.Results?.length ?? 0, [tournament]);

    const { showDialog } = useDialog()

    return (
        <li key={tournament.Id} className="rounded-xl hover:bg-base-300/50 transition-colors duration-150 text-nowrap">
            <div
                role="button"
                tabIndex={0}
                onClick={() => onClick?.(tournament)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(tournament); } }}
                className="group w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer"
            >
                {/* Date badge */}
                <div className="flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary shrink-0">
                    <span className="text-[10px] font-semibold uppercase leading-none">
                        {new Date(tournament.Date).toLocaleDateString("de-DE", { month: "short" })}
                    </span>
                    <span className="text-base font-bold leading-tight">
                        {new Date(tournament.Date).getDate()}
                    </span>
                </div>

                {/* Name + meta */}
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-base-content truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {tournament.Name || "Unbenanntes Turnier"}
                    </span>
                    <span className="text-xs text-base-content/50 flex items-center gap-1">
                        {teamCount} Teams · {tournament.Courts} Bahnen · {resultsCount}/{totalGames} Spiele
                    </span>
                </div>

                <button
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={(e) => { e.stopPropagation(); showDialog(<RemoveTournamentDialog tournament={tournament} />); }}
                >
                    <CloseIcon className="h-4 fill-base-content"/>
                </button>
            </div>
        </li>
    );
};

export default TournamentListItem;

import { useMemo } from "react";
import type { Match } from "../domain/Match"
import type { Tournament } from "../domain/Tournament";

const TeamScoreSheet = ({ teamId, tournament, matches }: { teamId: string, tournament: Tournament, matches: Match[] }) => {
    const team = tournament.Teams.find((t) => t.Id === teamId);

    const allRounds = useMemo(() => {
        if (matches.length === 0) return [];
        const rounds = matches.map((m) => m.Round);
        const maxRound = Math.max(...rounds);
        return Array.from({ length: maxRound }, (_, i) => i + 1);
    }, [matches]);

    const roundData = useMemo(() => {
        return allRounds.map((round) => {
            const match = matches.find(
                (m) => m.Round === round && (m.Team1.Id === teamId || m.Team2.Id === teamId)
            );

            if (!match) {
                return { round, isPause: true as const };
            }

            const isTeam1 = match.Team1.Id === teamId;
            const opponent = isTeam1 ? match.Team2 : match.Team1;

            return {
                round,
                isPause: false as const,
                court: match.Court,
                opponent,
                kehrenEigene: ['', '', '', '', '', ''],
                kehrenGegner: ['', '', '', '', '', ''],
            };
        });
    }, [allRounds, matches, teamId]);

    if (!team) {
        return <div className="alert alert-error">Team nicht gefunden</div>;
    }

    return (
        <div className="bg-white text-black border-y border-gray-400 w-full font-sans box-border py-2">
            {/* Kopfzeile */}
            <div className="border-b border-black pb-2 mb-2 flex justify-between items-end">
                <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
                    <span className="p-1 m-1 rounded-lg text-sm border border border-black text-center">#{team.BibNumber}</span>{team.Name}
                </h2>
            </div>

            {/* Grid-Layout */}
            {(() => {
                const gridCols = '18px 18px 18px 18px repeat(6, 25px) 30px 30px 1fr repeat(6, 25px) 30px 30px';

                // Feinere Border: border statt border
                const cellBase = 'border border-black flex items-center justify-center text-[11px] box-border';

                return (
                    <div className="w-full">
                        {/* Header-Zeile */}
                        <div
                            className="grid bg-gray-100 text-black border-b border-black text-[11px] font-semibold h-7"
                            style={{ gridTemplateColumns: gridCols }}
                        >
                            <div className={cellBase}>Dg</div>
                            <div className={cellBase}>B</div>
                            <div className={cellBase}>Ge</div>
                            <div className={cellBase}>An</div>

                            {[1, 2, 3, 4, 5, 6].map((k) => (
                                <div key={`e-${k}`} className={cellBase}>{k}</div>
                            ))}
                            <div className={cellBase}>Su</div>
                            <div className={cellBase}>Pu</div>

                            <div className="border border-black px-2 flex items-center text-left text-[11px] font-bold">
                                Mannschaft
                            </div>

                            {[1, 2, 3, 4, 5, 6].map((k) => (
                                <div key={`g-${k}`} className={cellBase}>{k}</div>
                            ))}
                            <div className={cellBase}>Su</div>
                            <div className={cellBase}>Pu</div>
                        </div>

                        {/* Body-Zeilen */}
                        {roundData.map((row) => {
                            if (row.isPause) {
                                return (
                                    <div
                                        key={row.round}
                                        className="grid h-9"
                                        style={{ gridTemplateColumns: gridCols }}
                                    >
                                        <div className={`${cellBase} font-bold`}>{row.round}</div>
                                        <div className="border border-black" style={{ gridColumn: '2 / span 3' }}></div>
                                        <div className="border border-black" style={{ gridColumn: '5 / span 6' }}></div>
                                        <div className="border border-black"></div>
                                        <div className="border border-black"></div>
                                        <div className="border border-black px-2 flex items-center justify-center font-bold tracking-widest bg-gray-50 text-xs">
                                            PAUSE
                                        </div>
                                        {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                            <div key={`p-gk-${i}`} className="border border-black"></div>
                                        ))}
                                        <div className="border border-black"></div>
                                        <div className="border border-black"></div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={row.round}
                                    className="grid h-9"
                                    style={{ gridTemplateColumns: gridCols }}
                                >
                                    <div className={`${cellBase} font-semibold`}>{row.round}</div>
                                    <div className={cellBase}>{row.court}</div>
                                    <div className={cellBase}>{row.opponent?.BibNumber}</div>
                                    <div className={cellBase}>{team.BibNumber}</div>

                                    {/* Eigene Kehren 1-6 */}
                                    {row.kehrenEigene?.map((_, i) => (
                                        <div key={`ek-${i}`} className="border border-black"></div>
                                    ))}
                                    <div className="border border-black"></div>
                                    <div className="border border-black"></div>

                                    {/* Gegner Name */}
                                    <div className="border border-black px-2 flex items-center text-left font-medium text-xs truncate">
                                        {row.opponent?.Name}
                                    </div>

                                    {/* Gegner Kehren 1-6 */}
                                    {row.kehrenGegner?.map((_, i) => (
                                        <div key={`gk-${i}`} className="border border-black"></div>
                                    ))}
                                    <div className="border border-black"></div>
                                    <div className="border border-black"></div>
                                </div>
                            );
                        })}
                    </div>
                );
            })()}

            {/* Fußzeile des Streifens */}
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-black text-sm font-semibold">
                <div>{tournament.Name}</div>
                <div>{new Date(tournament.Date).toLocaleDateString('de-DE')}</div>
            </div>
        </div>



    )
};

export default TeamScoreSheet;

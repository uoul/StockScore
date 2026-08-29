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
            <div className="border-b-2 border-black pb-2 mb-2 flex justify-between items-end">
                <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
                    <span className="p-1 m-1 rounded-lg text-sm border text-center">#{team.BibNumber}</span>{team.Name}
                </h2>
            </div>

            {/* Tabelle über gesamte Breite */}
            <div className="w-full overflow-hidden">
                <table className="table table-xs border-collapse border border-black text-center w-full">
                    <thead>
                        <tr className="bg-gray-100 text-black border-b border-black text-[11px]">
                            {/* Eigene Statistik - Fixe Breiten */}
                            <th className="border border-black p-1 w-7 min-w-7">Dg</th>
                            <th className="border border-black p-1 w-7 min-w-7">B</th>
                            <th className="border border-black p-1 w-7 min-w-7">Ge</th>
                            <th className="border border-black p-1 w-7 min-w-7">An</th>

                            {/* Kehren 1-6 (Eigene) - Fixe Breite für Handschrift */}
                            {[1, 2, 3, 4, 5, 6].map((k) => (
                                <th key={`e-${k}`} className="border border-black p-1 w-9 min-w-9">{k}</th>
                            ))}
                            <th className="border border-black p-1 w-9 min-w-9">Su</th>
                            <th className="border border-black p-1 w-9 min-w-9">Pu</th>

                            {/* Mannschaft (Mitte) - Nimmt den restlichen Platz ein, bricht um */}
                            <th className="border border-black p-1 px-2 text-left w-full whitespace-normal wrap-break-word">
                                Mannschaft
                            </th>

                            {/* Gegner Statistik (rechts) - Fixe Breite */}
                            {[1, 2, 3, 4, 5, 6].map((k) => (
                                <th key={`g-${k}`} className="border border-black p-1 w-9 min-w-9">{k}</th>
                            ))}
                            <th className="border border-black p-1 w-9 min-w-9">Su</th>
                            <th className="border border-black p-1 w-9 min-w-9">Pu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roundData.map((row) => {
                            if (row.isPause) {
                                return (
                                    <tr key={row.round} className="h-10">
                                        <td className="border border-black font-bold">{row.round}</td>
                                        <td className="border border-black" colSpan={3}></td>
                                        <td className="border border-black" colSpan={6}></td>
                                        <td className="border border-black"></td>
                                        <td className="border border-black"></td>
                                        {/* PAUSE im schrumpfenden Mittelbereich */}
                                        <td className="border border-black font-bold text-center tracking-widest bg-gray-50 text-sm whitespace-normal wrap-break-word">
                                            PAUSE - PAUSE - PAUSE
                                        </td>
                                        {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                            <td key={i} className="border border-black"></td>
                                        ))}
                                        <td className="border border-black"></td>
                                        <td className="border border-black"></td>
                                    </tr>
                                );
                            }

                            return (
                                <tr key={row.round} className="h-10">
                                    {/* Dg */}
                                    <td className="border border-black font-semibold">{row.round}</td>
                                    {/* Bahn (B) */}
                                    <td className="border border-black">{row.court}</td>
                                    {/* Gegner Start-Nr (Ge) */}
                                    <td className="border border-black">{row.opponent?.BibNumber}</td>
                                    {/* Eigene Start-Nr (An) */}
                                    <td className="border border-black">{team.BibNumber}</td>

                                    {/* Eigene Kehren 1-6 */}
                                    {row.kehrenEigene?.map((_, i) => (
                                        <td key={`ek-${i}`} className="border border-black"></td>
                                    ))}
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>

                                    {/* Gegner Name (Schrumpft & bricht bei Bedarf um) */}
                                    <td className="border border-black text-left font-medium px-2 whitespace-normal wrap-break-word">
                                        {row.opponent?.Name}
                                    </td>

                                    {/* Gegner Kehren 1-6 */}
                                    {row.kehrenGegner?.map((_, i) => (
                                        <td key={`gk-${i}`} className="border border-black"></td>
                                    ))}
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Fußzeile des Streifens */}
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-black text-sm font-semibold">
                <div>
                    {tournament.Name}
                </div>
                <div>
                    {new Date(tournament.Date).toLocaleDateString('de-DE')}
                </div>
            </div>
        </div>
    );
};

export default TeamScoreSheet;

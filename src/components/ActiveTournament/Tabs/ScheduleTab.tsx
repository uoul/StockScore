import { useMemo } from "react"
import type { Tournament } from "../../../domain/Tournament"
import type { Match } from "../../../domain/Match"
import type { Result } from "../../../domain/Result"
import { useTournamentStore } from "../../../hooks/useTournamentStore"
import MatchCard from "../MatchCard"

const ScheduleTab = ({ tournament, matches }: { tournament: Tournament, matches: Match[] }) => {

    const { saveTournament } = useTournamentStore()

    const matchesByRound = useMemo(() => {
        const map = new Map<number, Match[]>()
        for (const m of matches) {
            if (!map.has(m.Round)) map.set(m.Round, [])
            map.get(m.Round)!.push(m)
        }
        return map
    }, [matches])

    const rounds = useMemo(() => [...new Set(matches.map(m => m.Round))].sort((a, b) => a - b), [matches])

    const getResult = (results: Result[], match: Match): Result | undefined =>
        results.find(r =>
            (r.TeamId1 === match.Team1?.Id && r.TeamId2 === match.Team2?.Id) ||
            (r.TeamId1 === match.Team2?.Id && r.TeamId2 === match.Team1?.Id)
        )

    const setResult = (match: Match, p1: string, p2: string) => {
        if (!match.Team1 || !match.Team2) return

        const existingIdx = tournament.Results.findIndex(r =>
            (r.TeamId1 === match.Team1!.Id && r.TeamId2 === match.Team2!.Id) ||
            (r.TeamId1 === match.Team2!.Id && r.TeamId2 === match.Team1!.Id)
        )

        // Team-Ids immer in fester Reihenfolge (wie im Match) speichern
        const result: Result = {
            TeamId1: match.Team1.Id,
            TeamId2: match.Team2.Id,
            PointsTeam1: Number(p1) || 0,
            PointsTeam2: Number(p2) || 0,
        }

        let newResults: Result[]
        if (p1 === '' && p2 === '') {
            // Beide leer → Ergebnis entfernen
            newResults = existingIdx >= 0
                ? tournament.Results.filter((_, i) => i !== existingIdx)
                : tournament.Results
        } else if (existingIdx >= 0) {
            // Update
            newResults = tournament.Results.map((r, i) => i === existingIdx ? result : r)
        } else {
            // Neu
            newResults = [...tournament.Results, result]
        }

        // Tournament speichern (OPFS)
        saveTournament({ ...tournament, Results: newResults })
    }


    return (
        <div className="space-y-2">
            {rounds.map(r => {
                const roundMatches = matchesByRound.get(r)!.sort((a, b) => a.Court - b.Court)
                const activeCourts = roundMatches.length

                const allMatchesHaveResult = roundMatches.every(m => {
                    if (!m.Team1 || !m.Team2) return false
                    return tournament.Results.some(res =>
                        (res.TeamId1 === m.Team1!.Id && res.TeamId2 === m.Team2!.Id) ||
                        (res.TeamId1 === m.Team2!.Id && res.TeamId2 === m.Team1!.Id)
                    )
                })
                const isDone = activeCourts > 0 && allMatchesHaveResult

                return (
                    <div key={r} className={`collapse collapse-arrow border border-l-4 border-base-300 has-checked:border-primary ${isDone ? "border-l-success" : "border-base-300"}`}>
                        <input type="checkbox"/>
                        <div className="collapse-title flex items-center justify-between">
                            <span>Durchgang {r}</span>
                            {isDone && <span className="badge badge-success badge-soft">Fertig</span>}
                        </div>

                        <div className="collapse-content">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roundMatches.map((m, i) => {
                                    const r = getResult(tournament.Results, m)
                                    return <MatchCard key={i} match={m} p1={r?.PointsTeam1} p2={r?.PointsTeam2} onResultChange={(p1, p2) => setResult(m, String(p1), String(p2))} />
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default ScheduleTab

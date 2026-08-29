import { useMemo, useRef } from "react"
import DateIcon from "../assets/DateIcon"
import type { Tournament } from "../domain/Tournament"
import TournamentBadge from "./ActiveTournament/TournamentBadge"
import TournamentState from "./ActiveTournament/TournamentState"
import TeamsTab from "./ActiveTournament/Tabs/TeamsTab"
import ResultTab from "./ActiveTournament/Tabs/ResultTab"
import ScheduleTab from "./ActiveTournament/Tabs/ScheduleTab"
import type { Match } from "../domain/Match"
import type { Team } from "../domain/Team"
import MatchScoreSheet from "./MatchScoreSheet"
import { useReactToPrint } from "react-to-print"
import PrintIcon from "../assets/PrintIcon"
import TeamScoreSheet from "./TeamScoreSheet"

const ActiveTournament = ({ tournament }: { tournament: Tournament }) => {
    const totalGames = useMemo(() => (tournament.Teams.length * (tournament.Teams.length - 1)) / 2, [tournament.Teams])
    const playedGames = useMemo(() => tournament.Results.length, [tournament.Results])
    const isStarted = useMemo(() => tournament.Results.length > 0, [tournament.Results])
    const isFinished = useMemo(() => playedGames >= totalGames && totalGames > 0, [playedGames, totalGames])

    const printContentRef = useRef<HTMLDivElement>(null)
    const print = useReactToPrint({ documentTitle: `Vorbereitung_${tournament.Name}`, contentRef: printContentRef });

    const matches = useMemo<Match[]>(() => {
        const uniqueTeams = [...new Map(tournament.Teams.map(t => [t.Id, t])).values()]

        const teams: (Team | null)[] = [...uniqueTeams]
        if (teams.length < 2 || tournament.Courts < 1) return []
        if (teams.length % 2 !== 0) teams.push(null) // Freilos

        const n = teams.length
        const half = n / 2
        const courts = Math.min(tournament.Courts, Math.floor(uniqueTeams.length / 2))

        const pairKey = (a: Team, b: Team): string =>
            a.Id < b.Id ? `${a.Id}|${b.Id}` : `${b.Id}|${a.Id}`

        const fixed = teams[0]
        const rotating = teams.slice(1)
        const allPairings: [Team, Team][] = []
        const seenPairs = new Set<string>()

        for (let r = 0; r < n - 1; r++) {
            const current = [fixed, ...rotating]
            for (let i = 0; i < half; i++) {
                const t1 = current[i]
                const t2 = current[n - 1 - i]
                if (t1 && t2) {
                    const key = pairKey(t1, t2)
                    if (!seenPairs.has(key)) {
                        seenPairs.add(key)
                        allPairings.push([t1, t2])
                    }
                }
            }
            rotating.unshift(rotating.pop()!)
        }

        const schedule: Match[] = []
        let remaining = [...allPairings]
        let round = 1

        const kickoffCount = new Map<string, number>()
        uniqueTeams.forEach(t => kickoffCount.set(t.Id, 0))

        const pickKickoff = (t1: Team, t2: Team): Team => {
            const c1 = kickoffCount.get(t1.Id) ?? 0
            const c2 = kickoffCount.get(t2.Id) ?? 0
            if (c1 < c2) return t1
            if (c2 < c1) return t2
            return t1.BibNumber <= t2.BibNumber ? t1 : t2
        }

        const pickRound = (limit: number): number[] => {
            let best: number[] = []
            const dfs = (start: number, busyIds: Set<string>, picked: number[]) => {
                if (picked.length > best.length) best = [...picked]
                if (best.length === limit) return
                for (let i = start; i < remaining.length; i++) {
                    if (picked.length + (remaining.length - i) <= best.length) break
                    const [t1, t2] = remaining[i]
                    if (busyIds.has(t1.Id) || busyIds.has(t2.Id)) continue
                    busyIds.add(t1.Id)
                    busyIds.add(t2.Id)
                    picked.push(i)
                    dfs(i + 1, busyIds, picked)
                    picked.pop()
                    busyIds.delete(t1.Id)
                    busyIds.delete(t2.Id)
                    if (best.length === limit) return
                }
            }
            dfs(0, new Set<string>(), [])
            return best
        }

        while (remaining.length > 0) {
            const indices = pickRound(Math.min(courts, remaining.length))
            indices.forEach((idx, court) => {
                const [Team1, Team2] = remaining[idx]

                const kickoffTeam = pickKickoff(Team1, Team2)
                kickoffCount.set(kickoffTeam.Id, (kickoffCount.get(kickoffTeam.Id) ?? 0) + 1)

                schedule.push({
                    Round: round,
                    Court: court + 1,
                    Kickoff: kickoffTeam.BibNumber,
                    Team1,
                    Team2,
                })
            })
            remaining = remaining.filter((_, i) => !indices.includes(i))
            round++
        }

        return schedule
    }, [tournament.Teams, tournament.Courts])

    return (
        <div className="flex flex-col w-full p-8 gap-2">
            {/* Header */}
            <div className="w-full flex justify-between">
                <div className="flex flex-col">
                    <span className="text-3xl text-base-content/60">{tournament.Name}</span>
                    <span className="flex items-center gap-2 text-sm text-base-content/70 mt-1 mb-4">
                        <DateIcon className="size-3.5 fill-neutral/60" />
                        {new Date(tournament.Date).toLocaleDateString("de-DE", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                        })}
                    </span>
                </div>
                <div className="flex gap-2">
                    <TournamentBadge isStarted={isStarted} isFinished={isFinished} />
                    <button className="btn btn-square btn-soft print:hidden btn-sm" onClick={print}>
                        <PrintIcon className="h-6" />
                    </button>
                </div>
            </div>

            {/* Status */}
            <TournamentState tournament={tournament} />

            <span className="divider mt-2 mb-0 text-xs text-neutral/50"></span>
            {/* Tabs */}
            <div className="tabs tabs-border">
                <input type="radio" name="tournament_tabs" className="tab" aria-label="Spielplan" defaultChecked />
                <div className="tab-content pt-4"><ScheduleTab tournament={tournament} matches={matches} /></div>

                <input type="radio" name="tournament_tabs" className="tab" aria-label="Teams" />
                <div className="tab-content pt-4"><TeamsTab tournament={tournament} /></div>

                <input type="radio" name="tournament_tabs" className="tab" aria-label="Ergebnisse" />
                <div className="tab-content pt-4"><ResultTab tournament={tournament} /></div>
            </div>

            <div className="hidden print:block w-full space-y-4" ref={printContentRef}>
                {matches.map((m, i) =>
                    <div key={i} className="print:break-inside-avoid print:page-break-inside-avoid">
                        <MatchScoreSheet match={m} />
                    </div>
                )}
                {tournament.Teams.map((t,i) =>
                    <div key={i} className="print:break-inside-avoid print:page-break-inside-avoid">
                        <TeamScoreSheet matches={matches} tournament={tournament} teamId={t.Id} />
                    </div>
                )}
            </div>
        </div>
    )
}
export default ActiveTournament

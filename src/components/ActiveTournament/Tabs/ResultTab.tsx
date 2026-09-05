import { useMemo, useRef } from "react"
import type { Tournament } from "../../../domain/Tournament"
import type { Team } from "../../../domain/Team"
import type { Column } from "../../Table"
import Table from "../../Table"
import PrintIcon from "../../../assets/PrintIcon"
import DateIcon from "../../../assets/DateIcon"
import { useReactToPrint } from "react-to-print"
import useMinWidth from "../../../hooks/useMinWidth"

interface StandingsRow {
    Team: Team
    Spiele: number
    Gewonnen: number
    Unentschieden: number
    Verloren: number
    StockpunkteGewonnen: number
    StockpunkteVerloren: number
    Quote: number
}

const cols: Column<StandingsRow>[] = [
    {
        name: "Rang",
        renderCell: (_, index) => index + 1,
    },
    {
        name: "Team",
        renderCell: s => s.Team.Name,
    },
    {
        name: "Spiele",
        renderCell: s => s.Spiele
    },
    {
        name: "Punkte",
        renderCell: s => `${s.Gewonnen * 2 + s.Unentschieden} : ${s.Verloren * 2 + s.Unentschieden}`
    },
    {
        name: "Stockpunkte",
        renderCell: s => `${s.StockpunkteGewonnen} : ${s.StockpunkteVerloren}`
    },
    {
        name: "Quote",
        renderCell: s => s.Quote.toFixed(3)
    }
]

const ResultTab = ({ tournament }: { tournament: Tournament }) => {

    const isSm = useMinWidth("sm")
    const printContentRef = useRef<HTMLDivElement>(null)
    const print = useReactToPrint({ documentTitle: `Ergebnis_${tournament.Name}`, contentRef: printContentRef, preserveAfterPrint: true });

    const standings = useMemo(() => {
        const standings = new Map<string, StandingsRow>()
        for (const team of tournament.Teams) {
            standings.set(team.Id, {
                Team: team,
                Spiele: 0,
                Gewonnen: 0,
                Unentschieden: 0,
                Verloren: 0,
                StockpunkteGewonnen: 0,
                StockpunkteVerloren: 0,
                Quote: 0,
            })
        }

        for (const r of tournament.Results) {
            const row1 = standings.get(r.TeamId1)
            const row2 = standings.get(r.TeamId2)
            if (!row1 || !row2) continue

            row1.Spiele++
            row2.Spiele++
            row1.StockpunkteGewonnen += r.PointsTeam1
            row1.StockpunkteVerloren += r.PointsTeam2
            row2.StockpunkteGewonnen += r.PointsTeam2
            row2.StockpunkteVerloren += r.PointsTeam1

            if (r.PointsTeam1 > r.PointsTeam2) {
                row1.Gewonnen++
                row2.Verloren++
            } else if (r.PointsTeam1 < r.PointsTeam2) {
                row1.Verloren++
                row2.Gewonnen++
            } else {
                row1.Unentschieden++
                row2.Unentschieden++
            }
        }
        const rows = Array.from(standings.values())
        for (const row of rows) {
            row.Quote = row.StockpunkteVerloren === 0
                ? row.StockpunkteGewonnen // alles gewonnen, nichts verloren
                : row.StockpunkteGewonnen / row.StockpunkteVerloren
        }
        rows.sort((a, b) => {
            const pA = a.Gewonnen * 2 + a.Unentschieden
            const pB = b.Gewonnen * 2 + b.Unentschieden
            if (pA > pB) return -1
            if (pA < pB) return 1
            return b.Quote - a.Quote

        })
        return rows
    }, [tournament.Teams, tournament.Results])

    const colTemplate: Column<StandingsRow>[] = useMemo(() => {
        if (!isSm) return cols.filter(c => c.name !== "Spiele" && c.name !== "Stockpunkte")
        return cols
    }, [standings, isSm])

    return (
        <div className="print-container" ref={printContentRef}>
            <div className="w-full flex justify-between print:mb-12 print:mt-8">
                <div></div>
                <div className="w-full flex-col items-center hidden print:flex">
                    <span className="text-xl print:text-3xl">Ergebnis {tournament.Name}</span>
                    <span className="items-center gap-2 text-sm text-base-content/70 mt-1 mb-4 flex">
                        <DateIcon className="size-3.5 fill-neutral/60" />
                        {new Date(tournament.Date).toLocaleDateString("de-DE", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "2-digit",
                        })}
                    </span>
                    <Table className="w-full" cols={cols} rows={standings} />
                </div>
                <div>
                    <button className="btn btn-sm btn-square btn-soft print:hidden" onClick={print}>
                        <PrintIcon className="h-6" />
                    </button>
                </div>
            </div>
            <Table className="print:hidden" cols={colTemplate} rows={standings} />
        </div>
    )
}
export default ResultTab

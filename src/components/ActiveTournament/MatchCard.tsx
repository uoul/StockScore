import { useCallback, useEffect, useMemo, useState } from "react"
import type { Match } from "../../domain/Match"

const MatchCard = ({ match, p1, p2, onResultChange }: { match: Match, p1?: number, p2?: number, onResultChange?: (p1?: number, p2?: number) => void }) => {
    const [points1, setPoints1] = useState<number | ''>(p1 ?? '')
    const [points2, setPoints2] = useState<number | ''>(p2 ?? '')

    const hasResult = useMemo(() => points1 !== '' && points2 !== '', [points1, points2])
    const winnerId = useMemo(() => hasResult && points1 !== points2 ? (points1 > points2 ? match.Team1.Id : match.Team2.Id) : null, [hasResult, points1, points2])
    const isUndecided = useMemo(() => hasResult && points1 === points2, [hasResult, points1, points2])

    useEffect(() => {
        setPoints1(p1 ?? '')
    }, [p1])

    useEffect(() => {
        setPoints2(p2 ?? '')
    }, [p2])

    const handlePoints1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0)
        setPoints1(val)
        onResultChange?.(val === '' ? undefined : val, points2 === '' ? undefined : points2)
    }

    const handlePoints2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0)
        setPoints2(val)
        onResultChange?.(points1 === '' ? undefined : points1, val === '' ? undefined : val)
    }

    const getResultIcon = useCallback((teamId: string) => {
        if (teamId === winnerId) return "🥇 "
        if (isUndecided) return "⚖️ "
        return ""
    }, [winnerId, isUndecided])

    return (
        <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
            <div className="card-body p-4 gap-3">
                {/* Header: Runde & Court */}
                <div className="flex items-center justify-between text-xs text-base-content/60">
                    <span className="badge badge-ghost badge-sm">Runde {match.Round}</span>
                    <span className="badge badge-outline badge-sm">Bahn {match.Court}</span>
                </div>

                {/* Team 1 */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="badge badge-primary badge-xs shrink-0">{match.Team1.BibNumber}</span>
                        <span className={`truncate font-medium ${winnerId === match.Team1.Id ? 'text-success' : isUndecided ? 'text-info' : ''}`}>
                            {getResultIcon(match.Team1.Id)}{match.Team1.Name}
                        </span>
                    </div>
                    <input type="number" value={points1} onChange={handlePoints1} placeholder="–" className="input input-bordered input-sm w-16 text-center" />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 text-base-content/30">
                    <div className="flex-1 border-t border-dashed" />
                    <span className="text-xs font-semibold">VS</span>
                    <div className="flex-1 border-t border-dashed" />
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="badge badge-secondary badge-xs shrink-0">{match.Team2.BibNumber}</span>
                        <span className={`truncate font-medium ${winnerId === match.Team2.Id ? 'text-success' : isUndecided ? 'text-info' : ''}`}>
                            {getResultIcon(match.Team2.Id)}{match.Team2.Name}
                        </span>
                    </div>
                    <input type="number" value={points2} onChange={handlePoints2} placeholder="–" className="input input-bordered input-sm w-16 text-center" />
                </div>
            </div>
        </div>
    )
}

export default MatchCard

import { useMemo, useRef, useState } from "react"

import useDialog from "../hooks/useDialog"
import type { Tournament } from "../domain/Tournament"
import { useTournamentStore } from "../hooks/useTournamentStore"
import type { Team } from "../domain/Team"


const RemoveTeamDialog = ({ tournament, team }: { tournament: Tournament, team: Team }) => {
    const { closeDialog } = useDialog()
    const { saveTournament, refreshTournaments } = useTournamentStore()

    const formRef = useRef<HTMLFormElement>(null)
    const [validate, setValidate] = useState<boolean>(false)

    const valid = useMemo(() => {
        return formRef?.current?.checkValidity() ?? false
    }, [validate])

    const handleRemove = async (e: React.SubmitEvent) => {
        e.preventDefault()
        try {
            tournament.Teams = [...tournament.Teams.filter(t => t.Id !== team.Id)]
                .map((t, index) => ({ ...t, BibNumber: index + 1 }));
            await saveTournament(tournament)
            await refreshTournaments()
        } finally {
            closeDialog()
        }
    }

    return (
        <form className="p-6 max-w-lg mx-auto bg-base-100 rounded-box shadow-lg flex flex-col" ref={formRef} onSubmit={handleRemove} onChange={() => setValidate(prev => !prev)}>
            <h1 className="font-bold text-lg mb-4">{team.Name} wirklich löschen?</h1>

            <label className="label">
                <input type="checkbox" className="checkbox mr-2" required />
                <span className="text-wrap text-sm select-none">Ich habe verstanden, dass diese Operation nicht mehr Rückgängig gemacht werden kann</span>
            </label>

            <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-soft" type="submit" disabled={!valid}>Ja</button>
                <button className="btn btn-primary" type="button" autoFocus onClick={closeDialog}>Nein</button>
            </div>
        </form>
    )
}
export default RemoveTeamDialog

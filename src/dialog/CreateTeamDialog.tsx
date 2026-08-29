import { useMemo, useRef, useState } from "react"
import { type Tournament } from "../domain/Tournament"
import useDialog from "../hooks/useDialog"
import { useTournamentStore } from "../hooks/useTournamentStore"
import type { Team } from "../domain/Team"
import { v4 as uuidv4 } from 'uuid';

const CreateTeamDialog = ({ tournament }: { tournament: Tournament }) => {
    const { closeDialog } = useDialog()
    const formRef = useRef<HTMLFormElement>(null)
    const { saveTournament, refreshTournaments } = useTournamentStore()
    const [team, setTeam] = useState<Team>({ Id: uuidv4(), Name: "", BibNumber: tournament.Teams.reduce((max, team) => Math.max(max, team.BibNumber ?? 0), 0) + 1 })

    const [validate, setValidate] = useState<boolean>(false)

    const valid = useMemo(() => {
        return formRef?.current?.checkValidity() ?? false
    }, [validate])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            tournament.Teams = [...tournament.Teams, team]
            await saveTournament(tournament)
            await refreshTournaments()
        } finally {
            closeDialog()
        }
    };

    const updateTeam = <K extends keyof Team>(key: K, value: Team[K]) => setTeam((prev) => (prev ? { ...prev, [key]: value } : prev))

    return (
        <form className="flex max-h-[85vh] flex-col h-full p-6 max-w-xl mx-auto bg-base-100 rounded-box shadow-lg min-w-[calc(100vw-48px)] sm:min-w-lg" ref={formRef} onChange={() => setValidate(prev => !prev)} onSubmit={handleSubmit}>
            <h1 className="mb-4 text-xl font-semibold text-neutral flex items-center gap-3">Team erstellen</h1>


            <div className="flex-1 min-h-0 overflow-y-auto mb-4 px-2">
                <fieldset className="fieldset w-full">
                    <label className="label">Name</label>
                    <input type="text" className="input validator w-full" placeholder="HereForBeer" autoFocus required value={team.Name} onChange={e => updateTeam("Name", e.target.value)} />
                    <p className="validator-hint hidden">Jedes Team muss einen Namen haben</p>
                </fieldset>

            </div>

            <div className="flex justify-end gap-2">
                <button className="btn btn-ghost" type="button" onClick={closeDialog}>Abbrechen</button>
                <button className="btn btn-primary" disabled={!valid} type="submit">Erstellen</button>
            </div>
        </form>
    )
}
export default CreateTeamDialog

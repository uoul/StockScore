import { useMemo, useRef, useState } from "react"
import { DEFAULT_TOURNAMENT, type Tournament } from "../domain/Tournament"
import useDialog from "../hooks/useDialog"
import useNotification from "../hooks/useNotification"
import { useTournamentStore } from "../hooks/useTournamentStore"

const CreateTournamentDialog = () => {
    const { closeDialog } = useDialog()
    const formRef = useRef<HTMLFormElement>(null)
    const { createTournament, refreshTournaments } = useTournamentStore()
    const { showSuccess } = useNotification()

    const [tournament, setTournament] = useState<Tournament>(DEFAULT_TOURNAMENT)
    const [validate, setValidate] = useState<boolean>(false)

    const valid = useMemo(() => {
        if(tournament.Courts <= 0) return false
        return formRef?.current?.checkValidity() ?? false
    }, [validate])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            await createTournament(tournament)
            await refreshTournaments()
        } finally {
            closeDialog()
            showSuccess(`${tournament.Name} angelegt`)
        }
    };

    const updateTournament = <K extends keyof Tournament>(key: K, value: Tournament[K]) => setTournament((prev) => (prev ? { ...prev, [key]: value } : prev))

    return (
        <form className="flex max-h-[85vh] flex-col h-full p-6 max-w-xl mx-auto bg-base-100 rounded-box shadow-lg min-w-[calc(100vw-48px)] sm:min-w-lg" ref={formRef} onChange={() => setValidate(prev => !prev)} onSubmit={handleSubmit}>
            <h1 className="mb-3 text-xl text-neutral shrink-0">Turnier erstellen</h1>

            <div className="flex-1 min-h-0 overflow-y-auto mb-4 px-2">
                <fieldset className="fieldset w-full">
                    <label className="label">Name</label>
                    <input type="text" className="input validator w-full" placeholder="Ortsmeisterschaft 2026" required value={tournament.Name} onChange={e => updateTournament("Name", e.target.value)} />
                    <p className="validator-hint hidden">Jedes Turnier muss einen Namen haben</p>
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="label">Datum</label>
                    <input
                        type="date"
                        className="input validator w-full"
                        required
                        value={
                            tournament.Date
                                ? `${tournament.Date.getFullYear()}-${String(tournament.Date.getMonth() + 1).padStart(2, "0")}-${String(tournament.Date.getDate()).padStart(2, "0")}`
                                : ""
                        }
                        onChange={e => {
                            const dateValue = e.target.value
                                ? new Date(e.target.value + "T00:00:00") // avoid timezone offset issues
                                : null
                            updateTournament("Date", dateValue as Tournament["Date"])
                        }}
                    />
                    <p className="validator-hint hidden">Jedes Turnier muss einen Datum haben</p>
                </fieldset>

                <fieldset className="fieldset w-full">
                    <label className="label">Spielfelder</label>
                    <input type="number" min={1} className="input w-full validator" placeholder="1" required value={tournament.Courts} onChange={e => updateTournament("Courts", Number(e.target.value))} />
                    <p className="validator-hint hidden">Jedes Turnier muss mindestens ein Spielfeld haben</p>
                </fieldset>

            </div>

            <div className="flex justify-end gap-2">
                <button className="btn btn-ghost" type="button" onClick={closeDialog}>Abbrechen</button>
                <button className="btn btn-primary" disabled={!valid} type="submit">Erstellen</button>
            </div>
        </form>
    )
}
export default CreateTournamentDialog

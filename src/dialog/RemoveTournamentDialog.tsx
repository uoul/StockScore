import { useMemo, useRef, useState } from "react"

import useDialog from "../hooks/useDialog"
import DateIcon from "../assets/DateIcon"
import type { Tournament } from "../domain/Tournament"
import { useTournamentStore } from "../hooks/useTournamentStore"


const RemoveTournamentDialog = ({ tournament }: { tournament: Tournament }) => {
    const { closeDialog } = useDialog()
    const { deleteTournament, refreshTournaments } = useTournamentStore()

    const formRef = useRef<HTMLFormElement>(null)
    const [validate, setValidate] = useState<boolean>(false)

    const valid = useMemo(() => {
        return formRef?.current?.checkValidity() ?? false
    }, [validate])

    const handleRemove = async (e: React.SubmitEvent) => {
        e.preventDefault()
        try {
            await deleteTournament(tournament.Id)
            await refreshTournaments()
        } finally {
            closeDialog()
        }
    }

    return (
        <form className="p-6 max-w-lg mx-auto bg-base-100 rounded-box shadow-lg flex flex-col" ref={formRef} onSubmit={handleRemove} onChange={() => setValidate(prev => !prev)}>
            <h1 className="font-bold text-lg">{tournament.Name} wirklich löschen?</h1>
            <span className="flex items-center gap-2 text-sm text-base-content/70 mt-1 mb-4">
                <DateIcon className="size-3.5 fill-neutral/60" />
                {new Date(tournament.Date).toLocaleDateString("de-DE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                })}
            </span>

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
export default RemoveTournamentDialog

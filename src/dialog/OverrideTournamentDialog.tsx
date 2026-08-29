import { useMemo, useRef, useState } from "react"

import useDialog from "../hooks/useDialog"
import type { Tournament } from "../domain/Tournament"


const OverrideTournamentDialog = ({ tournament, onAccept, onDecline }: { tournament: Tournament, onAccept?: () => Promise<void>, onDecline?: () => Promise<void> }) => {
    const { closeDialog } = useDialog()

    const formRef = useRef<HTMLFormElement>(null)
    const [validate, setValidate] = useState<boolean>(false)

    const valid = useMemo(() => {
        return formRef?.current?.checkValidity() ?? false
    }, [validate])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        try {
            if(onAccept) await onAccept()
        } finally {
            closeDialog()
        }
    }

    const handleDecline = async () => {
        if(onDecline) await onDecline()
        closeDialog()
    }

    return (
        <form className="p-6 max-w-lg mx-auto bg-base-100 rounded-box shadow-lg flex flex-col" ref={formRef} onSubmit={handleSubmit} onChange={() => setValidate(prev => !prev)}>
            <h1 className="font-bold text-lg mb-4">{tournament.Name} wirklich überschreiben?</h1>

            <label className="label">
                <input type="checkbox" className="checkbox mr-2" required />
                <span className="text-wrap text-sm select-none">Ich habe verstanden, dass diese Operation nicht mehr Rückgängig gemacht werden kann</span>
            </label>

            <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-soft" type="submit" disabled={!valid}>Ja</button>
                <button className="btn btn-primary" type="button" autoFocus onClick={handleDecline}>Nein</button>
            </div>
        </form>
    )
}
export default OverrideTournamentDialog

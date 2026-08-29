import { useCallback, useRef } from "react";
import CreateTournamentDialog from "../dialog/CreateTournamentDialog";
import useDialog from "../hooks/useDialog";
import useMinWidth from "../hooks/useMinWidth";
import useSideNavState from "../hooks/useSideNavState";
import { useTournamentStore } from "../hooks/useTournamentStore";
import useNotification from "../hooks/useNotification";
import type { Tournament } from "../domain/Tournament";
import OverrideTournamentDialog from "../dialog/OverrideTournamentDialog";
import ExportIcon from "../assets/ExportIcon";
import ImportIcon from "../assets/ImportIcon";

const AppBar = () => {
    const isMd = useMinWidth("md")
    const nav = useSideNavState()
    const { showDialog } = useDialog()
    const { activeTournament, createTournament, tournaments, saveTournament } = useTournamentStore()
    const { showWarning } = useNotification()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const exportActive = useCallback(async () => {
        if (!activeTournament) {
            showWarning("Es ist kein Turnier ausgewählt")
            return
        }
        const blob = new Blob([JSON.stringify(activeTournament)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTournament.Name.replaceAll(" ", "_")}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [activeTournament])

    const importFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const text = await file.text()
        const data: Tournament = JSON.parse(text)

        if (tournaments.find(t => t.Id === data.Id)) {
            showDialog(<OverrideTournamentDialog tournament={data} onAccept={async () => await saveTournament(data)} onDecline={async () => showWarning("Import wurde abgebrochen")}/>)
        } else {
            await createTournament(data)
        }
        e.target.value = ""
    }, [tournaments])

    return (
        <div className="col-span-2 mb-3">
            <input type="file" accept=".json" ref={fileInputRef} onChange={importFile} className="hidden" />
            <div className="navbar bg-base-100 [box-shadow:0_0_8px_2px_rgba(0,0,0,0.15)] rounded-2xl gap-2">
                <div className="flex-none ml-1">
                    <button className="btn btn-square btn-ghost" onClick={nav.toggle}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                    </button>
                </div>
                <div className="flex-1">
                    <span className="text-xl font-bold">Stock<span className="text-primary">Score</span></span>
                </div>
                <div className="flex gap-2 mr-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()}><ImportIcon className="fill-base-content size-3.5" /> Import</button>
                    <button className="btn btn-ghost btn-sm" onClick={exportActive} ><ExportIcon className="fill-base-content size-3.5" /> Export</button>
                    <button className="btn btn-primary btn-sm" onClick={() => showDialog(<CreateTournamentDialog />)}>{`+${isMd ? " Neues Turnier" : ""}`}</button>
                </div>
            </div>
        </div>
    );
}
export default AppBar

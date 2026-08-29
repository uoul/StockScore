import { useMemo } from "react";
import CloseIcon from "../../../assets/CloseIcon";
import type { Team } from "../../../domain/Team";
import type { Tournament } from "../../../domain/Tournament";
import type { Column } from "../../Table";
import Table from "../../Table";
import LockIcon from "../../../assets/LockIcon";
import useDialog from "../../../hooks/useDialog";
import CreateTeamDialog from "../../../dialog/CreateTeamDialog";
import RemoveTeamDialog from "../../../dialog/RemoveTeamDialog";

const TeamsTab = ({ tournament }: { tournament: Tournament }) => {
    const isLocked = useMemo(() => tournament.Results.length > 0, [tournament])
    const { showDialog } = useDialog()

    const colTemplate: Column<Team>[] = useMemo(() => [
        {
            name: "#",
            renderCell: t => t.BibNumber,
            sortFunc: (a, b) => a.BibNumber - b.BibNumber
        },
        {
            name: "Name",
            renderCell: t => t.Name,
            sortFunc: (a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0
        },
        {
            name: "",
            renderCell: t => (
                <div className="flex justify-end">
                    { isLocked ? <LockIcon className="size-4" /> : <button className="btn btn-xs btn-circle btn-soft btn-error fill-error hover:fill-error-content" onClick={() => showDialog(<RemoveTeamDialog team={t} tournament={tournament} />)}><CloseIcon className="size-3.5" /></button>}
                </div>
            ),
        }
    ], [isLocked, tournament])

    return (
        <div>
            <div className="w-full flex justify-end">
                <button className="btn btn-primary btn-sm" disabled={isLocked} onClick={() => showDialog(<CreateTeamDialog tournament={tournament} />)}>+ Team hinzufügen</button>
            </div>
            <Table cols={colTemplate} rows={tournament.Teams} />
        </div>
    )
}
export default TeamsTab

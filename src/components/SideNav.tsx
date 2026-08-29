import useSideNavState from "../hooks/useSideNavState"
import { useTournamentStore } from "../hooks/useTournamentStore"
import TournamentListItem from "./TournamentListItem"

const SideNav = () => {
    const nav = useSideNavState()
    const { tournaments, setActiveTournament } = useTournamentStore()

    return (
        <aside className={"overflow-hidden rounded-2xl h-[calc(100dvh-6.5rem)] bg-base-100 " + (nav.isOpen ? "[box-shadow:0_0_8px_2px_rgba(0,0,0,0.15)]" : "shadow-none")}>
            <div className={"flex flex-col transition-[max-width] duration-300 ease-in-out " + (nav.isOpen ? "max-w-[calc(100vw-12px)] md:max-w-100" : "max-w-0")}>
                <div className="w-fit min-w-64">
                    {tournaments.length <= 0 && <p className="text-base-content/30 text-sm text-center my-auto font-italic text-nowrap py-8">Keine Turniere</p>}
                    <ul className="flex flex-col gap-1 p-2 overflow-y-auto">
                        {tournaments.map(t => <TournamentListItem tournament={t} key={t.Id} onClick={t => setActiveTournament(t)} />)}
                    </ul>
                </div>
            </div>
        </aside>
    )
}
export default SideNav

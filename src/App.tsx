import AppBar from "./components/AppBar"
import useNotification from "./hooks/useNotification"
import SideNav from "./components/SideNav"
import { usePWAInstall } from "./hooks/useInstallBanner"
import { DialogOverlay } from "./hooks/useDialog"
import { useTournamentStore } from "./hooks/useTournamentStore"
import ActiveTournament from "./components/ActiveTournament"

const App = () => {
  const { NotificationContainer } = useNotification()
  const { InstallBanner } = usePWAInstall()
  const { activeTournament } = useTournamentStore()

  return (
    <div className="grid grid-cols-[auto_1fr] touch-manipulation gap-3 p-3 overflow-hidden h-screen bg-base-200">
      <AppBar />
      <SideNav />
      <div className="overflow-y-auto bg-base-100 rounded-xl [box-shadow:0_0_8px_2px_rgba(0,0,0,0.15)]">
        {activeTournament && <ActiveTournament tournament={activeTournament} />}
      </div>
      <NotificationContainer />
      <InstallBanner />
      <DialogOverlay />
    </div>

  )
}

export default App

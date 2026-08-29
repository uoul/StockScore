import { useEffect, useState, useCallback } from 'react'

// Type for the beforeinstallprompt event (not yet in standard TS lib defs)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STORAGE_KEY = 'pwa-install-dismissed'

const AddIcon = ({ className }: { className?: string }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={className}><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true)
  }, [])

  useEffect(() => {
    setIsDismissed(localStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  useEffect(() => {
    if (isInstalled) return
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [isInstalled])

  useEffect(() => {
    const handler = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', handler)
    return () => window.removeEventListener('appinstalled', handler)
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setIsInstalled(true)
    }
    setDeferredPrompt(null) // can only be used once
  }, [deferredPrompt])

  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent)

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsDismissed(true)
  }, [])

  const showBanner = !!deferredPrompt && !isInstalled && !isDismissed

  return { showBanner, promptInstall, dismiss, isInstalled, isDismissed, isIOS, InstallBanner }
}


export function InstallBanner() {
  const { showBanner, promptInstall, dismiss } = usePWAInstall()

  if (!showBanner) return null

  return (
    <div className="fixed top-22 right-0 z-50 px-2 pb-2 sm:px-4 sm:pb-4">
      <div role="alert" className="alert alert-soft bg-base-100 alert-vertical sm:alert-horizontal shadow-lg">
        {/* Icon */}
        <AddIcon className='size-5.5 fill-base-content' />

        {/* Text */}
        <div className="flex-1">
          <h3 className="font-bold">Stock Turnier</h3>
          <div className="text-xs opacity-80">
            Installiere Stock Turnier, um sie auch ohne Internet benutzen zu können
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={promptInstall}>Install</button>
          <button className="btn btn-sm btn-ghost" onClick={dismiss} aria-label="Dismiss">✕</button>
        </div>
      </div>
    </div>
  )
}
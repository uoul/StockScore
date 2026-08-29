import type { ReactElement } from "react";
import { create } from "zustand";

export const DialogOverlay = () => {
  const { dialog, isOpen, backdrop, closeDialog } = useDialog()

  const onBackgroundClicked = () => {
    if (backdrop) closeDialog()
  }

  return (
    <div className={`fixed inset-0 z-1000 flex items-center justify-center bg-black/30 backdrop-blur-xs transition-all duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onBackgroundClicked}>
      <div className={`flex flex-col bg-base-100 rounded-2xl shadow-xl transition-all duration-200 h-auto max-h-[85%] max-w-[95%] lg:max-w-2/3 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-2'}`} onClick={(e) => e.stopPropagation()}>
        {dialog}
      </div>

    </div>
  )
}

interface DialogState {
  showDialog: (d: ReactElement, backdrop?: boolean, onInit?: () => void, onClose?: () => void) => void
  closeDialog: () => void

  DialogOverlay: () => React.JSX.Element
  isOpen: boolean
  dialog: ReactElement | null
  backdrop: boolean
  onClose: (() => void) | null
}

const useDialog = create<DialogState>()(
  (set) => ({
    dialog: null,
    onClose: null,
    isOpen: false,
    backdrop: false,

    DialogOverlay: DialogOverlay,

    showDialog: (d: ReactElement, backdrop?: boolean, onOpen?: () => void, onClose?: () => void) => set(s => {
      // Close other dialog if open
      if (s.onClose) s.onClose()
      // Init
      if (onOpen) onOpen()
      // Open dialog
      return {
        isOpen: true,
        backdrop: backdrop,
        dialog: d,
        onClose: onClose
      }
    }),

    closeDialog: () => set(s => {
      if (s.onClose) s.onClose()
      return {
        isOpen: false,
        backdrop: false,
        onClose: null,
        dialog: null,
      }
    })
  }),
);

export default useDialog;

import { create } from 'zustand'

type SideNavState = {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

const useSideNavState = create<SideNavState>()((set) => ({
    isOpen: window.innerWidth >= 768,
    open: () => set({isOpen: true}),
    close: () => set({isOpen: false}),
    toggle: () => set((state) => ({
        isOpen: !state.isOpen
    }))
}))

export default useSideNavState;

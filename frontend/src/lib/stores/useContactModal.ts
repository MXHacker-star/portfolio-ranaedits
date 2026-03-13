import { create } from 'zustand'

interface ModalContext {
    type?: 'consultancy' | 'proposal' | 'package' | 'video-project' | 'graphic-project' | 'general';
    source?: string;
    service?: 'video-editing' | 'graphic-design' | 'full-package' | 'other';
    message?: string;
    packageDetails?: {
        name: string;
        price: string;
    };
}

interface ContactModalState {
    isOpen: boolean;
    context: ModalContext;
    openModal: (context?: ModalContext) => void;
    closeModal: () => void;
}

export const useContactModal = create<ContactModalState>((set) => ({
    isOpen: false,
    context: { type: 'general' },
    openModal: (context = { type: 'general' }) => set({ isOpen: true, context: { type: 'general', ...context } }),
    closeModal: () => set({ isOpen: false, context: { type: 'general' } }),
}))

import { create } from 'zustand';

interface NewBookingModalState {
  isOpen: boolean;
  initialDate: Date | null;
  openModal: (date?: Date) => void;
  closeModal: () => void;
}

export const useNewBookingModalStore = create<NewBookingModalState>((set) => ({
  isOpen: false,
  initialDate: null,
  openModal: (date) => set({ isOpen: true, initialDate: date || new Date() }),
  closeModal: () => set({ isOpen: false, initialDate: null }),
}));
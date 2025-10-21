import { create } from 'zustand';
import { WashBox } from '../types';

interface WashBoxDetailModalState {
  isOpen: boolean;
  box: WashBox | null;
  openModal: (box: WashBox) => void;
  closeModal: () => void;
}

export const useWashBoxDetailModalStore = create<WashBoxDetailModalState>((set) => ({
  isOpen: false,
  box: null,
  openModal: (box) => set({ isOpen: true, box }),
  closeModal: () => set({ isOpen: false, box: null }),
}));

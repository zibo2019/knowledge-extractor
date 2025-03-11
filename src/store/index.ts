import { create } from 'zustand';
import { AppState } from '../types';

export const useStore = create<AppState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  cards: [],
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  removeCard: (id) => set((state) => ({ cards: state.cards.filter(card => card.id !== id) })),
  apiConfig: {
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    timeout: 30000,
  },
  updateApiConfig: (config) => set((state) => ({ 
    apiConfig: { ...state.apiConfig, ...config } 
  })),
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),
}));
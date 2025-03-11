import { create } from 'zustand';
import { AppState } from '../types';

export const useStore = create<AppState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  cards: [],
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  removeCard: (id) => set((state) => ({ cards: state.cards.filter(card => card.id !== id) })),
  apiConfig: {
    apiKey: 'sk-zsghdqf9NWMDFOrzCb5f6896C29540Fe8dAdD82b8b353957',
    baseUrl: 'https://api.vveai.com/v1',
    timeout: 600000,
    model: 'gpt-4o',
    maxTokens: 4096,
  },
  updateApiConfig: (config) => set((state) => ({ 
    apiConfig: { ...state.apiConfig, ...config } 
  })),
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),
}));
import { create } from 'zustand';
import { AppState } from '../types';

export const useStore = create<AppState>((set, get) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  cards: [],
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  removeCard: (id) => set((state) => ({ cards: state.cards.filter(card => card.id !== id) })),
  updateCardOrder: (sourceIndex: number, destinationIndex: number) => set((state) => {
    const newCards = [...state.cards];
    const [movedCard] = newCards.splice(sourceIndex, 1);
    newCards.splice(destinationIndex, 0, movedCard);
    return { cards: newCards };
  }),
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
  showNumbering: true,
  toggleNumbering: () => {
    set((state) => ({ showNumbering: !state.showNumbering }));
    get().updateCardTitles();
  },
  updateCardTitles: () => {
    const { cards, showNumbering } = get();
    
    const updatedCards = cards.map((card, index) => {
      if (!card.originalTitle) {
        const hasNumbering = /^\d+\.\s/.test(card.title);
        
        if (hasNumbering) {
          card.originalTitle = card.title.replace(/^\d+\.\s/, '');
        } else {
          card.originalTitle = card.title;
        }
      }
      
      const newTitle = showNumbering 
        ? `${index + 1}. ${card.originalTitle}` 
        : card.originalTitle;
      
      return { ...card, title: newTitle };
    });
    
    set({ cards: updatedCards });
  }
}));
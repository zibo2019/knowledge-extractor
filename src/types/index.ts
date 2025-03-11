export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  tags: string[];
  importance: number;
  createdAt: Date;
  originalTitle?: string;
}

export interface APIConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  model: string;
  maxTokens: number;
}

export interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  cards: KnowledgeCard[];
  addCard: (card: KnowledgeCard) => void;
  removeCard: (id: string) => void;
  updateCard: (updatedCard: KnowledgeCard) => void;
  updateCardOrder: (sourceIndex: number, destinationIndex: number) => void;
  apiConfig: APIConfig;
  updateApiConfig: (config: Partial<APIConfig>) => void;
  isConnected: boolean;
  setConnected: (status: boolean) => void;
  showNumbering: boolean;
  toggleNumbering: () => void;
  updateCardTitles: () => void;
}
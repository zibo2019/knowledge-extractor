export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  tags: string[];
  importance: number;
  createdAt: Date;
}

export interface APIConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
}

export interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  cards: KnowledgeCard[];
  addCard: (card: KnowledgeCard) => void;
  removeCard: (id: string) => void;
  apiConfig: APIConfig;
  updateApiConfig: (config: Partial<APIConfig>) => void;
  isConnected: boolean;
  setConnected: (status: boolean) => void;
}
export enum Language {
  DA = 'da',
  EN = 'en'
}

export enum GameMode {
  MIME = 'mime',
  EXPLAIN = 'explain',
  SILENT = 'silent'
}

export enum AppState {
  MENU = 'menu',
  GAME = 'game',
  RESULT = 'result'
}

export interface WordCard {
  id: number;
  da: string;
  en: string;
  imageKeyword: string;
}

export interface GameSettings {
  language: Language;
  mode: GameMode;
  duration: number; // Time per card
  cardLimit: number; // How many cards to play
}
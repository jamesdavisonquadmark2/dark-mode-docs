export const THEME_IDS = ['default-dark', 'amoled-black', 'warm-dark'] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface UserPreferences {
  enabled: boolean;
  themeId: ThemeId;
}

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  description: string;
  previewColors: {
    background: string;
    surface: string;
    text: string;
  };
}

export type MessageType = 'TOGGLE' | 'SET_THEME' | 'GET_STATE';

export interface ToggleMessage {
  type: 'TOGGLE';
}

export interface SetThemeMessage {
  type: 'SET_THEME';
  themeId: ThemeId;
}

export interface GetStateMessage {
  type: 'GET_STATE';
}

export type ExtensionMessage = ToggleMessage | SetThemeMessage | GetStateMessage;

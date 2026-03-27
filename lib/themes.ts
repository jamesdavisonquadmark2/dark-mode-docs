import type { ThemeId, ThemeMeta } from './types';

export const THEMES: Record<ThemeId, ThemeMeta> = {
  'default-dark': {
    id: 'default-dark',
    name: 'Default Dark',
    description: 'Balanced dark gray theme, easy on the eyes',
    previewColors: {
      background: '#1e1e1e',
      surface: '#2d2d2d',
      text: '#e0e0e0',
    },
  },
  'amoled-black': {
    id: 'amoled-black',
    name: 'AMOLED Black',
    description: 'True black for OLED screens, maximum contrast',
    previewColors: {
      background: '#000000',
      surface: '#121212',
      text: '#ffffff',
    },
  },
  'warm-dark': {
    id: 'warm-dark',
    name: 'Warm Dark',
    description: 'Warm sepia-toned dark theme, reduced blue light',
    previewColors: {
      background: '#2d2417',
      surface: '#3d3225',
      text: '#e8d5b7',
    },
  },
};

export const THEME_LIST = Object.values(THEMES);

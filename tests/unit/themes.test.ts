import { describe, it, expect } from 'vitest';
import { THEMES, THEME_LIST } from '../../lib/themes';
import { THEME_IDS } from '../../lib/types';

describe('themes', () => {
  it('should have a theme for every theme ID', () => {
    for (const id of THEME_IDS) {
      expect(THEMES[id]).toBeDefined();
      expect(THEMES[id]!.id).toBe(id);
    }
  });

  it('should have valid preview colors for each theme', () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;

    for (const theme of THEME_LIST) {
      expect(theme.previewColors.background).toMatch(hexRegex);
      expect(theme.previewColors.surface).toMatch(hexRegex);
      expect(theme.previewColors.text).toMatch(hexRegex);
    }
  });

  it('should have names and descriptions for each theme', () => {
    for (const theme of THEME_LIST) {
      expect(theme.name.length).toBeGreaterThan(0);
      expect(theme.description.length).toBeGreaterThan(0);
    }
  });

  it('THEME_LIST should contain all themes', () => {
    expect(THEME_LIST).toHaveLength(THEME_IDS.length);
  });
});

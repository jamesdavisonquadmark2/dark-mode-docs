import { describe, it, expect, beforeEach } from 'vitest';
import { injectTheme, removeTheme, isThemeInjected } from '../../entrypoints/google-docs.content/injector';

describe('injector', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should inject a style element into the head', () => {
    injectTheme('default-dark');

    const style = document.getElementById('dark-mode-docs-theme');
    expect(style).not.toBeNull();
    expect(style?.tagName).toBe('STYLE');
  });

  it('should contain theme CSS variables', () => {
    injectTheme('default-dark');

    const style = document.getElementById('dark-mode-docs-theme');
    expect(style?.textContent).toContain('--dm-bg-primary');
    expect(style?.textContent).toContain('#1e1e1e');
  });

  it('should contain base CSS selectors', () => {
    injectTheme('default-dark');

    const style = document.getElementById('dark-mode-docs-theme');
    expect(style?.textContent).toContain('.kix-canvas-tile-content');
    expect(style?.textContent).toContain('.docs-menubar');
  });

  it('should swap themes without creating duplicate elements', () => {
    injectTheme('default-dark');
    injectTheme('amoled-black');

    const styles = document.querySelectorAll('#dark-mode-docs-theme');
    expect(styles).toHaveLength(1);
    expect(styles[0]?.textContent).toContain('#000000');
  });

  it('should apply AMOLED theme with true black', () => {
    injectTheme('amoled-black');

    const style = document.getElementById('dark-mode-docs-theme');
    expect(style?.textContent).toContain('--dm-bg-primary: #000000');
  });

  it('should apply warm theme with sepia colors', () => {
    injectTheme('warm-dark');

    const style = document.getElementById('dark-mode-docs-theme');
    expect(style?.textContent).toContain('--dm-bg-primary: #2d2417');
    expect(style?.textContent).toContain('sepia');
  });

  it('should remove the theme', () => {
    injectTheme('default-dark');
    expect(isThemeInjected()).toBe(true);

    removeTheme();
    expect(isThemeInjected()).toBe(false);
    expect(document.getElementById('dark-mode-docs-theme')).toBeNull();
  });

  it('should report injection state correctly', () => {
    expect(isThemeInjected()).toBe(false);

    injectTheme('default-dark');
    expect(isThemeInjected()).toBe(true);

    removeTheme();
    expect(isThemeInjected()).toBe(false);
  });

  it('should insert style as first child of head', () => {
    const existingMeta = document.createElement('meta');
    document.head.appendChild(existingMeta);

    injectTheme('default-dark');

    expect(document.head.firstChild?.nodeName).toBe('STYLE');
  });
});

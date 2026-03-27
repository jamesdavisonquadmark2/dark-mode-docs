import type { ThemeId } from '../../lib/types';
import { getThemeCss } from '../../themes';

const STYLE_ELEMENT_ID = 'dark-mode-docs-theme';

/**
 * Maximum time to poll for <head> element at document_start.
 * Google Docs may rebuild <head> during initialization, so we
 * also set up a persistence check.
 */
const HEAD_POLL_MS = 10;
const HEAD_POLL_MAX_ATTEMPTS = 500;

let persistenceTimer: ReturnType<typeof setInterval> | null = null;
let currentThemeId: ThemeId | null = null;

function getStyleElement(): HTMLStyleElement | null {
  return document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
}

function createStyleElement(css: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = css;
  return style;
}

function insertStyle(style: HTMLStyleElement): void {
  const target = document.head || document.documentElement;
  target.insertBefore(style, target.firstChild);
}

export function injectTheme(themeId: ThemeId): void {
  currentThemeId = themeId;
  const css = getThemeCss(themeId);

  const existing = getStyleElement();
  if (existing) {
    existing.textContent = css;
    startPersistenceCheck();
    return;
  }

  if (document.head || document.documentElement) {
    insertStyle(createStyleElement(css));
    startPersistenceCheck();
  } else {
    // At document_start, even documentElement may not exist yet
    waitForHead(css);
  }
}

/**
 * Poll for <head> to become available, then inject.
 */
function waitForHead(css: string): void {
  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    const target = document.head || document.documentElement;
    if (target) {
      clearInterval(timer);
      insertStyle(createStyleElement(css));
      startPersistenceCheck();
    } else if (attempts >= HEAD_POLL_MAX_ATTEMPTS) {
      clearInterval(timer);
    }
  }, HEAD_POLL_MS);
}

/**
 * Google Docs may strip and rebuild the <head> during initialization,
 * removing our injected <style>. This periodic check re-injects if
 * the style element disappears.
 */
function startPersistenceCheck(): void {
  if (persistenceTimer) return;

  let checkCount = 0;
  const MAX_CHECKS = 300; // 30 seconds of checking, then stop

  persistenceTimer = setInterval(() => {
    checkCount++;

    if (checkCount > MAX_CHECKS) {
      stopPersistenceCheck();
      return;
    }

    if (currentThemeId && !getStyleElement()) {
      const css = getThemeCss(currentThemeId);
      insertStyle(createStyleElement(css));
    }
  }, HEAD_POLL_MS * 10); // Check every 100ms
}

function stopPersistenceCheck(): void {
  if (persistenceTimer) {
    clearInterval(persistenceTimer);
    persistenceTimer = null;
  }
}

export function removeTheme(): void {
  currentThemeId = null;
  stopPersistenceCheck();
  getStyleElement()?.remove();
}

export function isThemeInjected(): boolean {
  return getStyleElement() !== null;
}

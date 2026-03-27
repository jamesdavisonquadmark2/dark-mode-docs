import { injectTheme, removeTheme } from './injector';
import { startObserver, stopObserver } from './observer';
import { preferences } from '../../lib/storage';
import type { ExtensionMessage, UserPreferences } from '../../lib/types';

export default defineContentScript({
  matches: ['https://docs.google.com/*'],
  runAt: 'document_start',
  allFrames: true,

  async main(ctx) {
    console.log('[DarkModeDocs] Content script started');

    // Start loading preferences immediately — don't block injection
    let prefs: UserPreferences;
    try {
      prefs = await preferences.getValue();
      console.log('[DarkModeDocs] Preferences loaded:', JSON.stringify(prefs));
    } catch (err) {
      console.error('[DarkModeDocs] Failed to load preferences:', err);
      return;
    }

    if (prefs.enabled) {
      applyDarkMode(prefs);
    }

    // Listen for messages from popup/background
    browser.runtime.onMessage.addListener((message: ExtensionMessage) => {
      console.log('[DarkModeDocs] Message received:', JSON.stringify(message));
      handleMessage(message);
    });

    // Watch for preference changes (from other tabs or popup)
    preferences.watch((newPrefs) => {
      console.log('[DarkModeDocs] Preferences changed:', JSON.stringify(newPrefs));
      if (newPrefs.enabled) {
        applyDarkMode(newPrefs);
      } else {
        removeDarkMode();
      }
    });

    // Clean up on context invalidation
    ctx.onInvalidated(() => {
      stopObserver();
    });
  },
});

function applyDarkMode(prefs: UserPreferences): void {
  injectTheme(prefs.themeId);
  startObserver(() => {
    // Re-inject on DOM changes to cover dynamically added elements
    // and to restore the style if Google Docs rebuilds the DOM
    injectTheme(prefs.themeId);
  });
}

function removeDarkMode(): void {
  removeTheme();
  stopObserver();
}

async function handleMessage(message: ExtensionMessage): Promise<void> {
  const prefs = await preferences.getValue();

  switch (message.type) {
    case 'TOGGLE': {
      if (prefs.enabled) {
        applyDarkMode(prefs);
      } else {
        removeDarkMode();
      }
      break;
    }
    case 'SET_THEME': {
      if (prefs.enabled) {
        injectTheme(message.themeId);
      }
      break;
    }
    case 'GET_STATE': {
      // State is handled via storage.watch, no action needed
      break;
    }
  }
}

import { preferences, toggleEnabled } from '../../lib/storage';
import type { ExtensionMessage } from '../../lib/types';

export default defineBackground(() => {
  // Handle keyboard shortcut
  browser.commands.onCommand.addListener(async (command) => {
    if (command === 'toggle_dark_mode') {
      const newEnabled = await toggleEnabled();
      await broadcastMessage({ type: 'TOGGLE' });
      await updateBadge(newEnabled);
    }
  });

  // Set initial badge state on startup
  preferences.getValue().then((prefs) => {
    updateBadge(prefs.enabled);
  });

  // Keep badge in sync with storage changes
  preferences.watch((prefs) => {
    updateBadge(prefs.enabled);
  });
});

async function broadcastMessage(message: ExtensionMessage): Promise<void> {
  const tabs = await browser.tabs.query({ url: 'https://docs.google.com/*' });

  for (const tab of tabs) {
    if (tab.id !== undefined) {
      browser.tabs.sendMessage(tab.id, message).catch(() => {
        // Tab may not have content script loaded yet — ignore
      });
    }
  }
}

async function updateBadge(enabled: boolean): Promise<void> {
  await browser.action.setBadgeText({ text: enabled ? 'ON' : '' });
  await browser.action.setBadgeBackgroundColor({
    color: enabled ? '#8ab4f8' : '#666666',
  });
}

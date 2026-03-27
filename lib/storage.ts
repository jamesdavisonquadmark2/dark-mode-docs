import { storage } from '@wxt-dev/storage';
import type { ThemeId, UserPreferences } from './types';

const DEFAULT_PREFERENCES: UserPreferences = {
  enabled: true,
  themeId: 'default-dark',
};

export const preferences = storage.defineItem<UserPreferences>('local:preferences', {
  defaultValue: DEFAULT_PREFERENCES,
});

export async function getPreferences(): Promise<UserPreferences> {
  return await preferences.getValue();
}

export async function setEnabled(enabled: boolean): Promise<void> {
  const current = await preferences.getValue();
  await preferences.setValue({ ...current, enabled });
}

export async function setTheme(themeId: ThemeId): Promise<void> {
  const current = await preferences.getValue();
  await preferences.setValue({ ...current, themeId });
}

export async function toggleEnabled(): Promise<boolean> {
  const current = await preferences.getValue();
  const newEnabled = !current.enabled;
  await preferences.setValue({ ...current, enabled: newEnabled });
  return newEnabled;
}

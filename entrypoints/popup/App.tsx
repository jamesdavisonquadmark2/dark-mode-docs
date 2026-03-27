import { useEffect, useState } from 'react';
import { preferences, setEnabled, setTheme } from '../../lib/storage';
import type { ThemeId, UserPreferences } from '../../lib/types';
import Toggle from './components/Toggle';
import ThemePicker from './components/ThemePicker';

const DEFAULT_PREFS: UserPreferences = { enabled: false, themeId: 'default-dark' };

export default function App() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    preferences.getValue().then((p) => {
      setPrefs(p);
      setLoading(false);
    });

    const unwatch = preferences.watch((newPrefs) => {
      setPrefs(newPrefs);
    });

    return () => {
      unwatch();
    };
  }, []);

  const handleToggle = async () => {
    const newEnabled = !prefs.enabled;
    await setEnabled(newEnabled);
  };

  const handleThemeChange = async (themeId: ThemeId) => {
    await setTheme(themeId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-white">Dark Mode</h1>
          <p className="text-xs text-gray-400">for Google Docs</p>
        </div>
        <Toggle enabled={prefs.enabled} onToggle={handleToggle} />
      </div>

      <div className="border-t border-gray-700" />

      <ThemePicker
        selectedTheme={prefs.themeId}
        onSelect={handleThemeChange}
        disabled={!prefs.enabled}
      />

      <div className="pt-1 text-center">
        <p className="text-[10px] text-gray-500">
          Ctrl+Shift+D to toggle
        </p>
      </div>
    </div>
  );
}

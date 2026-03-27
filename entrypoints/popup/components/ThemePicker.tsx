import type { ThemeId } from '../../../lib/types';
import { THEME_LIST } from '../../../lib/themes';

interface ThemePickerProps {
  selectedTheme: ThemeId;
  onSelect: (themeId: ThemeId) => void;
  disabled: boolean;
}

export default function ThemePicker({ selectedTheme, onSelect, disabled }: ThemePickerProps) {
  return (
    <div className={`space-y-2 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Theme</h2>
      <div className="space-y-1.5">
        {THEME_LIST.map((theme) => {
          const isSelected = theme.id === selectedTheme;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelect(theme.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                transition-colors duration-150
                ${isSelected
                  ? 'bg-gray-700 ring-1 ring-blue-500'
                  : 'bg-gray-800 hover:bg-gray-700'
                }
              `}
            >
              <div className="flex gap-0.5 shrink-0">
                <div
                  className="w-4 h-4 rounded-l-sm"
                  style={{ backgroundColor: theme.previewColors.background }}
                />
                <div
                  className="w-4 h-4"
                  style={{ backgroundColor: theme.previewColors.surface }}
                />
                <div
                  className="w-4 h-4 rounded-r-sm"
                  style={{ backgroundColor: theme.previewColors.text }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">{theme.name}</div>
                <div className="text-[10px] text-gray-400 truncate">{theme.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

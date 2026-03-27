import type { ThemeId } from '../lib/types';

import baseCss from './base.css?raw';
import defaultDarkCss from './default-dark.css?raw';
import amoledBlackCss from './amoled-black.css?raw';
import warmDarkCss from './warm-dark.css?raw';

const THEME_CSS: Record<ThemeId, string> = {
  'default-dark': defaultDarkCss,
  'amoled-black': amoledBlackCss,
  'warm-dark': warmDarkCss,
};

export function getThemeCss(themeId: ThemeId): string {
  const themeCss = THEME_CSS[themeId];
  return `${themeCss}\n${baseCss}`;
}

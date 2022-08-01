import colors from '../constants/colors';
import {ThemeModes} from './ThemeConstants';
import {ThemeController} from './ThemeController';

const DEFAULT_COLOR_THEME = {
  [ThemeModes.Light]: {
    primary: colors.GoldenTainoi,
    onPrimary: colors.BlackPearl,
    text: colors.BlackPearl,
    error: 'red',
    success: 'green',
    background: colors.White,
  },
  [ThemeModes.Dark]: {
    primary: colors.GoldenTainoi,
    onPrimary: colors.BlackPearl,
    text: colors.White,
    error: 'red',
    success: 'green',
    background: colors.BlackPearl,
  },
};

/**
 * @class DefaultTheme - class to define the default theme for the application.
 */
class DefaultTheme extends ThemeController {
  constructor() {
    super();
    this.colorTheme = DEFAULT_COLOR_THEME;
    this.color = DEFAULT_COLOR_THEME[this.mode];
  }
}

export default new DefaultTheme();

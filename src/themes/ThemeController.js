import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import {ThemeModes} from './ThemeConstants';

/**
 * @class ThemeController - Class to control the colors returned by the inherited Theme classes.
 */
export class ThemeController {
  mode = ThemeModes.Light;
  colorTheme = null;
  color = null;

  /**
   * @constructor
   */
  constructor() {
    this.bindFunctions();

    LocalEvent.on(EventTypes.Themes.SwitchToDark, () => {
      this.switchToDark();
    });
    LocalEvent.on(EventTypes.Themes.SwitchToLight, () => {
      this.switchToLight();
    });
  }

  /**
   * @private @function bindFunctions - Function to bind the other functions.
   */
  bindFunctions() {
    this.switchToDark.bind(this);
    this.switchToLight.bind(this);
    this.getColors.bind(this);
  }

  /**
   * @public @function getColors - Function to get the available colors in the theme.
   * @returns ThemeColors
   */
  getColors() {
    if (this.colorTheme && this.color) {
      return this.color;
    }
    return null;
  }

  /**
   * @private @function switchToDark - Function to switch the functions to a dark mode.
   * @returns void
   */
  switchToDark() {
    if (this.colorTheme && this.color) {
      this.color = this.colorTheme[ThemeModes.Dark];
    }
    this.mode = ThemeModes.Dark;
  }

  /**
   * @private @function switchToLight - Function to switch the functions to a light mode.
   * @returns void
   */
  switchToLight() {
    if (this.colorTheme && this.color) {
      this.color = this.colorTheme[ThemeModes.Light];
    }
    this.mode = ThemeModes.Light;
  }
}

import React, {useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import {ThemeModes} from './ThemeConstants';

const ThemeContext = React.createContext({
  mode: ThemeModes.Light,
  toggleTheme() {},
});

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

/**
 *  React Native component for providing context throughout the app.
 */
export const ThemeProvider = React.memo(props => {
  const {shouldUseDeviceTheme, children} = props;
  const isDarkMode = useColorScheme() === ThemeModes.Dark;

  const [themeMode, setThemeMode] = useState(ThemeModes.Light);

  useEffect(() => {
    if (isDarkMode && shouldUseDeviceTheme) {
      LocalEvent.emit(EventTypes.Themes.SwitchToDark);
      setThemeMode(ThemeModes.Dark);
    }
  }, [isDarkMode, shouldUseDeviceTheme]);

  const toggleTheme = React.useCallback(() => {
    setThemeMode(currentThemeMode => {
      if (currentThemeMode === ThemeModes.Light) {
        LocalEvent.emit(EventTypes.Themes.SwitchToDark);
        return ThemeModes.Dark;
      } else {
        LocalEvent.emit(EventTypes.Themes.SwitchToLight);
        return ThemeModes.Light;
      }
    });
  }, []);

  const MemoizedValue = React.useMemo(() => {
    const value = {
      mode: themeMode,
      toggleTheme,
    };
    return value;
  }, [themeMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={MemoizedValue}>
      {children}
    </ThemeContext.Provider>
  );
});

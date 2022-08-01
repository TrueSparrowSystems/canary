import {useMemo} from 'react';
import {useThemeContext} from '../themes/ThemeContext';
import {useStyleProcessor} from './useStyleProcessor';

export function useStyle(getStyles, id) {
  const {mode} = useThemeContext();

  const styles = useMemo(() => {
    return getStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStyles, mode]);

  return useStyleProcessor(styles || {}, id);
}

import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';

const LOGS_ENABLED = false;

function AppStateManager() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  const handleAppStateChange = nextAppState => {
    if (appState.current === nextAppState) {
      return;
    }

    switch (nextAppState) {
      case 'active': {
        LOGS_ENABLED && console.debug('App has come to the foreground!');

        LocalEvent.emit(EventTypes.AppState.Active);
        break;
      }
      case 'inactive': {
        LOGS_ENABLED && console.debug('App is inactive');
        LocalEvent.emit(EventTypes.AppState.InActive);
        break;
      }
      case 'background': {
        LOGS_ENABLED && console.debug('App has went to the background!');
        LocalEvent.emit(EventTypes.AppState.Background);
        break;
      }
    }

    appState.current = nextAppState;
  };
  return null;
}

export default AppStateManager;

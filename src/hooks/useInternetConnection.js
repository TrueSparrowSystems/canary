import {useEffect, useRef, useState} from 'react';
import {EventTypes, LocalEvent} from '../utils/LocalEvent';
import {networkConnection} from '../services/NetworkConnection';

export default function useInternetConnection() {
  const internetConnectionRef = useRef(
    networkConnection().isInternetAvailable(),
  );
  const [isInternetConnected, setInternetConnected] = useState(
    internetConnectionRef.current,
  );

  useEffect(() => {
    const onConnect = () => {
      setInternetConnected(true);
      internetConnectionRef.current = true;
    };
    const onDisconnect = () => {
      setInternetConnected(false);
      internetConnectionRef.current = false;
    };

    LocalEvent.on(EventTypes.Internet.Connected, onConnect);
    LocalEvent.on(EventTypes.Internet.Disconnected, onDisconnect);
    setInternetConnected(networkConnection().isInternetAvailable());

    return () => {
      LocalEvent.off(EventTypes.Internet.Connected, onConnect);
      LocalEvent.off(EventTypes.Internet.Disconnected, onDisconnect);
    };
  }, []);
  return {
    bIsInternetConnected: isInternetConnected,
  };
}

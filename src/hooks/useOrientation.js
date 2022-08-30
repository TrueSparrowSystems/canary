import {Dimensions, Platform} from 'react-native';
import {useEffect, useRef, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

export const OrientationType = {
  Landscape: 'landscape',
  Portrait: 'portrait',
};

function getCurrentOrientation() {
  const dim = Dimensions.get(Platform.OS === 'ios' ? 'screen' : 'window');
  const isPortrait = dim.height >= dim.width;
  const isLandscape = !isPortrait;
  const orientation =
    dim.height >= dim.width
      ? OrientationType.Portrait
      : OrientationType.Landscape;
  return {
    isPortrait,
    isLandscape,
    orientation,
  };
}

export function useOrientation() {
  return getCurrentOrientation();
}

export function useOrientationState() {
  const {isPortrait, isLandscape, orientation} = getCurrentOrientation();
  const [currentOrientation, setCurrentOrientation] = useState(orientation);
  const currentOrientationRef = useRef(null);
  currentOrientationRef.current = currentOrientation;
  const shouldUpdate = useRef(true);

  const updateOrientation = useCallback(() => {
    if (shouldUpdate.current) {
      const {orientation: o} = getCurrentOrientation();
      if (currentOrientationRef.current !== o) {
        setCurrentOrientation(o);
      }
    }
  }, []);

  useEffect(() => {
    const callback = () => {
      updateOrientation();
    };
    const subscription = Dimensions.addEventListener('change', callback);
    return () => {
      subscription.remove();
    };
  }, [updateOrientation]);

  useFocusEffect(
    useCallback(() => {
      shouldUpdate.current = true;
      updateOrientation();
      return () => {
        shouldUpdate.current = false;
      };
    }, [updateOrientation]),
  );

  return {orientation, isPortrait, isLandscape};
}

import DeviceInfo from 'react-native-device-info';
import {StyleSheet} from 'react-native';
import {useOrientation} from './useOrientation';
import Cache from '../services/Cache';
const isTablet = DeviceInfo.isTablet();

export function useStyleProcessor(style, id) {
  const {isLandscape, orientation} = useOrientation();
  const cachedStyle = Cache.getValue('styles') || {};
  if (!__DEV__ && id) {
    if (!cachedStyle[id]) {
      const landscapeData = processStyle(style, 'landscape');
      const portraitData = processStyle(style, 'portrait');
      const styleData = {landscape: landscapeData, portrait: portraitData};
      cachedStyle[id] = styleData;
      Cache.setValue('styles', cachedStyle);
    }
    return isLandscape ? cachedStyle[id].landscape : cachedStyle[id].portrait;
  } else {
    return processStyle(style, orientation);
  }
}

function processStyle(style, orientation) {
  if (!style) {
    return {};
  }
  const newStyle = {};
  Object.keys(style).forEach(key => {
    newStyle[key] = {...style[key]};
    if (style[key].tablet) {
      if (isTablet) {
        newStyle[key] = Object.assign({}, style[key], style[key].tablet);
      }
      delete newStyle[key].tablet;
    }
    if (newStyle[key].landscape) {
      if (orientation === 'landscape') {
        newStyle[key] = Object.assign(
          {},
          newStyle[key],
          newStyle[key].landscape,
        );
      }
      delete newStyle[key].landscape;
    }
  });

  return StyleSheet.create(newStyle);
}

/*
Example format for style
style = {
  container: {
    margin: 20,
    landscape: {
      margin:10
    },
    tablet: {
      margin:30,
      landscape: {
        margin:40
       }
    }
  }
}
--------------------------------
Result:
mobileStyle = {
  container: {
    margin: 20,
  }
}

mobileLandscapeStyle = {
  container: {
    margin: 10,
  }
}

tabletStyle = {
  container: {
    margin: 30,
  }
}

tabletLandscapeStyle = {
  container: {
    margin: 40,
  }
}
 */

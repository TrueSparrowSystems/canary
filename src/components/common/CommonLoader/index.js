import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {CanaryGifTransparentBg} from '../../../assets/animation';
import colors, {getColorWithOpacity} from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {EventTypes, LocalEvent} from '../../../utils/LocalEvent';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';

function CommonLoader() {
  const localStyle = useStyleProcessor(styles, 'CommonLoader');
  const [showLoader, setShowLoader] = useState(false);

  const show = useCallback(() => {
    setShowLoader(true);
  }, []);

  const hide = useCallback(() => {
    setShowLoader(false);
  }, []);

  useEffect(() => {
    LocalEvent.on(EventTypes.CommonLoader.Show, show);
    LocalEvent.on(EventTypes.CommonLoader.Hide, hide);
    return () => {
      LocalEvent.off(EventTypes.CommonLoader.Show, show);
      LocalEvent.off(EventTypes.CommonLoader.Hide, hide);
    };
  }, [hide, show]);

  return showLoader ? (
    <View style={localStyle.container}>
      <Image source={CanaryGifTransparentBg} style={localStyle.loaderSize} />
      <Text style={localStyle.connectingScreen}>Please Wait...</Text>
    </View>
  ) : null;
}

export default React.memo(CommonLoader);

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: getColorWithOpacity(colors.Black, 0.3),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  connectingScreen: {
    fontFamily: fonts.InterRegular,
    color: colors.White,
    fontSize: fontPtToPx(16),
    fontWeight: 'normal',
    letterSpacing: 0.4,
    textTransform: 'capitalize',
  },
  loaderSize: {
    height: layoutPtToPx(100),
    width: layoutPtToPx(100),
  },
};

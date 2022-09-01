import {useNavigation} from '@react-navigation/native';
import {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {Dimensions, Platform} from 'react-native';
import ScreenName from '../../constants/ScreenName';
import {useOrientationState} from '../../hooks/useOrientation';
import LandingScreenCarousalData from './LandingScreenCarousalData';

export default function useLandingScreenData({isNotOnboardingScreen}) {
  const navigation = useNavigation();

  const {isPortrait} = useOrientationState();
  const flatListRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(activeIndexRef.current);

  const carousalData = useMemo(() => LandingScreenCarousalData, []);
  const {height: windowHeight, width: windowWidth} = useMemo(
    () => Dimensions.get('window'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPortrait],
  );

  useEffect(() => {
    flatListRef.current.scrollToOffset({
      offset: windowWidth * activeIndexRef.current,
    });
  }, [windowWidth]);

  const _onMomentumScrollEnd = useCallback(
    e => {
      const xPos = e.nativeEvent.contentOffset.x;
      const newIndex = Math.round(xPos / windowWidth);

      activeIndexRef.current = newIndex;
      setActiveIndex(activeIndexRef.current);
    },
    [windowWidth],
  );

  const setFlatListRef = useCallback(ref => {
    flatListRef.current = ref;
  }, []);

  const onContinuePress = useCallback(() => {
    if (activeIndexRef.current === carousalData.length - 1) {
      if (isNotOnboardingScreen) {
        navigation.goBack();
        return;
      } else {
        navigation.navigate(ScreenName.PreferenceScreen);
        return;
      }
    }
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: activeIndexRef.current + 1,
    });

    if (Platform.OS === 'android') {
      activeIndexRef.current++;
      setActiveIndex(activeIndexRef.current);
    }
  }, [carousalData.length, isNotOnboardingScreen, navigation]);

  return {
    aCarousalData: carousalData,
    nWindowWidth: windowWidth,
    nWindowHeight: windowHeight,
    nActiveIndex: activeIndexRef.current,
    fnSetFlatListRef: setFlatListRef,
    fnOnMomentumScrollEnd: _onMomentumScrollEnd,
    fnOnContinuePress: onContinuePress,
  };
}

import {useNavigation} from '@react-navigation/native';
import {useCallback, useMemo, useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import ScreenName from '../../constants/ScreenName';
import LandingScreenCarousalData from './LandingScreenCarousalData';

export default function useLandingScreenData() {
  const navigation = useNavigation();

  const flatListRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(activeIndexRef.current);

  const carousalData = useMemo(() => LandingScreenCarousalData, []);
  const windowWidth = useMemo(() => Dimensions.get('window').width, []);

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
      navigation.navigate(ScreenName.PreferenceScreen);
      return;
    }
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: activeIndexRef.current + 1,
    });
  }, [carousalData.length, navigation]);

  return {
    aCarousalData: carousalData,
    nWindowWidth: windowWidth,
    nActiveIndex: activeIndexRef.current,
    fnSetFlatListRef: setFlatListRef,
    fnOnMomentumScrollEnd: _onMomentumScrollEnd,
    fnOnContinuePress: onContinuePress,
  };
}

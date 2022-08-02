import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import {getTrendingTopicsForCountry} from '../../utils/CountryWoeidUtils';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function useDiscoverScreenData() {
  const [trendingTopics, setTrendingTopics] = useState([]);

  const navigation = useNavigation();

  const selectedCountry = useRef(null);

  useEffect(() => {
    getTrendingTopics();

    LocalEvent.on(EventTypes.LocationSelectionChanged, getTrendingTopics);
    return () => {
      LocalEvent.off(EventTypes.LocationSelectionChanged, getTrendingTopics);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTrendingTopics = useCallback(() => {
    const countryName =
      Cache.getValue(CacheKey.SelectedLocation) || 'Worldwide';

    selectedCountry.current = countryName;

    getTrendingTopicsForCountry(countryName)
      .then(trendingTopicArray => {
        setTrendingTopics([...trendingTopicArray]);
      })
      .catch(() => {
        //Handle Error
      });
  }, []);

  const onSearchPress = useCallback(
    query => {
      navigation.navigate(ScreenName.SearchResultScreen, {query});
    },
    [navigation],
  );

  const navigateToLocationSelectionScreen = useCallback(() => {
    navigation.navigate(ScreenName.LocationSelectionScreen);
  }, [navigation]);

  const onTopicClick = useCallback(text => {
    LocalEvent.emit(EventTypes.OnTrendingTopicClick, text);
  }, []);

  return {
    aTrendingTopics: trendingTopics,
    sSelectedCountryName: selectedCountry.current,
    fnOnSearchPress: onSearchPress,
    fnOnTopicClick: onTopicClick,
    fnNavigateToLocationSelectionScreen: navigateToLocationSelectionScreen,
  };
}
export default useDiscoverScreenData;

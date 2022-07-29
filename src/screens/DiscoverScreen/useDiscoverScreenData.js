import {useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import ScreenName from '../../constants/ScreenName';
import {getTrendingTopicsForCountry} from '../../utils/CountryWoeidUtils';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function useDiscoverScreenData() {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    getTrendingTopicsForCountry('India')
      .then(trendingTopicArray => {
        setTrendingTopics(trendingTopicArray);
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
  const onTopicClick = useCallback(text => {
    LocalEvent.emit(EventTypes.OnTrendingTopicClick, text);
  }, []);

  return {
    aTrendingTopics: trendingTopics,
    fnOnSearchPress: onSearchPress,
    fnOnTopicClick: onTopicClick,
  };
}
export default useDiscoverScreenData;

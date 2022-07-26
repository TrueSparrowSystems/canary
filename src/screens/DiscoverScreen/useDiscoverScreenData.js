import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import ScreenName from '../../constants/ScreenName';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function useDiscoverScreenData() {
  const trendingTopics = ['#Trends', 'Trend', 'Cricket'];
  const navigation = useNavigation();
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

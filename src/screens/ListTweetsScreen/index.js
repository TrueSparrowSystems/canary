import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Header from '../../components/common/Header';
import TimelineList from '../../components/TimelineList';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {listService} from '../../services/ListService';
import colors from '../../constants/colors';
import ListTweetDataSource from './ListTweetDataSource';

function ListTweetsScreen(props) {
  const localStyle = useStyleProcessor(styles, 'ListTweetsScreen');
  const {listId, listName} = props?.route?.params;
  const _listService = listService();
  const [isLoading, setIsLoading] = useState(true);
  const listDataSource = useRef(null);

  const initialiseDataSource = useCallback(userNameArray => {
    if (listDataSource.current === null) {
      listDataSource.current = new ListTweetDataSource(userNameArray);
    }
  }, []);

  const fetchData = useCallback(() => {
    _listService.getListDetails(listId).then(listData => {
      const userNameArray = listData.userNames;
      initialiseDataSource(userNameArray);
      setIsLoading(false);
    });
  }, [_listService, initialiseDataSource, listId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={localStyle.container}>
      <Header enableBackButton={true} text={listName} />
      {isLoading ? (
        <ActivityIndicator animating={isLoading} />
      ) : (
        <TimelineList timelineListDataSource={listDataSource.current} />
      )}
    </View>
  );
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
};
export default React.memo(ListTweetsScreen);

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Header from '../../components/common/Header';
import TimelineList from '../../components/TimelineList';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {listService} from '../../services/ListService';
import colors from '../../constants/colors';
import ListTweetDataSource from './ListTweetDataSource';
import fonts from '../../constants/fonts';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {useNavigation} from '@react-navigation/native';
import ScreenName from '../../constants/ScreenName';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';

function ListTweetsScreen(props) {
  const localStyle = useStyleProcessor(styles, 'ListTweetsScreen');
  const {listId, listName, listUserNames} = props?.route?.params;
  const _listService = listService();
  const [isLoading, setIsLoading] = useState(true);
  const listDataSource = useRef(null);
  const currentUserNameArray = useRef(null);
  const newUserNameArray = useRef(null);

  const navigation = useNavigation();

  const initialiseDataSource = useCallback(userNameArray => {
    if (
      listDataSource.current === null ||
      currentUserNameArray.current !== newUserNameArray.current
    ) {
      listDataSource.current = new ListTweetDataSource(userNameArray);
      currentUserNameArray.current = userNameArray;
    }
  }, []);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    _listService.getListDetails(listId).then(listData => {
      const userNameArray = listData.userNames;
      newUserNameArray.current = userNameArray;
      initialiseDataSource(userNameArray);
      setIsLoading(false);
    });
  }, [_listService, initialiseDataSource, listId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDonePress = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const ListEmptyComponent = useMemo(() => {
    return (
      <EmptyScreenComponent
        descriptionText={'It’s pretty empty in here 🥲'}
        buttonText={'Add Users to List'}
        onButtonPress={() => {
          //TODO: Add to navigation to add user screen
        }}
      />
    );
  }, []);

  return (
    <View style={localStyle.container}>
      <Header
        enableBackButton={true}
        text={listName}
        textStyle={localStyle.headerText}
        enableRightButton={true}
        rightButtonText={listUserNames?.length > 0 ? 'Edit' : null}
        rightButtonTextStyle={localStyle.headerRightButtonText}
        onRightButtonClick={() => {
          navigation.navigate(ScreenName.EditListUsersScreen, {
            listId,
            listUserNames,
            onDonePress,
          });
        }}
      />
      {isLoading ? (
        <ActivityIndicator animating={isLoading} />
      ) : currentUserNameArray.current.length !== 0 ? (
        <TimelineList
          timelineListDataSource={listDataSource.current}
          listEmptyComponent={ListEmptyComponent}
        />
      ) : (
        ListEmptyComponent
      )}
    </View>
  );
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
  },
  headerRightButtonText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    color: colors.GoldenTainoi,
  },
};
export default React.memo(ListTweetsScreen);

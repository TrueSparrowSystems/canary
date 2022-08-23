import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Share, View} from 'react-native';
import Header from '../../components/common/Header';
import TimelineList from '../../components/TimelineList';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {listService} from '../../services/ListService';
import colors, {getColorWithOpacity} from '../../constants/colors';
import ListTweetDataSource from './ListTweetDataSource';
import fonts from '../../constants/fonts';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {useNavigation} from '@react-navigation/native';
import ScreenName from '../../constants/ScreenName';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {EditIcon, ShareAppIcon} from '../../assets/common';

function ListTweetsScreen(props) {
  const localStyle = useStyleProcessor(styles, 'ListTweetsScreen');
  const {listId, listName, listUserNames} = props?.route?.params;
  const _listService = listService();
  const [isLoading, setIsLoading] = useState(true);
  const listDataSource = useRef(null);
  const currentUserNameArray = useRef([]);
  const newUserNameArray = useRef([]);

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
        descriptionTextStyle={localStyle.descriptionTextStyle}
        onButtonPress={() => {
          LocalEvent.emit(EventTypes.ShowSearchUserModal, {
            listId: listId,
            onUserAddComplete: fetchData,
          });
        }}
        buttonStyle={localStyle.bookmarkButtonStyle}
      />
    );
  }, [
    fetchData,
    listId,
    localStyle.bookmarkButtonStyle,
    localStyle.descriptionTextStyle,
  ]);

  const onShareListPress = useCallback(() => {
    _listService
      .exportList([listId])
      .then(res => {
        Share.share({message: res});
      })
      .catch(() => {});
  }, [_listService, listId]);

  return (
    <View style={localStyle.container}>
      <Header
        style={localStyle.header}
        enableBackButton={true}
        text={listName}
        textStyle={localStyle.headerText}
        enableRightButton={true}
        rightButtonImage={ShareAppIcon}
        rightButtonImageStyle={localStyle.shareIconStyle}
        onRightButtonClick={onShareListPress}
        enableSecondaryRightButton={true}
        secondaryRightButtonImage={
          currentUserNameArray.current.length !== 0 ? EditIcon : null
        }
        secondaryRightButtonImageStyle={localStyle.editIconStyle}
        onSecondaryRightButtonClick={() => {
          navigation.navigate(ScreenName.EditListUsersScreen, {
            listId,
            listUserNames,
            onDonePress,
          });
        }}
      />
      {isLoading ? (
        <ActivityIndicator animating={isLoading} color={colors.GoldenTainoi} />
      ) : null}
      {currentUserNameArray.current.length !== 0 ? (
        <TimelineList
          timelineListDataSource={listDataSource.current}
          listEmptyComponent={ListEmptyComponent}
          onRefresh={fetchData}
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
  descriptionTextStyle: {
    fontFamily: fonts.SoraRegular,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(21),
    color: getColorWithOpacity(colors.Black, 0.7),
  },
  header: {
    marginHorizontal: layoutPtToPx(10),
    height: layoutPtToPx(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
  },
  headerRightButtonText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    color: colors.GoldenTainoi,
  },
  editIconStyle: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
    tintColor: colors.GoldenTainoi,
  },
  shareIconStyle: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
    tintColor: colors.GoldenTainoi,
    marginHorizontal: layoutPtToPx(10),
  },
  bookmarkButtonStyle: {
    marginTop: layoutPtToPx(40),
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
};
export default React.memo(ListTweetsScreen);

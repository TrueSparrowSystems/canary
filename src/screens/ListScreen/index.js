import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {AddIcon, BottomBarListIcon} from '../../assets/common';
import ListCard from '../../components/ListCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {listService} from '../../services/ListService';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import Header from '../../components/common/Header';
import fonts from '../../constants/fonts';
import {isEmpty} from 'lodash-es';
import useTabListener from '../../hooks/useTabListener';

function ListScreen(props) {
  const localStyle = useStyleProcessor(styles, 'ListScreen');
  const [isLoading, setIsLoading] = useState(true);
  const [swipeable, setSwipeable] = useState(false);
  const listDataRef = useRef({});
  const screenName = props?.route?.name;
  const scrollRef = useRef(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, []);
  useTabListener(screenName, scrollToTop);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const _listService = listService();
    _listService.getAllLists().then(list => {
      listDataRef.current = list;
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadList = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    LocalEvent.on(EventTypes.UpdateList, fetchData);
    return () => {
      LocalEvent.off(EventTypes.UpdateList, fetchData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onListAddSuccess = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const onAddListPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddListModal, {
      onListAddSuccess,
    });
  }, [onListAddSuccess]);

  const onCardLongPress = useCallback(() => {
    setSwipeable(true);
  }, []);

  const onDonePress = useCallback(() => {
    setSwipeable(false);
  }, []);

  return (
    <SafeAreaView style={localStyle.container}>
      {!isEmpty(listDataRef.current) ? (
        <Header
          text="Lists"
          rightButtonImage={swipeable ? null : AddIcon}
          enableRightButton={true}
          rightButtonText={swipeable ? 'Done' : 'New'}
          textStyle={localStyle.headerText}
          rightButtonImageStyle={localStyle.headerRightButtonImage}
          rightButtonTextStyle={localStyle.headerRightButtonText}
          onRightButtonClick={swipeable ? onDonePress : onAddListPress}
        />
      ) : null}
      {isLoading ? (
        <View style={localStyle.loaderStyle}>
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : isEmpty(listDataRef.current) ? (
        <EmptyScreenComponent
          emptyImage={BottomBarListIcon}
          buttonText={'Create a new List'}
          onButtonPress={onAddListPress}
          descriptionText={
            'Stay up-to-date on the favorite topics by tweeters you love'
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyle.scrollViewContainer}
          style={localStyle.scrollViewStyle}
          ref={scrollRef}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={reloadList} />
          }>
          {Object.keys(listDataRef.current).map(key => {
            const list = listDataRef.current[key];
            return (
              <ListCard
                key={list.id}
                data={list}
                onListRemoved={reloadList}
                onCardLongPress={onCardLongPress}
                enableSwipe={swipeable}
              />
            );
          })}
          <View />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 0.8,
    borderColor: colors.SherpaBlue,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
  },
  headerRightButtonImage: {
    tintColor: colors.GoldenTainoi,
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
    marginRight: layoutPtToPx(6),
  },
  headerRightButtonText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    color: colors.GoldenTainoi,
  },
  scrollViewStyle: {},
  add: {
    paddingVertical: layoutPtToPx(10),
    paddingHorizontal: layoutPtToPx(20),
    position: 'absolute',
    right: layoutPtToPx(20),
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    paddingBottom: layoutPtToPx(20),
  },
};

export default React.memo(ListScreen);

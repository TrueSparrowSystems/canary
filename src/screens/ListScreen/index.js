import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  View,
} from 'react-native';
import {
  AddIcon,
  DeleteIcon,
  ListGolden,
  ListIconBig,
  ShareAppIcon,
} from '../../assets/common';
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
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import * as Animatable from 'react-native-animatable';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import Banner from '../../components/common/Banner';
import {showPromotion} from '../../components/utils/ViewData';
import Toast from 'react-native-toast-message';
import {ToastType} from '../../constants/ToastConstants';
import {Constants} from '../../constants/Constants';

function ListScreen(props) {
  const localStyle = useStyleProcessor(styles, 'ListScreen');
  const [isLoading, setIsLoading] = useState(true);
  const [swipeable, setSwipeable] = useState(false);
  const listDataRef = useRef({});
  const [showPromotionBanner, setShowPromotionBanner] = useState(false);
  const crossButtonRef = useRef(null);
  const screenName = props?.route?.name;
  const scrollRef = useRef(null);
  const selectedListIds = useRef([]);
  const _listService = listService();

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, []);
  useTabListener(screenName, scrollToTop);

  const fetchData = useCallback(() => {
    setSwipeable(false);
    setIsLoading(true);
    _listService.getAllLists().then(list => {
      listDataRef.current = list;
      const shouldShowPromotion = showPromotion(CacheKey.ShowPromotionOnLists);
      if (!shouldShowPromotion && !isEmpty(listDataRef.current)) {
        const oldCacheVal = Cache.getValue(CacheKey.ShowPromotionOnLists);
        AsyncStorage.set(StoreKeys.ShowPromotionOnLists, oldCacheVal);
      }
      setShowPromotionBanner(shouldShowPromotion);
      setIsLoading(false);
    });
  }, [_listService]);

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
    selectedListIds.current = [];
    setSwipeable(true);
  }, []);

  const onDonePress = useCallback(() => {
    selectedListIds.current = [];
    setSwipeable(false);
  }, []);

  const onSharePress = useCallback(() => {
    if (selectedListIds.current.length > 0) {
      _listService.exportList(selectedListIds.current).then(url => {
        Share.share({message: `Checkout these lists from Canary ${url}`});
      });
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: 'Select at least one list to share',
      });
    }
  }, [_listService]);

  const onRemoveListsPress = useCallback(() => {
    if (selectedListIds.current.length > 0) {
      LocalEvent.emit(EventTypes.ShowDeleteConfirmationModal, {
        id: selectedListIds.current,
        text:
          selectedListIds.current.length > 1
            ? `Are you sure you want to remove these ${selectedListIds.current.length} selected lists?`
            : 'Are you sure you want to remove this selected list?',
        onCollectionRemoved: reloadList,
        type: Constants.ConfirmDeleteModalType.List,
      });
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: 'Select at least one list to delete',
      });
    }
  }, [reloadList]);

  const onRemovePromotionPress = useCallback(() => {
    crossButtonRef.current?.animate('fadeOutLeftBig').then(() => {
      setShowPromotionBanner(false);
      const oldCacheVal = Cache.getValue(CacheKey.ShowPromotionOnLists);
      AsyncStorage.set(StoreKeys.ShowPromotionOnLists, oldCacheVal);
      Cache.setValue(CacheKey.ShowPromotionOnLists, false);
    });
  }, []);

  return (
    <SafeAreaView style={localStyle.container}>
      {!isEmpty(listDataRef.current) ? (
        <Header
          text="Lists"
          rightButtonImage={swipeable ? ShareAppIcon : AddIcon}
          enableRightButton={true}
          rightButtonText={swipeable ? null : 'New'}
          textStyle={localStyle.headerText}
          rightButtonImageStyle={
            swipeable
              ? localStyle.shareButtonImageStyle
              : localStyle.headerRightButtonImage
          }
          rightButtonTextStyle={localStyle.headerRightButtonText}
          onRightButtonClick={swipeable ? onSharePress : onAddListPress}
          enableLeftButton={swipeable}
          leftButtonText={'Done'}
          leftButtonTextStyle={localStyle.headerRightButtonText}
          onLeftButtonClick={onDonePress}
          enableSecondaryRightButton={swipeable}
          secondaryRightButtonImage={DeleteIcon}
          secondaryRightButtonImageStyle={localStyle.shareButtonImageStyle}
          onSecondaryRightButtonClick={onRemoveListsPress}
        />
      ) : null}
      {showPromotionBanner && !isEmpty(listDataRef.current) ? (
        <Animatable.View ref={crossButtonRef}>
          <Banner
            headerImage={ListGolden}
            headerImageStyle={localStyle.headerImageStyle}
            headerText={'How is our Lists different from Twitter’s?'}
            descriptionText={
              'This is a version of Lists which doesn’t track any of your data, and keeps your information to yourself'
            }
            onRemovePromotionPress={onRemovePromotionPress}
            crossButtonRef={crossButtonRef}
          />
        </Animatable.View>
      ) : null}
      {isLoading ? (
        <View style={localStyle.loaderStyle}>
          <ActivityIndicator
            animating={isLoading}
            color={colors.GoldenTainoi}
          />
        </View>
      ) : isEmpty(listDataRef.current) ? (
        <EmptyScreenComponent
          emptyImage={ListIconBig}
          buttonImage={AddIcon}
          buttonText={'Create a new List'}
          onButtonPress={onAddListPress}
          descriptionText={
            'Stay up-to-date on the favorite topics by users you love, without being tracked 😉'
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyle.scrollViewContainer}
          style={localStyle.scrollViewStyle}
          ref={scrollRef}
          refreshControl={
            swipeable ? null : (
              <RefreshControl refreshing={isLoading} onRefresh={reloadList} />
            )
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
                selectedListIds={selectedListIds.current}
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
  headerImageStyle: {
    height: layoutPtToPx(18),
    width: layoutPtToPx(18),
    marginRight: layoutPtToPx(8),
  },
  shareButtonImageStyle: {
    tintColor: colors.GoldenTainoi,
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
    marginLeft: layoutPtToPx(10),
    tablet: {
      height: layoutPtToPx(25),
      width: layoutPtToPx(25),
    },
  },
};

export default React.memo(ListScreen);

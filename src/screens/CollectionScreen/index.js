import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, ActivityIndicator, FlatList, Share} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionCard from '../../components/CollectionCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {
  AddIcon,
  ArchiveIconBig,
  bookmarkedIcon,
  DeleteIcon,
  ShareAppIcon,
} from '../../assets/common';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import {isEmpty} from 'lodash';
import Header from '../../components/common/Header';
import fonts from '../../constants/fonts';
import useTabListener from '../../hooks/useTabListener';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import * as Animatable from 'react-native-animatable';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';
import Banner from '../../components/common/Banner';
import {showPromotion} from '../../components/utils/ViewData';
import {ToastType} from '../../constants/ToastConstants';
import Toast from 'react-native-toast-message';
import {isTablet} from 'react-native-device-info';
import {useOrientationState} from '../../hooks/useOrientation';
import {Constants} from '../../constants/Constants';
import {RefreshControl} from '@plgworks/applogger';

function CollectionScreen(props) {
  const localStyle = useStyleProcessor(styles, 'CollectionScreen');
  const [isLoading, setIsLoading] = useState(true);
  const collectionDataRef = useRef({});
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const screenName = props?.route?.name;
  const scrollRef = useRef(null);
  const [showPromotionBanner, setShowPromotionBanner] = useState(false);
  const crossButtonRef = useRef(false);
  const selectedCollectionIds = useRef([]);
  const _collectionService = collectionService();
  const {isPortrait} = useOrientationState();

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }, []);
  useTabListener(screenName, scrollToTop);

  const numOfColumns = useMemo(() => {
    return isTablet() ? (isPortrait ? 3 : 4) : 2;
  }, [isPortrait]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    _collectionService.getAllCollections().then(jsonObj => {
      let dataArray = [];
      Object.keys(jsonObj).map(key => {
        const collectionData = jsonObj[key];
        dataArray.push(collectionData);
      });
      for (let i = 0; i < dataArray.length % numOfColumns; i++) {
        dataArray.push({});
      }
      collectionDataRef.current = dataArray;
      const shouldShowPromotion = showPromotion(
        CacheKey.ShowPromotionOnArchives,
      );
      if (!shouldShowPromotion && !isEmpty(collectionDataRef.current)) {
        const oldCacheVal = Cache.getValue(CacheKey.ShowPromotionOnArchives);
        AsyncStorage.set(StoreKeys.ShowPromotionOnArchives, oldCacheVal);
      }
      setShowPromotionBanner(shouldShowPromotion);
      setIsLoading(false);
    });
  }, [_collectionService, numOfColumns]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPortrait]);

  const reloadList = useCallback(() => {
    selectedCollectionIds.current = [];
    setIsDeleteEnabled(false);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    LocalEvent.on(EventTypes.UpdateCollection, reloadList);
    return () => {
      LocalEvent.off(EventTypes.UpdateCollection, reloadList);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCollectionAddSuccess = useCallback(() => {
    setIsDeleteEnabled(false);
    fetchData();
  }, [fetchData]);

  const onAddCollectionPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddCollectionModal, {
      onCollectionAddSuccess,
    });
  }, [onCollectionAddSuccess]);

  const enableCollectionDeleteOption = useCallback(() => {
    selectedCollectionIds.current = [];
    setIsDeleteEnabled(true);
  }, []);

  const onDonePress = useCallback(() => {
    selectedCollectionIds.current = [];
    setIsDeleteEnabled(false);
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <CollectionCard
          key={item.id}
          data={item}
          animationDelay={index * 20}
          onCollectionRemoved={reloadList}
          onLongPress={enableCollectionDeleteOption}
          enableDelete={isDeleteEnabled}
          disabled={isEmpty(item) ? true : false}
          selectedCollectionIds={selectedCollectionIds.current}
        />
      );
    },
    [enableCollectionDeleteOption, isDeleteEnabled, reloadList],
  );

  const onRemovePromotionPress = useCallback(() => {
    crossButtonRef.current?.animate('fadeOutLeftBig').then(() => {
      setShowPromotionBanner(false);
      const oldCacheVal = Cache.getValue(CacheKey.ShowPromotionOnArchives);
      AsyncStorage.set(StoreKeys.ShowPromotionOnArchives, oldCacheVal);
      Cache.setValue(CacheKey.ShowPromotionOnArchives, false);
    });
  }, []);

  const onSharePress = useCallback(() => {
    if (selectedCollectionIds.current.length > 0) {
      _collectionService
        .exportCollection(selectedCollectionIds.current)
        .then(url => {
          Share.share({message: `Checkout these archives from Canary ${url}`});
        });
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: 'Select at least one archive to share',
      });
    }
  }, [_collectionService]);

  const onRemoveCollectionsPress = useCallback(() => {
    if (selectedCollectionIds.current.length > 0) {
      LocalEvent.emit(EventTypes.ShowDeleteConfirmationModal, {
        id: selectedCollectionIds.current,
        text:
          selectedCollectionIds.current.length > 1
            ? `Are you sure you want to remove these ${selectedCollectionIds.current.length} selected archives?`
            : 'Are you sure you want to remove this selected archive?',
        onCollectionRemoved: reloadList,
        type: Constants.ConfirmDeleteModalType.Archive,
      });
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: 'Select at least one archive to delete',
      });
    }
  }, [reloadList]);

  return (
    <SafeAreaView style={localStyle.container}>
      {isEmpty(collectionDataRef.current) ? null : (
        <Header
          testId={'collection_screen'}
          text={'Archives'}
          textStyle={localStyle.headerTextStyle}
          enableRightButton={true}
          rightButtonImage={!isDeleteEnabled ? AddIcon : ShareAppIcon}
          onRightButtonClick={
            !isDeleteEnabled ? onAddCollectionPress : onSharePress
          }
          rightButtonText={!isDeleteEnabled ? 'New' : null}
          rightButtonTextStyle={localStyle.newButtonTextStyle}
          rightButtonImageStyle={
            !isDeleteEnabled
              ? localStyle.newButtonImageStyle
              : localStyle.shareButtonImageStyle
          }
          enableLeftButton={isDeleteEnabled}
          leftButtonText={'Done'}
          leftButtonTextStyle={localStyle.newButtonTextStyle}
          onLeftButtonClick={onDonePress}
          enableSecondaryRightButton={isDeleteEnabled}
          secondaryRightButtonImage={DeleteIcon}
          secondaryRightButtonImageStyle={localStyle.shareButtonImageStyle}
          onSecondaryRightButtonClick={onRemoveCollectionsPress}
        />
      )}
      {showPromotionBanner && !isEmpty(collectionDataRef.current) ? (
        <Animatable.View ref={crossButtonRef}>
          <Banner
            headerImage={bookmarkedIcon}
            headerImageStyle={localStyle.headerImageStyle}
            headerText={'Archives lets you save your tweets privately'}
            descriptionText={
              'Make the archives your own by saving unlimited number of tweets in multiple groups — we won’t know anything'
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
      ) : isEmpty(collectionDataRef.current) ? (
        <EmptyScreenComponent
          buttonImage={AddIcon}
          emptyImage={ArchiveIconBig}
          buttonText={'Add a new Archive'}
          onButtonPress={onAddCollectionPress}
          descriptionText={
            'Save your favorite tweets in the archive and access it later anytime - with full privacy 💯'
          }
        />
      ) : (
        <View style={localStyle.flatListStyle}>
          <FlatList
            key={`flatList_${numOfColumns}`}
            showsVerticalScrollIndicator={false}
            data={collectionDataRef.current}
            renderItem={renderItem}
            numColumns={numOfColumns}
            ref={scrollRef}
            refreshControl={
              isDeleteEnabled ? null : (
                <RefreshControl
                  testID="archive_screen_list"
                  refreshing={isLoading}
                  onRefresh={fetchData}
                />
              )
            }
            contentContainerStyle={localStyle.contentContainerStyle}
            keyExtractor={item => {
              return item.id;
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    backgroundColor: colors.White,
    flex: 1,
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
    alignSelf: 'center',
  },
  newButtonImageStyle: {
    tintColor: colors.GoldenTainoi,
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
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
  newButtonTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    color: colors.GoldenTainoi,
    paddingLeft: layoutPtToPx(2),
  },
  flatListStyle: {
    paddingHorizontal: layoutPtToPx(10),
    flex: 1,
  },
  contentContainerStyle: {
    marginTop: layoutPtToPx(10),
    paddingTop: layoutPtToPx(10),
    overflow: 'visible',
  },
  headerImageStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(15),
    marginRight: layoutPtToPx(8),
  },
};

export default React.memo(CollectionScreen);

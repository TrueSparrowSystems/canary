import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionCard from '../../components/CollectionCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {AddIcon, ArchiveIconBig, bookmarkedIcon} from '../../assets/common';
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

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }, []);
  useTabListener(screenName, scrollToTop);

  const fetchData = useCallback(() => {
    setIsDeleteEnabled(false);
    setIsLoading(true);
    _collectionService.getAllCollections().then(jsonObj => {
      let dataArray = [];
      Object.keys(jsonObj).map(key => {
        const collectionData = jsonObj[key];
        dataArray.push(collectionData);
      });
      if (dataArray.length % 2) {
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
  }, [_collectionService]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadList = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    LocalEvent.on(EventTypes.UpdateCollection, fetchData);
    return () => {
      LocalEvent.off(EventTypes.UpdateCollection, fetchData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCollectionAddSuccess = useCallback(() => {
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

  return (
    <SafeAreaView style={localStyle.container}>
      {isEmpty(collectionDataRef.current) ? null : (
        <Header
          text={'Archives'}
          textStyle={localStyle.headerTextStyle}
          enableRightButton={true}
          rightButtonImage={!isDeleteEnabled ? AddIcon : null}
          onRightButtonClick={
            !isDeleteEnabled ? onAddCollectionPress : onDonePress
          }
          rightButtonText={!isDeleteEnabled ? 'New' : 'Done'}
          rightButtonTextStyle={localStyle.newButtonTextStyle}
          rightButtonImageStyle={localStyle.newButtonImageStyle}
          enableLeftButton={isDeleteEnabled}
          leftButtonText={'Share'}
          leftButtonTextStyle={localStyle.newButtonTextStyle}
          onLeftButtonClick={onSharePress}
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
            showsVerticalScrollIndicator={false}
            data={collectionDataRef.current}
            renderItem={renderItem}
            numColumns={2}
            ref={scrollRef}
            refreshControl={
              isDeleteEnabled ? null : (
                <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
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

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionCard from '../../components/CollectionCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {AddIcon, ArchiveIconBig, CrossIcon} from '../../assets/common';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import {isEmpty} from 'lodash';
import Header from '../../components/common/Header';
import fonts from '../../constants/fonts';
import useTabListener from '../../hooks/useTabListener';
import RoundedButton from '../../components/common/RoundedButton';
import AsyncStorage from '../../services/AsyncStorage';
import {StoreKeys} from '../../services/AsyncStorage/StoreConstants';
import * as Animatable from 'react-native-animatable';
import Cache from '../../services/Cache';
import {CacheKey} from '../../services/Cache/CacheStoreConstants';

function CollectionScreen(props) {
  const localStyle = useStyleProcessor(styles, 'CollectionScreen');
  const [isLoading, setIsLoading] = useState(true);
  const collectionDataRef = useRef({});
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const screenName = props?.route?.name;
  const scrollRef = useRef(null);
  const [showPromotionBanner, setShowPromotionBanner] = useState(false);
  const crossButtonRef = useRef(false);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }, []);
  useTabListener(screenName, scrollToTop);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const _collectionService = collectionService();
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
      const showPromotion = Cache.getValue(CacheKey.ShowPromotionOnArchives);
      if (showPromotion !== null) {
        setShowPromotionBanner(JSON.parse(showPromotion));
      } else {
        setShowPromotionBanner(true);
      }
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
    setIsDeleteEnabled(true);
  }, []);

  const onDonePress = useCallback(() => {
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
        />
      );
    },
    [enableCollectionDeleteOption, isDeleteEnabled, reloadList],
  );

  const onRemovePromotionPress = useCallback(() => {
    crossButtonRef.current?.animate('fadeOutLeftBig').then(() => {
      setShowPromotionBanner(false);
      Cache.setValue(CacheKey.ShowPromotionOnArchives, false);
      AsyncStorage.set(StoreKeys.ShowPromotionOnArchives, false).then(() => {});
    });
  }, []);

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
        />
      )}
      {showPromotionBanner && !isEmpty(collectionDataRef.current) ? (
        <Animatable.View style={localStyle.banner} ref={crossButtonRef}>
          <Text style={localStyle.flexShrink}>
            Show some text for archives some text for archives some text for
            archives
          </Text>
          <RoundedButton
            style={localStyle.crossButton}
            leftImage={CrossIcon}
            leftImageStyle={localStyle.crossIconStyle}
            onPress={onRemovePromotionPress}
            underlayColor={colors.GoldenTainoi80}
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
              <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
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
    paddingTop: layoutPtToPx(5),
    overflow: 'visible',
  },
  banner: {
    height: 60,
    width: '100%',
    backgroundColor: colors.GoldenTainoi,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layoutPtToPx(20),
  },
  crossButton: {
    flexGrow: 1,
    backgroundColor: colors.GoldenTainoi,
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
    paddingHorizontal: layoutPtToPx(10),
  },
  crossIconStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
  },
  flexShrink: {
    flexShrink: 1,
  },
};

export default React.memo(CollectionScreen);

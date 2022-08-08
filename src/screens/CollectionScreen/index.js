import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionCard from '../../components/CollectionCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {AddIcon, CollectionsIcon} from '../../assets/common';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import {isEmpty} from 'lodash';
import Header from '../../components/common/Header';
import fonts from '../../constants/fonts';

function CollectionScreen() {
  const localStyle = useStyleProcessor(styles, 'CollectionScreen');
  const [isLoading, setIsLoading] = useState(true);
  const collectionDataRef = useRef({});
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const _collectionService = collectionService();
    _collectionService.getAllCollections().then(list => {
      const jsonObj = JSON.parse(list) || {};
      let dataArray = [];
      Object.keys(jsonObj).map(key => {
        const collectionData = jsonObj[key];
        dataArray.push(collectionData);
      });
      if (dataArray.length % 2) {
        dataArray.push({});
      }
      collectionDataRef.current = dataArray;
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
        />
      );
    },
    [enableCollectionDeleteOption, isDeleteEnabled, reloadList],
  );

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
      {isLoading ? (
        <View style={localStyle.loaderStyle}>
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : isEmpty(collectionDataRef.current) ? (
        <EmptyScreenComponent
          emptyImage={CollectionsIcon}
          buttonText={'Add a new Archive'}
          onButtonPress={onAddCollectionPress}
          descriptionText={
            'Save your favorite tweets in the archive and access it later anytime'
          }
        />
      ) : (
        <View style={localStyle.flatListStyle}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={collectionDataRef.current}
            renderItem={renderItem}
            numColumns={2}
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
  },
};

export default React.memo(CollectionScreen);

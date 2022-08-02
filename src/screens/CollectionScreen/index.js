import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionCard from '../../components/CollectionCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../constants/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {CollectionsIcon} from '../../assets/common';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import {isEmpty} from 'lodash';

function CollectionScreen() {
  const localStyle = useStyleProcessor(styles, 'CollectionScreen');
  const [isLoading, setIsLoading] = useState(true);
  const collectionDataRef = useRef({});

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const _collectionService = collectionService();
    _collectionService.getAllCollections().then(list => {
      collectionDataRef.current = JSON.parse(list);
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

  return (
    <SafeAreaView style={localStyle.container}>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyle.scrollViewContainer}
          style={localStyle.scrollViewStyle}>
          {Object.keys(collectionDataRef.current).map(key => {
            const collection = collectionDataRef.current[key];
            const singleCollectionData = {
              collectionId: collection?.id,
              collectionName: collection?.name,
              // TODO: change image url
              imageUrl: 'https://picsum.photos/200/300',
            };
            return (
              <CollectionCard
                key={singleCollectionData.collectionId}
                data={singleCollectionData}
                onCollectionRemoved={reloadList}
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
    backgroundColor: colors.White,
    flex: 1,
  },
  headerView: {
    backgroundColor: colors.White,
    flexDirection: 'row',
    borderBottomWidth: 0.8,
    borderColor: colors.SherpaBlue,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: colors.DodgerBlue,
    fontSize: fontPtToPx(35),
  },
  scrollViewStyle: {
    paddingTop: layoutPtToPx(20),
  },
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

export default React.memo(CollectionScreen);

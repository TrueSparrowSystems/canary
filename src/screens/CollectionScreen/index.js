import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionCard from '../../components/CollectionCard';
import Header from '../../components/common/Header';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../utils/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {AddIcon} from '../../assets/common';
import {fontPtToPx} from '../../utils/responsiveUI';

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
      <Header
        enableBackButton={false}
        enableRightButton={true}
        onRightButtonClick={onAddCollectionPress}
        rightButtonImage={AddIcon}
        text="Collections"
        textStyle={localStyle.headerText}
      />

      {isLoading ? (
        <View style={localStyle.loaderStyle}>
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyle.scrollViewContainer}
          style={localStyle.scrollViewStyle}>
          {collectionDataRef.current == null
            ? null
            : Object.keys(collectionDataRef.current).map(key => {
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
    paddingTop: 20,
  },
  add: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    right: 20,
  },
  loaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
};

export default React.memo(CollectionScreen);

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionCard from '../../components/CollectionCard';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {collectionService} from '../../services/CollectionService';
import colors from '../../utils/colors';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function CollectionScreen() {
  const localStyle = useStyleProcessor(styles, 'CollectionScreen');
  const [isLoading, setIsLoading] = useState(true);
  const collectionDataRef = useRef({});

  useEffect(() => {
    const _collectionService = collectionService();
    _collectionService.getAllCollections().then(list => {
      collectionDataRef.current = JSON.parse(list);
      setIsLoading(false);
    });
  }, []);

  const onAddCollectionPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddCollectionModal);
  }, []);

  return (
    <SafeAreaView style={localStyle.container}>
      <View style={localStyle.headerView}>
        <Text style={localStyle.headerText}>Collections</Text>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'transparent'}
          style={localStyle.add}
          onPress={onAddCollectionPress}>
          <Text>Add</Text>
        </TouchableHighlight>
      </View>
      {isLoading ? null : (
        <ScrollView style={localStyle.scrollViewStyle}>
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
  container: {flex: 1},
  headerView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.SherpaBlue,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    paddingVertical: 10,
    color: colors.SherpaBlue,
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
};

export default React.memo(CollectionScreen);

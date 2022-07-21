import React, {useMemo} from 'react';
import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import CustomModal from '../common/CustomModal';
import colors from '../../utils/colors';
import useAddToCollectionModalData from './useAddToCollectionModalData';
import MiniCollectionCard from '../MiniCollectionCard';
import {ScrollView} from 'react-native-gesture-handler';
import {AddIcon} from '../../assets/common';

function AddToCollectionModal() {
  const localStyle = useStyleProcessor(styles, 'AddToCollectionModal');

  const {
    bIsLoading,
    bIsVisible,
    fnOnBackdropPress,
    fnOnAddToCollectionSuccess,
    fnOnAddCollectionPress,
    oCollectionList,
    sTweetId,
  } = useAddToCollectionModalData();

  const getBackdrop = useMemo(() => {
    return <View style={localStyle.blur} />;
  }, [localStyle.blur]);

  return bIsVisible ? (
    <CustomModal
      visible={bIsVisible}
      onBackDropPress={fnOnBackdropPress}
      customBackdrop={getBackdrop}>
      <View style={localStyle.modalStyle}>
        <SafeAreaView style={localStyle.container}>
          <View style={localStyle.view}>
            <View style={localStyle.flexRow}>
              <View style={localStyle.titleContainer}>
                <Text style={localStyle.titleText}>Add To Collection</Text>
              </View>
              <TouchableOpacity onPress={fnOnAddCollectionPress}>
                <Image source={AddIcon} />
              </TouchableOpacity>
            </View>
            {bIsLoading ? (
              <Text>Loading</Text>
            ) : (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {oCollectionList == null
                  ? null
                  : Object.keys(oCollectionList).map(key => {
                      const collection = oCollectionList[key];
                      const collectionData = {
                        collectionId: collection?.id,
                        collectionName: collection?.name,
                        // TODO: change image url
                        imageUrl: 'https://picsum.photos/200/300',
                      };
                      return (
                        <MiniCollectionCard
                          key={collection.id}
                          data={collectionData}
                          tweetId={sTweetId}
                          onAddToCollectionSuccess={fnOnAddToCollectionSuccess}
                        />
                      );
                    })}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </View>
    </CustomModal>
  ) : null;
}

const styles = {
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: colors.White,
  },
  modalStyle: {
    width: '100%',
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: colors.SherpaBlue70,
  },
  flexRow: {
    flexDirection: 'row',
  },
  titleContainer: {flexGrow: 1, alignItems: 'center'},
  titleText: {
    fontSize: 20,
    color: colors.SherpaBlue,
    marginBottom: 10,
  },
  view: {
    width: '100%',
    height: 200,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default React.memo(AddToCollectionModal);

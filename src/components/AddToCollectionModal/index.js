import React, {useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import CustomModal from '../common/CustomModal';
import colors from '../../constants/colors';
import useAddToCollectionModalData from './useAddToCollectionModalData';
import MiniCollectionCard from '../MiniCollectionCard';
import {ScrollView} from 'react-native-gesture-handler';
import {AddIcon, CollectionsIcon} from '../../assets/common';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import fonts from '../../constants/fonts';
import EmptyScreenComponent from '../common/EmptyScreenComponent';

function AddToCollectionModal() {
  const localStyle = useStyleProcessor(styles, 'AddToCollectionModal');

  const {
    aTweetCollectionIds,
    bIsLoading,
    bIsVisible,
    fnOnBackdropPress,
    fnOnAddToCollectionSuccess,
    fnOnAddToCollectionFailure,
    fnOnAddCollectionPress,
    fnOnDonePress,
    fnOnRemoveFromCollectionSuccess,
    oCollectionList,
    sTweetId,
  } = useAddToCollectionModalData();

  const getBackdrop = useMemo(() => {
    return <View style={localStyle.blur} />;
  }, [localStyle.blur]);

  const addNewButtonStyleMemo = useMemo(() => {
    return [
      {opacity: oCollectionList !== null ? 1 : 0},
      localStyle.addNewButton,
    ];
  }, [localStyle.addNewButton, oCollectionList]);

  return bIsVisible ? (
    <CustomModal
      visible={bIsVisible}
      onBackDropPress={fnOnBackdropPress}
      customBackdrop={getBackdrop}>
      <View style={localStyle.modalStyle}>
        <SafeAreaView style={localStyle.container}>
          <View style={localStyle.view}>
            <View style={localStyle.headerStyle}>
              <TouchableOpacity
                style={localStyle.doneButtonContainer}
                onPress={fnOnDonePress}>
                <Text style={localStyle.headerTextStyle}>Done</Text>
              </TouchableOpacity>
              <View style={localStyle.titleContainer}>
                <Text style={localStyle.titleText}>Add Tweets to Archives</Text>
              </View>
              <TouchableOpacity
                onPress={fnOnAddCollectionPress}
                disabled={oCollectionList === null}
                style={addNewButtonStyleMemo}>
                <View style={localStyle.flexRow}>
                  <Image source={AddIcon} style={localStyle.addIconStyle} />
                  <Text style={localStyle.headerTextStyle}>New</Text>
                </View>
              </TouchableOpacity>
            </View>
            {bIsLoading ? (
              <ActivityIndicator animating={bIsLoading} />
            ) : oCollectionList === null ? (
              <View style={localStyle.emptyComponentContainer}>
                <EmptyScreenComponent
                  emptyImage={CollectionsIcon}
                  buttonText={'Add a new Archive'}
                  onButtonPress={fnOnAddCollectionPress}
                  descriptionText={
                    'Save your favorite tweets in the archive and access it later anytime - with full privacy 💯'
                  }
                />
              </View>
            ) : (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={localStyle.scrollView}
                contentContainerStyle={localStyle.scrollViewContentContainer}>
                {oCollectionList == null
                  ? null
                  : Object.keys(oCollectionList).map(key => {
                      const collection = oCollectionList[key];
                      return (
                        <MiniCollectionCard
                          key={collection.id}
                          data={collection}
                          tweetId={sTweetId}
                          isAdded={aTweetCollectionIds.includes(collection.id)}
                          onAddToCollectionSuccess={fnOnAddToCollectionSuccess}
                          onAddToCollectionFailure={fnOnAddToCollectionFailure}
                          onRemoveFromCollectionSuccess={
                            fnOnRemoveFromCollectionSuccess
                          }
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
  emptyComponentContainer: {
    paddingVertical: layoutPtToPx(30),
    height: '80%',
  },
  addIconStyle: {
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
    tintColor: colors.GoldenTainoi,
    marginRight: layoutPtToPx(4),
  },
  headerTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    color: colors.GoldenTainoi,
  },
  headerStyle: {
    paddingTop: layoutPtToPx(20),
    paddingBottom: layoutPtToPx(10),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  doneButtonContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: layoutPtToPx(20),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  titleContainer: {flexGrow: 1, alignItems: 'center'},
  titleText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.Black,
  },
  addNewButton: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: layoutPtToPx(20),
  },
  view: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    paddingHorizontal: layoutPtToPx(14),
    paddingVertical: layoutPtToPx(20),
  },
  scrollViewContentContainer: {paddingRight: layoutPtToPx(20)},
};

export default React.memo(AddToCollectionModal);

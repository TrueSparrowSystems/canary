import React, {useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import CustomModal from '../common/CustomModal';
import colors, {getColorWithOpacity} from '../../constants/colors';
import useAddToListModalData from './useAddToListModalData';
import {ScrollView} from 'react-native-gesture-handler';
import {AddIcon, BottomBarListIcon} from '../../assets/common';
import ListCard from '../ListCard';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import fonts from '../../constants/fonts';
import EmptyScreenComponent from '../common/EmptyScreenComponent';
import {isEmpty} from 'lodash';

function AddToListModal() {
  const localStyle = useStyleProcessor(styles, 'AddToListModal');

  const {
    bIsLoading,
    bIsVisible,
    fnOnBackdropPress,
    fnOnAddToListSuccess,
    fnOnAddListPress,
    fnOnDonePress,
    oList,
    sUserName,
  } = useAddToListModalData();

  const getBackdrop = useMemo(() => {
    return <View style={localStyle.blur} />;
  }, [localStyle.blur]);

  const scrollViewStyle = useMemo(() => {
    return {
      maxHeight: Dimensions.get('window').height / 1.33,
    };
  }, []);

  const addNewButtonStyleMemo = useMemo(() => {
    return [{opacity: !isEmpty(oList) ? 1 : 0}, localStyle.addNewButton];
  }, [localStyle.addNewButton, oList]);

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
                <Text style={localStyle.titleText}>Add user to List</Text>
              </View>
              <TouchableOpacity
                onPress={fnOnAddListPress}
                disabled={isEmpty(oList)}
                style={addNewButtonStyleMemo}>
                <View style={localStyle.flexRow}>
                  <Image source={AddIcon} style={localStyle.addIconStyle} />
                  <Text style={localStyle.headerTextStyle}>New</Text>
                </View>
              </TouchableOpacity>
            </View>
            {bIsLoading ? (
              <ActivityIndicator animating={bIsLoading} />
            ) : isEmpty(oList) ? (
              <View style={localStyle.emptyComponentContainer}>
                <EmptyScreenComponent
                  emptyImage={BottomBarListIcon}
                  buttonText={'Create a new List'}
                  onButtonPress={fnOnAddListPress}
                  descriptionText={
                    'Stay up-to-date on the favorite topics by users you love, without being tracked 😉'
                  }
                />
              </View>
            ) : (
              <ScrollView
                style={scrollViewStyle}
                contentContainerStyle={localStyle.scrollContentContainerStyle}>
                {Object.keys(oList).map(key => {
                  const list = oList[key];
                  return (
                    <ListCard
                      key={list.id}
                      data={list}
                      userName={sUserName}
                      onAddToListSuccess={fnOnAddToListSuccess}
                      isPressDisabled={true}
                      shouldShowAddButton={true}
                      disableSwipeInteraction={true}
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
  emptyComponentContainer: {
    paddingVertical: layoutPtToPx(30),
    height: '80%',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: getColorWithOpacity(colors.BlackPearl, 0.5),
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
  scrollContentContainerStyle: {
    paddingBottom: layoutPtToPx(20),
    maxWidth: '100%',
  },
};

export default React.memo(AddToListModal);

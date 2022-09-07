import React, {useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import CustomModal from '../common/CustomModal';
import colors, {getColorWithOpacity} from '../../constants/colors';
import useAddToListModalData from './useAddToListModalData';
import {ScrollView} from 'react-native-gesture-handler';
import {AddIcon, ListIconBig} from '../../assets/common';
import ListCard from '../ListCard';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import fonts from '../../constants/fonts';
import EmptyScreenComponent from '../common/EmptyScreenComponent';
import {isEmpty} from 'lodash';
import UserCard from '../common/UserCard';
import {TouchableOpacity} from '@plgworks/applogger';
import {useOrientationState} from '../../hooks/useOrientation';

function AddToListModal() {
  const localStyle = useStyleProcessor(styles, 'AddToListModal');

  const {
    bIsLoading,
    bIsVisible,
    fnOnBackdropPress,
    fnOnAddToListSuccess,
    fnOnRemoveFromListSuccess,
    fnOnAddListPress,
    fnOnDonePress,
    oList,
    oUserData,
    sUserName,
  } = useAddToListModalData();

  const getBackdrop = useMemo(() => {
    return <View style={localStyle.blur} />;
  }, [localStyle.blur]);

  const {isPortrait} = useOrientationState();

  const maxHeightStyle = useMemo(() => {
    const denominator = isPortrait ? 1.33 : 2;
    return {
      maxHeight: Dimensions.get('window').height / denominator,
    };
  }, [isPortrait]);

  const addNewButtonStyleMemo = useMemo(() => {
    return [{opacity: !isEmpty(oList) ? 1 : 0}, localStyle.addNewButton];
  }, [localStyle.addNewButton, oList]);

  return bIsVisible ? (
    <CustomModal
      testID="add_to_list"
      visible={bIsVisible}
      onHardwareBackButtonPress={fnOnBackdropPress}
      onBackDropPress={fnOnBackdropPress}
      customBackdrop={getBackdrop}>
      <View style={[localStyle.modalStyle, maxHeightStyle]}>
        <SafeAreaView style={localStyle.container}>
          <View style={localStyle.view}>
            <View style={localStyle.headerStyle}>
              <TouchableOpacity
                testID="add_to_list_modal_new"
                onPress={fnOnAddListPress}
                disabled={isEmpty(oList)}
                style={addNewButtonStyleMemo}>
                <View style={localStyle.flexRow}>
                  <Image source={AddIcon} style={localStyle.addIconStyle} />
                  <Text style={localStyle.headerTextStyle}>New</Text>
                </View>
              </TouchableOpacity>
              <View style={localStyle.titleContainer}>
                <Text style={localStyle.titleText}>Add user to Lists</Text>
              </View>
              <TouchableOpacity
                testID="add_to_list_modal_done"
                style={localStyle.doneButtonContainer}
                onPress={fnOnDonePress}>
                <Text style={localStyle.headerTextStyle}>Done</Text>
              </TouchableOpacity>
            </View>
            {bIsLoading ? (
              <ActivityIndicator
                animating={bIsLoading}
                color={colors.GoldenTainoi}
              />
            ) : isEmpty(oList) ? (
              <View style={localStyle.listContainer}>
                <UserCard userData={oUserData} />
                <ScrollView style={localStyle.emptyComponentContainer}>
                  <EmptyScreenComponent
                    buttonImage={AddIcon}
                    emptyImage={ListIconBig}
                    buttonText={'Create a new List'}
                    onButtonPress={fnOnAddListPress}
                    descriptionText={
                      'Stay up-to-date on the favorite topics by users you love, without being tracked 😉'
                    }
                  />
                </ScrollView>
              </View>
            ) : (
              <View style={localStyle.listContainer}>
                <UserCard userData={oUserData} />
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={maxHeightStyle}
                  contentContainerStyle={
                    localStyle.scrollContentContainerStyle
                  }>
                  {Object.keys(oList).map(key => {
                    const list = oList[key];
                    return (
                      <ListCard
                        key={list.id}
                        data={list}
                        userName={sUserName}
                        onAddToListSuccess={fnOnAddToListSuccess}
                        onRemoveFromListSuccess={fnOnRemoveFromListSuccess}
                        isPressDisabled={true}
                        shouldShowAddButton={true}
                        disableSwipeInteraction={true}
                      />
                    );
                  })}
                </ScrollView>
              </View>
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
  listContainer: {
    width: '100%',
  },
  emptyComponentContainer: {
    alignSelf: 'center',
    paddingBottom: layoutPtToPx(30),
    height: '60%',
    tablet: {
      width: '50%',
    },
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
    paddingTop: layoutPtToPx(10),
    paddingBottom: layoutPtToPx(20),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  doneButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: layoutPtToPx(20),
    paddingBottom: layoutPtToPx(2),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.Black,
  },
  addNewButton: {
    paddingTop: layoutPtToPx(2),
    paddingLeft: layoutPtToPx(20),
    flex: 1,
    alignItems: 'flex-start',
  },
  view: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: layoutPtToPx(20),
  },
  scrollContentContainerStyle: {
    paddingBottom: '40%',
    maxWidth: '100%',
  },
};

export default React.memo(AddToListModal);

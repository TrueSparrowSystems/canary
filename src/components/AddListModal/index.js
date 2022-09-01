import React, {useMemo} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import CustomModal from '../common/CustomModal';
import colors, {getColorWithOpacity} from '../../constants/colors';
import useAddListModalData from './useAddListModalData';
import {AddIcon} from '../../assets/common';
import RoundedButton from '../common/RoundedButton';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import fonts from '../../constants/fonts';
import {TextInput} from '@plgworks/applogger';

const TEXT_INPUT_LIMIT = 25;

function AddListModal() {
  const localStyle = useStyleProcessor(styles, 'AddListModal');

  const {
    sDefaultValue,
    bIsEditMode,
    bIsVisible,
    nCharacterCount,
    sErrorMessage,
    fnOnBackdropPress,
    fnOnListNameChange,
    fnOnCreateListPress,
    fnOnEditListPress,
  } = useAddListModalData();

  const getBackdrop = useMemo(() => {
    return <View style={localStyle.blur} />;
  }, [localStyle.blur]);

  const screenHeight = useMemo(() => {
    return Dimensions.get('window').height;
  }, []);

  return bIsVisible ? (
    <CustomModal
      testID="add_list"
      visible={bIsVisible}
      onHardwareBackButtonPress={fnOnBackdropPress}
      onBackDropPress={fnOnBackdropPress}
      customBackdrop={getBackdrop}>
      <View style={[localStyle.modalStyle, {top: screenHeight / 3}]}>
        <View style={localStyle.container}>
          <View style={localStyle.view}>
            <Text style={localStyle.enterNameStyle}>
              {bIsEditMode ? 'Update list' : 'New List'}
            </Text>
            <TextInput
              testID="add_list_modal"
              defaultValue={sDefaultValue}
              style={localStyle.inputStyle}
              autoFocus={true}
              onChangeText={fnOnListNameChange}
              placeholder={'Enter List Name'}
              placeholderTextColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
              onSubmitEditing={fnOnCreateListPress}
              maxLength={TEXT_INPUT_LIMIT}
            />
            <View style={localStyle.charCounterContainer}>
              <Text
                style={
                  localStyle.charCounterText
                }>{`${nCharacterCount}/${TEXT_INPUT_LIMIT}`}</Text>
            </View>
            <Text style={localStyle.errorText}>{sErrorMessage}</Text>
            {bIsEditMode ? (
              <RoundedButton
                testId={'add_list_modal_update'}
                style={localStyle.createButton}
                text={'Update'}
                textStyle={localStyle.createButtonText}
                disabled={nCharacterCount === 0}
                onPress={fnOnEditListPress}
                underlayColor={colors.GoldenTainoi80}
              />
            ) : (
              <RoundedButton
                testId={'add_list_modal_create'}
                style={localStyle.createButton}
                text={'Create'}
                textStyle={localStyle.createButtonText}
                leftImage={AddIcon}
                disabled={nCharacterCount === 0}
                leftImageStyle={localStyle.addIconStyle}
                onPress={fnOnCreateListPress}
                underlayColor={colors.GoldenTainoi80}
              />
            )}
          </View>
        </View>
      </View>
    </CustomModal>
  ) : null;
}

const styles = {
  container: {
    position: 'absolute',
    height: layoutPtToPx(200),
    width: '100%',
    borderRadius: layoutPtToPx(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.White,
  },
  modalStyle: {
    width: '90%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: getColorWithOpacity(colors.BlackPearl, 0.5),
  },
  enterNameStyle: {
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    fontFamily: fonts.SoraSemiBold,
    color: colors.BlackPearl,
  },
  inputStyle: {
    marginTop: layoutPtToPx(20),
    fontFamily: fonts.InterRegular,
    height: layoutPtToPx(48),
    borderWidth: 1,
    borderColor: getColorWithOpacity(colors.Black, 0.2),
    color: colors.BlackPearl,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    width: '100%',
    borderRadius: layoutPtToPx(8),
    paddingHorizontal: layoutPtToPx(10),
  },
  view: {
    width: '100%',
    height: layoutPtToPx(200),
    padding: layoutPtToPx(20),
    alignItems: 'center',
    justifyContent: 'center',
    tablet: {
      alignSelf: 'center',
      width: '60%',
      landscape: {
        width: '50%',
      },
    },
  },
  createTextStyle: {
    color: colors.White,
  },
  createButton: {
    marginTop: layoutPtToPx(20),
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  createButtonText: {
    marginHorizontal: layoutPtToPx(5),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
  },
  addIconStyle: {
    height: layoutPtToPx(18),
    width: layoutPtToPx(18),
  },
  charCounterContainer: {
    position: 'absolute',
    right: 25,
    bottom: '68%',
  },
  charCounterText: {
    color: getColorWithOpacity(colors.BlackPearl, 0.4),
    fontSize: fontPtToPx(10),
  },
  errorText: {
    fontFamily: fonts.InterRegular,
    color: colors.BitterSweet,
    fontSize: fontPtToPx(12),
  },
};

export default React.memo(AddListModal);

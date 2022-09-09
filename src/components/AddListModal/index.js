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
    sWarningText,
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

  const charCountTextStyle = useMemo(() => {
    if (nCharacterCount > TEXT_INPUT_LIMIT) {
      return [localStyle.charCounterText, {color: colors.GoldenTainoi}];
    }
    return localStyle.charCounterText;
  }, [localStyle.charCounterText, nCharacterCount]);

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
            <View style={localStyle.textInputContainer}>
              <TextInput
                testID="add_list_modal"
                defaultValue={sDefaultValue}
                style={localStyle.inputStyle}
                autoFocus={true}
                onChangeText={fnOnListNameChange}
                placeholder={'Enter List Name'}
                placeholderTextColor={getColorWithOpacity(
                  colors.BlackPearl,
                  0.5,
                )}
                onSubmitEditing={fnOnCreateListPress}
              />
              <Text
                style={
                  charCountTextStyle
                }>{`${nCharacterCount}/${TEXT_INPUT_LIMIT}`}</Text>
            </View>
            {sErrorMessage ? (
              <Text style={localStyle.errorText}>{sErrorMessage}</Text>
            ) : (
              <Text style={localStyle.warningText}>{sWarningText}</Text>
            )}
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
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layoutPtToPx(48),
    borderWidth: 1,
    borderColor: getColorWithOpacity(colors.Black, 0.2),
    marginTop: layoutPtToPx(20),
    borderRadius: layoutPtToPx(8),
    flex: 1,
    paddingHorizontal: layoutPtToPx(10),
    width: '100%',
  },
  inputStyle: {
    fontFamily: fonts.InterRegular,
    height: layoutPtToPx(48),
    color: colors.BlackPearl,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    width: '90%',
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
  charCounterText: {
    color: getColorWithOpacity(colors.BlackPearl, 0.4),
    fontSize: fontPtToPx(10),
    paddingLeft: layoutPtToPx(5),
  },
  errorText: {
    fontFamily: fonts.InterRegular,
    color: colors.BitterSweet,
    fontSize: fontPtToPx(12),
  },
  warningText: {
    fontFamily: fonts.InterRegular,
    color: colors.GoldenTainoi,
    fontSize: fontPtToPx(12),
    textAlign: 'center',
  },
};

export default React.memo(AddListModal);

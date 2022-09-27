import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import Checkbox from '../common/Checkbox';
import CustomModal from '../common/CustomModal';
import RoundedButton from '../common/RoundedButton';
import useRedirectConfirmationModalData from './useRedirectConfirmationModalData';

function RedirectConfirmationModal() {
  const localStyle = useStyleProcessor(styles, 'RedirectConfirmationModal');

  const {
    bIsVisible,
    fnOnBackdropPress,
    fnOnCancelPress,
    fnOnSureButtonPress,
    fnOnCheckboxValueChange,
  } = useRedirectConfirmationModalData();

  const getBackdrop = useMemo(() => {
    return <View style={localStyle.blur} />;
  }, [localStyle.blur]);

  return bIsVisible ? (
    <CustomModal
      testID="redirect_confirmation"
      visible={bIsVisible}
      onHardwareBackButtonPress={fnOnBackdropPress}
      onBackDropPress={fnOnBackdropPress}
      customBackdrop={getBackdrop}>
      <View style={localStyle.modalStyle}>
        <SafeAreaView style={localStyle.container}>
          <View style={localStyle.view}>
            <Text style={localStyle.textStyle}>
              You’ll be redirected to Twitter and we won’t be able to keep you
              private, are you sure?
            </Text>
            <Text style={localStyle.subTextStyle}>
              You also need a Twitter account to interact with the tweet and
              your actions will be visible to Twitter
            </Text>

            <View style={localStyle.flexRow}>
              <RoundedButton
                testID={'redirect_confiramtion_modal_cancel'}
                style={localStyle.cancelButton}
                text={'Cancel'}
                textStyle={localStyle.cancelButtonText}
                onPress={fnOnCancelPress}
                underlayColor={getColorWithOpacity(colors.White, 0.8)}
              />
              <RoundedButton
                testID={'redirect_confiramtion_modal_sure'}
                style={localStyle.sureButton}
                text={'I am sure'}
                textStyle={localStyle.sureButtonText}
                onPress={fnOnSureButtonPress}
                underlayColor={getColorWithOpacity(colors.BitterSweet, 0.8)}
              />
            </View>
            <Checkbox
              testID="redirect_confirmation_modal"
              onValueChange={fnOnCheckboxValueChange}
              text={'Don’t show again'}
              textStyle={localStyle.checkboxTextStyle}
            />
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
    borderRadius: layoutPtToPx(14),
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
    backgroundColor: getColorWithOpacity(colors.BlackPearl, 0.5),
  },
  textStyle: {
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    fontFamily: fonts.SoraSemiBold,
    color: colors.BlackPearl,
    textAlign: 'center',
  },
  subTextStyle: {
    marginTop: layoutPtToPx(13),
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    fontFamily: fonts.InterMedium,
    color: colors.BlackPearl,
    textAlign: 'center',
  },
  checkboxTextStyle: {
    marginLeft: layoutPtToPx(8),
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    fontFamily: fonts.InterMedium,
    color: colors.Black,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  view: {
    width: '100%',
    height: 'auto',
    padding: layoutPtToPx(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sureButton: {
    backgroundColor: colors.BitterSweet,
    borderWidth: 1,
    borderColor: colors.BitterSweet,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  cancelButton: {
    backgroundColor: colors.White,
    borderWidth: 1,
    borderColor: colors.BlackPearl,
    marginRight: layoutPtToPx(10),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
  },
  sureButtonText: {
    marginHorizontal: layoutPtToPx(5),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.White,
    fontFamily: fonts.SoraSemiBold,
  },
  cancelButtonText: {
    marginHorizontal: layoutPtToPx(5),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
  },
  flexRow: {
    flexDirection: 'row',
    flex: 1,
    marginTop: layoutPtToPx(20),
    marginBottom: layoutPtToPx(12),
  },
};

export default React.memo(RedirectConfirmationModal);

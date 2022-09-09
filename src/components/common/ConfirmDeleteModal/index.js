import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors, {getColorWithOpacity} from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import CustomModal from '../CustomModal';
import RoundedButton from '../RoundedButton';
import useConfirmDeleteModalData from './useConfirmDeleteModalData';

function ConfirmDeleteModal() {
  const localStyle = useStyleProcessor(styles, 'ConfirmDeleteModal');

  const {
    bIsVisible,
    fnOnBackdropPress,
    sText,
    sTestID,
    fnOnCancelPress,
    fnOnSureButtonPress,
  } = useConfirmDeleteModalData();

  const getBackdrop = useMemo(() => {
    return <View style={localStyle.blur} />;
  }, [localStyle.blur]);

  return bIsVisible ? (
    <CustomModal
      testID={`${sTestID}_confirm_delete`}
      visible={bIsVisible}
      onHardwareBackButtonPress={fnOnBackdropPress}
      onBackDropPress={fnOnBackdropPress}
      customBackdrop={getBackdrop}>
      <View style={localStyle.modalStyle}>
        <SafeAreaView style={localStyle.container}>
          <View style={localStyle.view}>
            <Text style={localStyle.textStyle}>{sText}</Text>
            <View style={localStyle.flexRow}>
              <RoundedButton
                testID={`${sTestID}_confirm_delete_modal_cancel`}
                style={localStyle.cancelButton}
                text={'Cancel'}
                textStyle={localStyle.cancelButtonText}
                onPress={fnOnCancelPress}
                underlayColor={getColorWithOpacity(colors.White, 0.8)}
              />
              <RoundedButton
                testID={`${sTestID}_confirm_delete_modal_sure`}
                style={localStyle.sureButton}
                text={'I am sure'}
                textStyle={localStyle.sureButtonText}
                onPress={fnOnSureButtonPress}
                underlayColor={getColorWithOpacity(colors.BitterSweet, 0.8)}
              />
            </View>
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
  },
  view: {
    width: '100%',
    height: 'auto',
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
    marginTop: layoutPtToPx(25),
    marginBottom: layoutPtToPx(15),
  },
};

export default React.memo(ConfirmDeleteModal);

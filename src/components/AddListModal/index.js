import React, {useMemo} from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import CustomModal from '../common/CustomModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../utils/colors';
import useAddListModalData from './useAddListModalData';

function AddListModal() {
  const localStyle = useStyleProcessor(styles, 'AddListModal');

  const {
    bIsVisible,
    fnOnBackdropPress,
    fnOnListNameChange,
    fnOnCreateListPress,
  } = useAddListModalData();

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
            <Text style={localStyle.enterNameStyle}>Enter List Name</Text>
            <TextInput
              style={localStyle.inputStyle}
              editable={true}
              onChangeText={fnOnListNameChange}
            />
            <TouchableHighlight
              underlayColor={colors.DodgerBlue}
              style={localStyle.buttonContainer}
              onPress={fnOnCreateListPress}>
              <Text style={localStyle.createTextStyle}>Create</Text>
            </TouchableHighlight>
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
  buttonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: colors.DodgerBlue,
    borderWidth: 0,
    height: 40,
    borderRadius: 4,
    overflow: 'hidden',
  },
  enterNameStyle: {
    fontSize: 20,
    color: colors.SherpaBlue,
    marginBottom: 10,
  },
  inputStyle: {
    paddingTop: 10,
    marginBottom: 20,
    height: 'auto',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.SherpaBlue,
    color: colors.SherpaBlue,
    fontSize: 18,
    paddingHorizontal: 20,
  },
  view: {
    width: '100%',
    height: 200,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createTextStyle: {
    color: colors.White,
  },
};

export default React.memo(AddListModal);

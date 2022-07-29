import React, {useCallback} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/common/Header';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {EditIcon} from '../../assets/common';
import colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import ScreenName from '../../constants/ScreenName';

function SettingScreen() {
  const localStyle = useStyleProcessor(styles, 'SettingScreen');

  const navigation = useNavigation();

  const onEditPress = useCallback(() => {
    navigation.navigate(ScreenName.PreferenceScreen);
  }, [navigation]);

  return (
    <View style={localStyle.container}>
      <Header
        enableBackButton={true}
        text="Settings"
        textStyle={localStyle.titleText}
      />
      <View style={localStyle.settingsContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={localStyle.roundedButton}
          onPress={onEditPress}>
          <Image source={EditIcon} style={localStyle.image} />
        </TouchableOpacity>
        <Text style={localStyle.textStyle}>Edit preferences</Text>
      </View>
    </View>
  );
}

export default SettingScreen;

const styles = {
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: fontPtToPx(20),
    color: colors.Black,
  },
  settingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedButton: {
    height: layoutPtToPx(50),
    width: layoutPtToPx(50),
    justifyContent: 'center',
    borderRadius: layoutPtToPx(25),
    alignItems: 'center',
    backgroundColor: colors.DodgerBlue,
  },
  image: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
    tintColor: colors.White,
  },
  textStyle: {marginTop: layoutPtToPx(10), color: colors.Black},
};

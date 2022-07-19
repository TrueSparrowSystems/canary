import React from 'react';
import {View} from 'react-native';
import PreferenceSelector from '../../components/PreferenceSelector';
import {usePreferenceScreenData} from './usePreferenceScreenData';

function PreferenceScreen() {
  const {} = usePreferenceScreenData();

  return (
    <View>
      <PreferenceSelector />
    </View>
  );
}
export default React.memo(PreferenceScreen);

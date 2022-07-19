import {TextInput, View} from 'react-native';
import React from 'react';
import PreferenceOptionButton from '../PreferenceOptionButton';
import {usePreferenceSelectorData} from './usePreferenceSelectorData';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../utils/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';

function PreferenceSelector(props) {
  const localStyle = useStyleProcessor(styles, 'PreferenceSelector');

  const {aPreferences, fnOnItemSelect, fnOnSearchInput} =
    usePreferenceSelectorData(props);

  return (
    <View>
      <View style={localStyle.searchBarContainer}>
        <TextInput
          cursorColor={colors.DodgerBlue}
          style={localStyle.searchBar}
          placeholder="Search topics"
          onChangeText={fnOnSearchInput}
        />
      </View>
      <View style={localStyle.optionsContainer}>
        {aPreferences.map(pref => (
          <PreferenceOptionButton
            text={pref.title}
            id={pref.id}
            key={pref.id}
            onPress={fnOnItemSelect}
            isSelected={pref.isSelected}
          />
        ))}
      </View>
    </View>
  );
}

export default React.memo(PreferenceSelector);

const styles = {
  optionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  searchBar: {
    color: colors.SherpaBlue,
    backgroundColor: 'white',
    fontSize: fontPtToPx(14),
    letterSpacing: 0.32,
    height: layoutPtToPx(30),
    width: '100%',
    paddingHorizontal: layoutPtToPx(10),
    borderRadius: layoutPtToPx(15),
  },
  searchBarContainer: {
    paddingHorizontal: layoutPtToPx(5),
    marginVertical: layoutPtToPx(20),
  },
};

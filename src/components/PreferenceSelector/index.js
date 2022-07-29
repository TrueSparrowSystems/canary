import {ScrollView, TextInput, View} from 'react-native';
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyle.optionsContainer}>
        {aPreferences.map(pref => (
          <PreferenceOptionButton
            text={pref.title}
            id={pref.id}
            key={pref.id}
            onPress={fnOnItemSelect}
            isSelected={pref.isSelected}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default React.memo(PreferenceSelector);

const styles = {
  optionsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingBottom: layoutPtToPx(70),
  },
  searchBar: {
    color: colors.SherpaBlue,
    backgroundColor: 'white',
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    letterSpacing: 0.32,
    height: layoutPtToPx(40),
    width: '100%',
    paddingHorizontal: layoutPtToPx(10),
    borderRadius: layoutPtToPx(20),
  },
  searchBarContainer: {
    marginVertical: layoutPtToPx(20),
  },
};

import {View} from 'react-native';
import React from 'react';
import PreferenceOptionButton from '../PreferenceOptionButton';
import {usePreferenceSelectorData} from './usePreferenceSelectorData';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';

function PreferenceSelector(props) {
  const localStyle = useStyleProcessor(styles, 'PreferenceSelector');

  const {aPreferences, fnOnItemSelect} = usePreferenceSelectorData(props);

  return (
    <View>
      <View style={localStyle.optionsContainer}>
        {aPreferences.map(pref => (
          <PreferenceOptionButton
            text={pref.title}
            id={pref.id}
            key={pref.id}
            icon={pref.icon}
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
    marginTop: layoutPtToPx(20),
    marginBottom: layoutPtToPx(30),
  },
  searchBar: {
    color: colors.SherpaBlue,
    backgroundColor: 'white',
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    height: layoutPtToPx(40),
    width: '100%',
    paddingHorizontal: layoutPtToPx(10),
    borderRadius: layoutPtToPx(20),
  },
  searchBarContainer: {
    marginVertical: layoutPtToPx(20),
  },
};

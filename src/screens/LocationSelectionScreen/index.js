import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import SearchBar from '../../components/SearchBar';
import useLocationSelectionScreenData from './useLocationSelectionScreenData';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import Header from '../../components/common/Header';

function LocationSelectionScreen() {
  const localStyle = useStyleProcessor(styles, 'LocationSelectionScreen');

  const {aData, fnOnSearchInput, fnOnItemSelect} =
    useLocationSelectionScreenData();
  return (
    <View style={localStyle.container}>
      <Header
        enableBackButton={true}
        text="Change Location"
        textStyle={localStyle.headerText}
      />
      <SearchBar
        onQueryChange={fnOnSearchInput}
        placeholderText={'Search Location'}
      />
      <ScrollView style={localStyle.scrollViewContainer}>
        {aData?.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              fnOnItemSelect(item);
            }}
            style={localStyle.itemContainer}
            activeOpacity={0.8}>
            <Text style={localStyle.itemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default React.memo(LocationSelectionScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: getColorWithOpacity(colors.BlackPearl, 0.2),
    marginBottom: layoutPtToPx(16),
  },
  itemText: {
    marginBottom: layoutPtToPx(16),
    fontFamily: fonts.InterRegular,
  },
  scrollViewContainer: {
    paddingHorizontal: layoutPtToPx(20),
    marginTop: layoutPtToPx(20),
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    color: colors.BlackPearl,
  },
};

import {ScrollView, Text} from 'react-native';
import React from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import SearchBar from '../../components/SearchBar';
import useLocationSelectionScreenData from './useLocationSelectionScreenData';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import Header from '../../components/common/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity} from '@plgworks/applogger';

function LocationSelectionScreen() {
  const localStyle = useStyleProcessor(styles, 'LocationSelectionScreen');

  const {aData, fnOnSearchInput, fnOnItemSelect} =
    useLocationSelectionScreenData();
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={localStyle.container}>
      <Header
        testID={'location_selection_screen'}
        enableBackButton={true}
        text="Change Location"
        textStyle={localStyle.headerText}
      />
      <SearchBar
        testID="search_location"
        onQueryChange={fnOnSearchInput}
        placeholderText={'Search Location'}
      />
      <ScrollView style={localStyle.scrollViewContainer}>
        {aData.length ? (
          aData?.map((item, index) => (
            <TouchableOpacity
              testID={`location_item_${item}`}
              key={index}
              onPress={() => {
                fnOnItemSelect(item);
              }}
              style={localStyle.itemContainer}
              activeOpacity={0.8}>
              <Text style={localStyle.itemText}>{item}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={localStyle.noResultsText}>No results found</Text>
        )}
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

export default React.memo(LocationSelectionScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  noResultsText: {
    alignSelf: 'center',
    fontFamily: fonts.SoraSemiBold,
    color: colors.BlackPearl,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: getColorWithOpacity(colors.BlackPearl, 0.2),
    marginBottom: layoutPtToPx(16),
  },
  itemText: {
    marginBottom: layoutPtToPx(16),
    fontFamily: fonts.InterRegular,
    color: colors.BlackPearl,
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

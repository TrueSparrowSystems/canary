import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View, Image, TextInput} from 'react-native';
import colors, {getColorWithOpacity} from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {CrossIcon, SearchIcon} from '../../assets/common';
import {useNavigation} from '@react-navigation/native';
import {isEmpty, unescape} from 'lodash';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import fonts from '../../constants/fonts';

function SearchBar({
  searchQuery = '',
  onSearchPressCallback,
  onQueryChange,
  placeholderText,
}) {
  const navigation = useNavigation();
  const localStyle = useStyleProcessor(styles, 'SearchBar');
  const queryRef = useRef(searchQuery);
  const [query, setQuery] = useState(queryRef.current);
  const textInputRef = useRef(null);

  if (!isEmpty(queryRef.current)) {
    const arr = queryRef.current.split(':');
    if (arr[0] === 'from') {
      queryRef.current = arr[1];
    }
  }

  useEffect(() => {
    const OnTrendingTopicClicked = term => {
      queryRef.current = unescape(term);
      setQuery(queryRef.current);
      onSearchPress();
    };
    LocalEvent.on(EventTypes.OnTrendingTopicClick, OnTrendingTopicClicked);
    return () => {
      LocalEvent.off(EventTypes.OnTrendingTopicClick, OnTrendingTopicClicked);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFocus = useCallback(() => {
    textInputRef.current.focus();
  }, []);

  useEffect(() => {
    navigation.addListener('focus', setFocus);
    return () => {
      navigation.removeListener('focus', setFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchPress = useCallback(() => {
    onSearchPressCallback?.(queryRef.current);
  }, [onSearchPressCallback]);

  const clearQuery = useCallback(() => {
    queryRef.current = '';
    setQuery(queryRef.current);
  }, []);

  const updateQuery = useCallback(
    text => {
      queryRef.current = text;
      setQuery(queryRef.current);
      onQueryChange?.(text);
    },
    [onQueryChange],
  );

  return (
    <View style={localStyle.searchContainer}>
      <Image source={SearchIcon} style={localStyle.searchIconStyle} />
      <TextInput
        ref={textInputRef}
        style={localStyle.input}
        value={queryRef.current}
        cursorColor={colors.BlackPearl}
        placeholder={placeholderText || 'Search Tweets'}
        placeholderTextColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
        selectionColor={getColorWithOpacity(colors.BlackPearl, 0.5)}
        onChangeText={updateQuery}
        onSubmitEditing={onSearchPress}
        returnKeyType="search"
      />

      {query.length > 0 && (
        <TouchableOpacity
          onPress={clearQuery}
          style={localStyle.crossContainer}>
          <Image source={CrossIcon} style={localStyle.crossButtonStyle} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = {
  searchContainer: {
    marginTop: layoutPtToPx(10),
    marginHorizontal: layoutPtToPx(20),
    borderWidth: 1,
    borderRadius: layoutPtToPx(4),
    paddingHorizontal: layoutPtToPx(10),
    borderColor: getColorWithOpacity(colors.BlackPearl, 0.5),
    backgroundColor: colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    height: layoutPtToPx(36),
    tablet: {
      marginTop: layoutPtToPx(20),
    },
  },
  crossContainer: {
    padding: layoutPtToPx(5),
  },
  crossButtonStyle: {
    height: layoutPtToPx(16),
    width: layoutPtToPx(16),
  },
  input: {
    fontFamily: fonts.SoraRegular,
    paddingTop: 0,
    paddingBottom: 0,
    height: '100%',
    color: colors.BlackPearl,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    letterSpacing: 0.32,
    flex: 1,
  },
  searchIconStyle: {
    tintColor: getColorWithOpacity(colors.BlackPearl, 0.2),
    height: layoutPtToPx(16),
    width: layoutPtToPx(16),
    marginRight: layoutPtToPx(8),
  },
};

export default React.memo(SearchBar);

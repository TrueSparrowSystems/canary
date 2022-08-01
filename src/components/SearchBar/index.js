import React, {useCallback, useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View, Image, TextInput} from 'react-native';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {BinIcon, SearchIcon} from '../../assets/common';
import {useNavigation} from '@react-navigation/native';
import {unescape} from 'lodash';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function SearchBar({searchQuery = '', onSearchPressCallback}) {
  const navigation = useNavigation();
  const localStyle = useStyleProcessor(styles, 'SearchBar');
  const queryRef = useRef(searchQuery);
  const [query, setQuery] = useState(queryRef.current);
  const textInputRef = useRef(null);

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

  const updateQuery = useCallback(text => {
    queryRef.current = text;
    setQuery(queryRef.current);
  }, []);

  return (
    <View style={localStyle.searchContainer}>
      <TextInput
        ref={textInputRef}
        style={localStyle.input}
        value={queryRef.current}
        cursorColor={colors.SherpaBlue}
        placeholder={'Enter Search Text'}
        placeholderTextColor={colors.SherpaBlue70}
        selectionColor={colors.SherpaBlue70}
        onChangeText={updateQuery}
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={onSearchPress}
          style={localStyle.crossContainer}>
          <Image source={SearchIcon} style={localStyle.crossButtonStyle} />
        </TouchableOpacity>
      )}

      {query.length > 0 && (
        <TouchableOpacity
          onPress={clearQuery}
          style={localStyle.crossContainer}>
          <Image source={BinIcon} style={localStyle.crossButtonStyle} />
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
    borderColor: '003C434D',
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
  crossButtonStyle: {height: layoutPtToPx(12), width: layoutPtToPx(12)},
  input: {
    paddingTop: 0,
    paddingBottom: 0,
    height: '100%',
    color: colors.SherpaBlue,
    fontSize: fontPtToPx(14),
    letterSpacing: 0.32,
    flex: 1,
  },
};

export default React.memo(SearchBar);

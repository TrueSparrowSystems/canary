import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Linking, Text} from 'react-native';
import ScreenName from '../../../constants/ScreenName';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import colors from '../../../utils/colors';

const PATTERN_HASHTAG = /(^|\s)(#[a-z\d-_]+)/gi;
const PATTERN_MENTION = /(^|\s)(@[a-z\d-_]+)/gi;
const PATTERN_URL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const matchesWith = (str, pattern) => {
  let match = null;
  const arr = [];
  while ((match = pattern.exec(str)) != null) {
    arr.push([match, pattern]);
  }
  return arr;
};

const splitStringByMatches = (str, matches) => {
  const arr = [];
  let o = 0;

  matches.forEach(([match, pattern]) => {
    const {index} = {...match};
    const text = match[match.length - 1];
    arr.push([str.slice(o, index), null]);
    arr.push([str.slice(index, index + text.length + 1), pattern]);
    o = index + text.length + 1;
  });

  arr.push([str.slice(o, str.length), null]);

  return arr.filter(([s]) => s.length > 0);
};

function TwitterTextView({
  children = '',
  extractHashtags = true,
  hashtagStyle,
  extractMentions = true,
  mentionStyle,
  extractLinks = true,
  linkStyle,
  ...extraProps
}) {
  const localStyle = useStyleProcessor(styles, 'TwitterTextView');
  const navigation = useNavigation();
  const onPressHashtag = useCallback(
    (e, str) => {
      navigation.push(ScreenName.SearchResultScreen, {query: str});
    },
    [navigation],
  );
  const onPressMention = useCallback(
    (e, str) => {
      const strArray = str.split('@');
      navigation.push(ScreenName.SearchResultScreen, {
        query: `from:${strArray[1]}`,
      });
    },
    [navigation],
  );
  const onPressLink = useCallback((e, url) => {
    Linking.canOpenURL(url).then(canOpen => !!canOpen && Linking.openURL(url));
  }, []);

  const str = (typeof children === 'string' && children) || '';

  const patterns = [
    !!extractHashtags && PATTERN_HASHTAG,
    !!extractMentions && PATTERN_MENTION,
    !!extractLinks && PATTERN_URL,
  ].filter(e => !!e);

  const matches = []
    .concat(...patterns.map(pattern => matchesWith(str, pattern)))
    .filter(e => !!e)
    .sort(([a], [b]) => ({...a}.index - {...b}.index));

  const onPress = {
    [PATTERN_HASHTAG]: onPressHashtag,
    [PATTERN_MENTION]: onPressMention,
    [PATTERN_URL]: onPressLink,
  };

  return (
    <Text {...extraProps}>
      {splitStringByMatches(str, matches).map(([text, pattern], i) => {
        const handle = onPress[pattern];
        return handle ? (
          <Text
            key={i}
            style={localStyle.linkStyle}
            onPress={e => {
              return handle(e, text);
            }}
            children={text}
          />
        ) : (
          <Text key={i}>{text}</Text>
        );
      })}
    </Text>
  );
}
const styles = {
  linkStyle: {
    color: colors.CuriousBlue,
  },
};

export default TwitterTextView;

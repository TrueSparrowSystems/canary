import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef, useEffect} from 'react';
import {Text, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
import {View} from 'react-native-animatable';
import {BinIcon, EditIcon} from '../../assets/common';
import ScreenName from '../../constants/ScreenName';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import Image from 'react-native-fast-image';
import fonts from '../../constants/fonts';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import {getRandomColorCombination} from '../../utils/RandomColorUtil';
import * as Animatable from 'react-native-animatable';

function CollectionCard(props) {
  const {
    data,
    onCollectionRemoved,
    onLongPress,
    enableDelete,
    animationDelay,
    disabled,
  } = props;
  const {name: collectionName, id: collectionId, tweetIds} = data;
  let {colorScheme} = data;
  const localStyle = useStyleProcessor(styles, 'CollectionCard');
  const navigation = useNavigation();
  const viewRef = useRef(null);

  const onCollectionPress = useCallback(() => {
    navigation.navigate(ScreenName.CollectionTweetScreen, {
      collectionId,
      collectionName,
    });
  }, [collectionId, collectionName, navigation]);

  const onEditCollectionPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddCollectionModal, {
      name: collectionName,
      id: collectionId,
    });
  }, [collectionId, collectionName]);

  const startAnimation = useCallback(() => {
    viewRef.current.setNativeProps({
      useNativeDriver: true,
    });
    viewRef.current.animate({
      0: {
        rotate: '2.5deg',
      },
      0.25: {
        rotate: '-2.5deg',
      },
      0.5: {
        rotate: '2.5deg',
      },
      0.75: {
        rotate: '-2.5deg',
      },
      1: {
        rotate: '0deg',
      },
    });
  }, []);

  useEffect(() => {
    if (enableDelete) {
      startAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableDelete]);

  const onCollectionRemove = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowDeleteCollectionConfirmationModal, {
      id: collectionId,
      name: collectionName,
      onCollectionRemoved: () => {
        viewRef.current.animate('bounceOut').then(() => {
          onCollectionRemoved();
        });
      },
    });
  }, [collectionId, collectionName, onCollectionRemoved]);

  const colorSchemeStyle = useMemo(() => {
    if (!colorScheme) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      colorScheme = getRandomColorCombination();
    }
    return {
      cardStyle: [
        localStyle.cardStyle,
        {backgroundColor: colorScheme?.backgroundColor},
      ],
      textStyle: [localStyle.textStyle, {color: colorScheme?.textColor}],
      tweetCountTextStyle: [
        localStyle.tweetCountTextStyle,
        {color: colorScheme?.textColor},
      ],
    };
  }, [colorScheme, localStyle.cardStyle]);

  const fnOnLongPress = useCallback(() => {
    onLongPress();
  }, [onLongPress]);

  return (
    <TouchableWithoutFeedback
      onPress={disabled || enableDelete ? null : onCollectionPress}
      onLongPress={disabled ? null : fnOnLongPress}>
      <Animatable.View
        ref={viewRef}
        animation="fadeIn"
        delay={animationDelay}
        style={localStyle.container}>
        {collectionId ? (
          <View style={colorSchemeStyle.cardStyle}>
            {enableDelete ? (
              <View style={localStyle.optionsView}>
                <TouchableHighlight
                  underlayColor={colors.Transparent}
                  style={localStyle.binContainer}
                  onPress={onCollectionRemove}>
                  <Image source={BinIcon} style={localStyle.binIconStyle} />
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={colors.Transparent}
                  style={localStyle.binContainer}
                  onPress={onEditCollectionPress}>
                  <Image source={EditIcon} style={localStyle.binIconStyle} />
                </TouchableHighlight>
              </View>
            ) : null}
            <Text numberOfLines={3} style={colorSchemeStyle.textStyle}>
              {collectionName}
            </Text>
            {tweetIds.length > 0 ? (
              <Text
                numberOfLines={1}
                style={colorSchemeStyle.tweetCountTextStyle}>
                {tweetIds.length} {tweetIds.length > 1 ? 'tweets' : 'tweet'}
              </Text>
            ) : null}
          </View>
        ) : null}
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    marginBottom: layoutPtToPx(20),
    borderRadius: layoutPtToPx(6),
    paddingHorizontal: layoutPtToPx(10),
    flex: 1,
    aspectRatio: 1,
  },
  optionsView: {
    position: 'absolute',
    right: layoutPtToPx(-5),
    top: layoutPtToPx(-5),
  },
  binContainer: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    zIndex: 2,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  binIconStyle: {
    height: layoutPtToPx(24),
    width: layoutPtToPx(24),
  },
  textStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(24),
    lineHeight: layoutPtToPx(30),
    paddingHorizontal: layoutPtToPx(8),
  },
  tweetCountTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(18),
    paddingHorizontal: layoutPtToPx(8),
  },
  imageStyle: {
    height: layoutPtToPx(150),
    width: '100%',
    borderRadius: 6,
  },
  cardStyle: {
    flex: 1,
    borderRadius: layoutPtToPx(12),
    justifyContent: 'flex-end',
    paddingBottom: layoutPtToPx(8),
  },
};

export default React.memo(CollectionCard);

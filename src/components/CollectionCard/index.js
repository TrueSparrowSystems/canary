import React, {useCallback, useMemo, useEffect} from 'react';
import {Text, TouchableWithoutFeedback} from 'react-native';
import {View} from 'react-native-animatable';
import {TickIcon} from '../../assets/common';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors, {getColorWithOpacity} from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import Image from 'react-native-fast-image';
import fonts from '../../constants/fonts';
import {getRandomColorCombination} from '../../utils/RandomColorUtil';
import * as Animatable from 'react-native-animatable';
import {TouchableOpacity} from '@plgworks/applogger';
import useCollectionCardData from './useCollectionCardData';
import Popover from 'react-native-popover-view';

const CollectionCard = props => {
  const {data, enableDelete, animationDelay, disabled} = props;

  const localStyle = useStyleProcessor(styles, 'CollectionCard');

  const {
    oViewRef,
    bIsCollectionSelected,
    bIsPopOverVisible,
    fnOnCollectionRemove,
    fnOnCollectionSelect,
    fnOnCollectionPress,
    fnOnEditCollectionPress,
    fnOnLongPress,
    fnHidePopover,
    fnOnShareCollectionPress,
  } = useCollectionCardData(props);

  const {name: collectionName, id: collectionId, tweetIds} = data;
  let {colorScheme} = data;

  const startAnimation = useCallback(() => {
    oViewRef.current.setNativeProps({
      useNativeDriver: true,
    });
    oViewRef.current.animate({
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
  }, [oViewRef]);

  useEffect(() => {
    if (enableDelete) {
      startAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableDelete]);

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

  const renderArchivePopupMenu = useMemo(() => {
    const components = [
      {
        title: 'Edit',
        onPress: fnOnEditCollectionPress,
      },
      {
        title: 'Share',
        onPress: fnOnShareCollectionPress,
      },
    ];
    return (
      <View>
        {components.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={item.onPress}
              style={localStyle.archivePopupMenuItemContainer}>
              <Text style={localStyle.archivePopupMenuItemText}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={fnOnCollectionRemove}
          style={[
            localStyle.archivePopupMenuItemContainer,
            localStyle.archivePopupMenuItemDeleteItemContainer,
          ]}>
          <Text
            style={[
              localStyle.archivePopupMenuItemText,
              localStyle.archivePopupMenuItemDeleteItemText,
            ]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [
    fnOnCollectionRemove,
    fnOnEditCollectionPress,
    fnOnShareCollectionPress,
    localStyle.archivePopupMenuItemContainer,
    localStyle.archivePopupMenuItemDeleteItemContainer,
    localStyle.archivePopupMenuItemDeleteItemText,
    localStyle.archivePopupMenuItemText,
  ]);

  const renderCollectionCard = useCallback(
    sourceRef => {
      return (
        <TouchableWithoutFeedback
          ref={sourceRef}
          disabled={disabled}
          onPress={enableDelete ? fnOnCollectionSelect : fnOnCollectionPress}
          onLongPress={fnOnLongPress}>
          <Animatable.View
            ref={oViewRef}
            animation="fadeIn"
            delay={animationDelay}
            style={localStyle.container}>
            {collectionId ? (
              <View style={localStyle.flex1}>
                {enableDelete && bIsCollectionSelected ? (
                  <View style={localStyle.tickIconContainerStyle}>
                    <Image source={TickIcon} style={localStyle.tickIconStyle} />
                  </View>
                ) : null}
                <View style={colorSchemeStyle.cardStyle}>
                  <Text numberOfLines={3} style={colorSchemeStyle.textStyle}>
                    {collectionName}
                  </Text>
                  {tweetIds.length > 0 ? (
                    <Text
                      numberOfLines={1}
                      style={colorSchemeStyle.tweetCountTextStyle}>
                      {tweetIds.length}{' '}
                      {tweetIds.length > 1 ? 'tweets' : 'tweet'}
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : null}
          </Animatable.View>
        </TouchableWithoutFeedback>
      );
    },
    [
      animationDelay,
      bIsCollectionSelected,
      collectionId,
      collectionName,
      colorSchemeStyle.cardStyle,
      colorSchemeStyle.textStyle,
      colorSchemeStyle.tweetCountTextStyle,
      disabled,
      enableDelete,
      fnOnCollectionPress,
      fnOnCollectionSelect,
      fnOnLongPress,
      localStyle.container,
      localStyle.flex1,
      localStyle.tickIconContainerStyle,
      localStyle.tickIconStyle,
      oViewRef,
      tweetIds,
    ],
  );

  return (
    <Popover
      onRequestClose={fnHidePopover}
      isVisible={bIsPopOverVisible}
      from={renderCollectionCard}
      popoverStyle={localStyle.archivePopupMenuContainer}
      backgroundStyle={{
        backgroundColor: getColorWithOpacity(colors.BlackPearl, 0.6),
      }}>
      {renderArchivePopupMenu}
    </Popover>
  );
};

const styles = {
  container: {
    marginBottom: layoutPtToPx(20),
    borderRadius: layoutPtToPx(6),
    paddingHorizontal: layoutPtToPx(10),
    flex: 1,
    aspectRatio: 1,
  },
  flex1: {flex: 1},
  optionsView: {
    zIndex: 2,
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
  tickIconContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: getColorWithOpacity(colors.White, 0.5),
    zIndex: 1,
    borderRadius: layoutPtToPx(12),
    height: '100%',
    width: '100%',
  },
  tickIconStyle: {
    height: layoutPtToPx(42),
    width: layoutPtToPx(57),
  },
  cardStyle: {
    flex: 1,
    borderRadius: layoutPtToPx(12),
    justifyContent: 'flex-end',
    paddingBottom: layoutPtToPx(8),
  },
  archivePopupMenuContainer: {
    borderRadius: 10,
    backgroundColor: getColorWithOpacity(colors.Black, 1),
  },
  archivePopupMenuItemContainer: {
    width: layoutPtToPx(150),
    paddingHorizontal: layoutPtToPx(20),
    paddingVertical: layoutPtToPx(10),
    borderBottomWidth: 1,
    borderBottomColor: getColorWithOpacity(colors.White, 0.4),
  },
  archivePopupMenuItemText: {
    fontSize: fontPtToPx(18),
    fontFamily: fonts.InterRegular,
    color: 'white',
  },
  archivePopupMenuItemDeleteItemContainer: {
    borderTopWidth: 2,
    borderBottomWidth: 0,
    borderTopColor: getColorWithOpacity(colors.White, 0.4),
  },
  archivePopupMenuItemDeleteItemText: {
    color: 'red',
  },
};

export default React.memo(CollectionCard);

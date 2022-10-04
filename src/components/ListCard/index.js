import React, {useMemo, useCallback} from 'react';
import {Text, View, Image} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors, {getColorWithOpacity} from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {getRandomColorCombination} from '../../utils/RandomColorUtil';
import {getInitialsFromName} from '../../utils/TextUtils';
import fonts from '../../constants/fonts';
import {ListIcon, TickIcon} from '../../assets/common';
import * as Animatable from 'react-native-animatable';
import useListCardData from './useListCardData';
import {TouchableOpacity, TouchableWithoutFeedback} from '@plgworks/applogger';
import Popover from 'react-native-popover-view';

function ListCard(props) {
  const {
    data,
    enableSwipe,
    shouldShowAddButton,
    isPressDisabled = false,
  } = props;
  const {id: listId, name: listName, colorCombination} = data;
  const localStyle = useStyleProcessor(styles, 'ListCard');

  const {
    bIsListSelected,
    oViewRef,
    oAddButtonData,
    bIsPopOverVisible,
    fnHidePopover,
    fnGetDescriptionText,
    fnOnListPress,
    fnOnListSelect,
    fnOnLongPress,
    fnOnEditPress,
    fnOnRemovePress,
    fnOnShareListPress,
  } = useListCardData(props);

  const listInitials = getInitialsFromName(listName);
  const listIconStyle = useMemo(() => {
    let _colorCombination = colorCombination;
    if (!_colorCombination) {
      _colorCombination = getRandomColorCombination();
    }
    return {
      backgroundStyle: [
        localStyle.listIconStyle,
        {backgroundColor: _colorCombination?.backgroundColor},
      ],
      textStyle: [
        localStyle.listIconTextStyle,
        {color: _colorCombination?.textColor},
      ],
      listIcon: [
        localStyle.listImageStyle,
        {
          tintColor: _colorCombination?.textColor,
        },
      ],
    };
  }, [
    colorCombination,
    localStyle.listIconStyle,
    localStyle.listIconTextStyle,
    localStyle.listImageStyle,
  ]);

  const renderListCard = useCallback(() => {
    return (
      <Animatable.View animation={'fadeIn'} ref={oViewRef} key={listId}>
        <TouchableWithoutFeedback
          testID={`list_card_for_${listName}`}
          onPress={enableSwipe ? fnOnListSelect : fnOnListPress}
          onLongPress={enableSwipe ? null : fnOnLongPress}
          disabled={isPressDisabled}>
          <View style={localStyle.container}>
            <View style={localStyle.cardDetailContainer}>
              {bIsListSelected && enableSwipe ? (
                <View style={localStyle.tickIconContainerStyle}>
                  <Image style={localStyle.tickIconStyle} source={TickIcon} />
                </View>
              ) : null}
              <View style={listIconStyle.backgroundStyle}>
                {listInitials?.length === 0 ? (
                  <Image source={ListIcon} style={listIconStyle.listIcon} />
                ) : (
                  <Text style={listIconStyle.textStyle}>
                    {listInitials?.substring(0, 2)}
                  </Text>
                )}
              </View>
              <View style={localStyle.listNameContainer}>
                <Text style={localStyle.listNameStyle} numberOfLines={1}>
                  {listName}
                </Text>
                <Text style={localStyle.descriptionTextStyle} numberOfLines={1}>
                  {fnGetDescriptionText()}
                </Text>
              </View>
            </View>
            {shouldShowAddButton ? (
              <TouchableOpacity
                testID={`list_card_for_${listName}_toggle`}
                style={
                  oAddButtonData.buttonType === 'Primary'
                    ? localStyle.primaryAddButtonContainer
                    : localStyle.secondaryAddButtonContainer
                }
                onPress={oAddButtonData.onPress}>
                <View>
                  <Text
                    style={
                      oAddButtonData.buttonType === 'Primary'
                        ? localStyle.primaryAddText
                        : localStyle.secondaryAddText
                    }>
                    {oAddButtonData.buttonText}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </Animatable.View>
    );
  }, [
    bIsListSelected,
    enableSwipe,
    fnGetDescriptionText,
    fnOnListPress,
    fnOnListSelect,
    fnOnLongPress,
    isPressDisabled,
    listIconStyle.backgroundStyle,
    listIconStyle.listIcon,
    listIconStyle.textStyle,
    listId,
    listInitials,
    listName,
    localStyle.cardDetailContainer,
    localStyle.container,
    localStyle.descriptionTextStyle,
    localStyle.listNameContainer,
    localStyle.listNameStyle,
    localStyle.primaryAddButtonContainer,
    localStyle.primaryAddText,
    localStyle.secondaryAddButtonContainer,
    localStyle.secondaryAddText,
    localStyle.tickIconContainerStyle,
    localStyle.tickIconStyle,
    oAddButtonData.buttonText,
    oAddButtonData.buttonType,
    oAddButtonData.onPress,
    shouldShowAddButton,
    oViewRef,
  ]);

  const renderListPopupMenu = useMemo(() => {
    const components = [
      {
        title: 'Edit',
        onPress: fnOnEditPress,
      },
      {
        title: 'Share',
        onPress: fnOnShareListPress,
      },
    ];
    return (
      <View>
        {components.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={item.onPress}
              style={localStyle.listPopupMenuItemContainer}>
              <Text style={localStyle.listPopupMenuItemText}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={fnOnRemovePress}
          style={[
            localStyle.listPopupMenuItemContainer,
            localStyle.listPopupMenuItemDeleteItemContainer,
          ]}>
          <Text
            style={[
              localStyle.listPopupMenuItemText,
              localStyle.listPopupMenuItemDeleteItemText,
            ]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [
    fnOnEditPress,
    fnOnRemovePress,
    fnOnShareListPress,
    localStyle.listPopupMenuItemContainer,
    localStyle.listPopupMenuItemDeleteItemContainer,
    localStyle.listPopupMenuItemDeleteItemText,
    localStyle.listPopupMenuItemText,
  ]);

  return (
    <Popover
      onRequestClose={fnHidePopover}
      isVisible={bIsPopOverVisible}
      from={renderListCard}
      popoverStyle={localStyle.listPopupMenuContainer}
      backgroundStyle={{
        backgroundColor: getColorWithOpacity(colors.BlackPearl, 0.6),
      }}>
      {renderListPopupMenu}
    </Popover>
  );
}

const styles = {
  container: {
    marginHorizontal: layoutPtToPx(20),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.BlackPearl20,
    marginTop: layoutPtToPx(16),
    paddingBottom: layoutPtToPx(13),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDetailContainer: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  tickIconContainerStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    borderRadius: layoutPtToPx(20),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: getColorWithOpacity(colors.White, 0.5),
    zIndex: 1,
  },
  tickIconStyle: {
    height: layoutPtToPx(15),
    width: layoutPtToPx(20),
  },
  listIconStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    borderRadius: layoutPtToPx(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layoutPtToPx(8),
  },
  listIconTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
  },
  listNameContainer: {flexShrink: 1},
  listNameStyle: {
    color: colors.Black,
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    maxHeight: layoutPtToPx(22),
  },
  descriptionTextStyle: {
    color: colors.BlackPearl,
    fontFamily: fonts.InterLight,
    fontSize: fontPtToPx(12),
    maxHeight: layoutPtToPx(20),
    marginTop: layoutPtToPx(3),
    fontStyle: 'italic',
  },
  rightActionContainer: {
    backgroundColor: colors.BitterSweet,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layoutPtToPx(15),
  },
  rightActionText: {
    color: colors.White,
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
  },
  swipeIconStyle: {
    height: layoutPtToPx(10),
    width: layoutPtToPx(16),
    alignSelf: 'center',
  },
  primaryAddButtonContainer: {
    paddingHorizontal: layoutPtToPx(12),
    alignItems: 'center',
    borderRadius: layoutPtToPx(8),
    backgroundColor: colors.GoldenTainoi,
    maxHeight: layoutPtToPx(30),
  },
  primaryAddText: {
    color: colors.White,
    fontFamily: fonts.SoraBold,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    marginVertical: layoutPtToPx(7),
  },
  secondaryAddButtonContainer: {
    paddingHorizontal: layoutPtToPx(12),
    alignItems: 'center',
    borderRadius: layoutPtToPx(8),
    borderWidth: 1,
    borderColor: colors.GoldenTainoi,
    maxHeight: layoutPtToPx(30),
    backgroundColor: getColorWithOpacity(colors.GoldenTainoi, 0.1),
  },
  secondaryAddText: {
    color: colors.GoldenTainoi,
    fontFamily: fonts.SoraBold,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    marginVertical: layoutPtToPx(7),
  },
  removeButtonStyle: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.White,
  },
  listImageStyle: {
    height: layoutPtToPx(20),
    width: layoutPtToPx(20),
  },
  listPopupMenuContainer: {
    borderRadius: 10,
    backgroundColor: getColorWithOpacity(colors.Black, 1),
  },
  listPopupMenuItemContainer: {
    width: layoutPtToPx(150),
    paddingHorizontal: layoutPtToPx(20),
    paddingVertical: layoutPtToPx(10),
    borderBottomWidth: 1,
    borderBottomColor: getColorWithOpacity(colors.White, 0.4),
  },
  listPopupMenuItemText: {
    fontSize: fontPtToPx(18),
    fontFamily: fonts.InterRegular,
    color: 'white',
  },
  listPopupMenuItemDeleteItemContainer: {
    borderTopWidth: 2,
    borderBottomWidth: 0,
    borderTopColor: getColorWithOpacity(colors.White, 0.4),
  },
  listPopupMenuItemDeleteItemText: {
    color: 'red',
  },
};

export default React.memo(ListCard);

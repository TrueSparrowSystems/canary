import React, {useMemo, useCallback} from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors, {getColorWithOpacity} from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {getRandomColorCombination} from '../../utils/RandomColorUtil';
import {getInitialsFromName} from '../../utils/TextUtils';
import fonts from '../../constants/fonts';
import {ListIcon, SwipeIcon} from '../../assets/common';
import * as Animatable from 'react-native-animatable';
import AppleStyleSwipeableRow from '../AppleStyleSwipeableRow';
import useListCardData from './useListCardData';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function ListCard(props) {
  const {
    data,
    onListRemoved,
    onCardLongPress,
    enableSwipe,
    disableSwipeInteraction = false,
    shouldShowAddButton,
    userName,
    onAddToListSuccess,
    onRemoveFromListSuccess,
    isPressDisabled = false,
  } = props;
  const {id: listId, name: listName, userNames, colorCombination} = data;
  const localStyle = useStyleProcessor(styles, 'ListCard');

  const {
    viewRef,
    fnGetDescriptionText,
    fnOnListPress,
    fnOnListRemove,
    oAddButtonData,
    fnOnLongPress,
  } = useListCardData(
    onListRemoved,
    userName,
    userNames,
    listId,
    listName,
    onAddToListSuccess,
    onRemoveFromListSuccess,
    shouldShowAddButton,
    onCardLongPress,
  );

  const listIntials = getInitialsFromName(listName);
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

  const onRemovePress = useCallback(() => {
    viewRef.current.setNativeProps({
      useNativeDriver: true,
    });
    viewRef.current.animate('bounceOutLeft').then(() => {
      fnOnListRemove();
    });
  }, [fnOnListRemove, viewRef]);

  const onEditPress = useCallback(() => {
    LocalEvent.emit(EventTypes.ShowAddListModal, {
      name: listName,
      id: listId,
    });
  }, [listId, listName]);

  return (
    <Animatable.View animation={'fadeIn'} ref={viewRef}>
      <AppleStyleSwipeableRow
        disableSwipeInteraction={disableSwipeInteraction}
        enabled={enableSwipe}
        textStyle={localStyle.removeButtonStyle}
        rightActionsArray={[
          {
            actionName: 'Remove',
            color: colors.BitterSweet,
            onPress: onRemovePress,
          },
          {
            actionName: 'Edit',
            color: colors.LightGrey,
            onPress: onEditPress,
          },
        ]}
        shouldRenderRightAction={true}>
        <TouchableWithoutFeedback
          onPress={fnOnListPress}
          onLongPress={fnOnLongPress}
          disabled={enableSwipe || isPressDisabled}>
          <View style={localStyle.container}>
            <View style={localStyle.cardDetailContainer}>
              <View style={listIconStyle.backgroundStyle}>
                {listIntials?.length === 0 ? (
                  <Image source={ListIcon} style={listIconStyle.listIcon} />
                ) : (
                  <Text style={listIconStyle.textStyle}>
                    {listIntials?.substring(0, 2)}
                  </Text>
                )}
              </View>
              <View style={localStyle.listNameContainer}>
                <Text style={localStyle.listNameStyle}>{listName}</Text>
                <Text style={localStyle.descriptionTextStyle} numberOfLines={1}>
                  {fnGetDescriptionText()}
                </Text>
              </View>
            </View>
            {enableSwipe ? (
              <Image source={SwipeIcon} style={localStyle.swipeIconStyle} />
            ) : null}
            {shouldShowAddButton ? (
              <TouchableOpacity
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
      </AppleStyleSwipeableRow>
    </Animatable.View>
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
  listNameContainer: {width: '80%'},
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
    height: layoutPtToPx(8),
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
};

export default React.memo(ListCard);

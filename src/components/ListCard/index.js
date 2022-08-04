import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef} from 'react';
import {Text, View, TouchableWithoutFeedback, Image} from 'react-native';
import ScreenName from '../../constants/ScreenName';
import {ToastType} from '../../constants/ToastConstants';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {listService} from '../../services/ListService';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import Toast from 'react-native-toast-message';
import {getRandomColorCombination} from '../../utils/RandomColorUtil';
import {getInitialsFromName} from '../../utils/TextUtils';
import fonts from '../../constants/fonts';
import {SwipeIcon} from '../../assets/common';
import * as Animatable from 'react-native-animatable';
import AppleStyleSwipeableRow from '../AppleStyleSwipeableRow';

function ListCard(props) {
  const {data, onListRemoved, onCardLongPress, enableSwipe} = props;
  const {id: listId, name: listName, userNames, colorCombination} = data;
  const localStyle = useStyleProcessor(styles, 'ListCard');
  const navigation = useNavigation();
  const listCardRef = useRef(null);

  const onListPress = useCallback(() => {
    navigation.navigate(ScreenName.ListTweetsScreen, {
      listId,
      listName,
      listUserNames: userNames,
    });
  }, [listId, listName, navigation, userNames]);

  const onListRemove = useCallback(() => {
    listService()
      .removeList(listId)
      .then(() => {
        onListRemoved();
        Toast.show({
          type: ToastType.Success,
          text1: 'Removed list.',
        });
      })
      .catch(() => {
        Toast.show({
          type: ToastType.Error,
          text1: 'Error in removing list.',
        });
      });
  }, [listId, onListRemoved]);

  const listIntials = getInitialsFromName(listName);
  const getDescriptionText = useCallback(() => {
    if (userNames.length === 0) {
      return 'includes no one yet 😢';
    } else if (userNames.length === 1) {
      return `includes @${userNames[0]}`;
    } else if (userNames.length === 2) {
      return `includes @${userNames[0]} & @${userNames[1]}`;
    } else {
      return `includes @${userNames[0]}, @${userNames[1]} & ${
        userNames.length - 2
      } others`;
    }
  }, [userNames]);

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
    };
  }, [
    colorCombination,
    localStyle.listIconStyle,
    localStyle.listIconTextStyle,
  ]);

  const onLongPress = useCallback(() => {
    listCardRef.current.setNativeProps({
      useNativeDriver: true,
    });
    listCardRef.current.animate('pulse');
    onCardLongPress();
  }, [onCardLongPress]);

  return (
    <Animatable.View ref={listCardRef}>
      <AppleStyleSwipeableRow
        enabled={enableSwipe}
        rightActionsArray={[
          {
            actionName: 'Remove',
            color: colors.BitterSweet,
            onPress: () => {
              listCardRef.current.setNativeProps({
                useNativeDriver: true,
              });
              listCardRef.current.animate('bounceOutLeft').then(() => {
                onListRemove();
              });
            },
          },
        ]}
        shouldRenderRightAction={true}>
        <TouchableWithoutFeedback
          onPress={onListPress}
          onLongPress={onLongPress}
          disabled={enableSwipe}>
          <View style={localStyle.container}>
            <View style={localStyle.cardDetailContainer}>
              <View style={listIconStyle.backgroundStyle}>
                <Text style={listIconStyle.textStyle}>
                  {listIntials.substring(0, 2)}
                </Text>
              </View>
              <View>
                <Text style={localStyle.listNameStyle}>{listName}</Text>
                <Text style={localStyle.descriptionTextStyle}>
                  {getDescriptionText()}
                </Text>
              </View>
            </View>
            {enableSwipe ? (
              <Image source={SwipeIcon} style={localStyle.swipeIconStyle} />
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
  listNameStyle: {
    color: colors.Black,
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
  },
  descriptionTextStyle: {
    color: colors.BlackPearl,
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
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
};

export default React.memo(ListCard);

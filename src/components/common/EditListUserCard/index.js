import React, {useRef, useMemo} from 'react';
import {Image, View, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {SwipeIcon, UserIcon} from '../../../assets/common';
import colors, {getColorWithOpacity} from '../../../constants/colors';
import fonts from '../../../constants/fonts';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {getRandomColorCombination} from '../../../utils/RandomColorUtil';
import {fontPtToPx, layoutPtToPx} from '../../../utils/responsiveUI';
import AppleStyleSwipeableRow from '../../AppleStyleSwipeableRow';

function EditListUserCard(props) {
  const {userData, onMemberRemove} = props;
  const localStyle = useStyleProcessor(styles, 'EditListUserCard');
  const viewRef = useRef(null);

  const userProfileImageStyle = useMemo(() => {
    const _colorCombination = getRandomColorCombination();
    return {
      background: [
        localStyle.userIconViewStyle,
        {backgroundColor: _colorCombination?.backgroundColor},
      ],
      icon: [
        localStyle.userIconStyle,
        {tintColor: _colorCombination?.textColor},
      ],
    };
  }, [localStyle.userIconStyle, localStyle.userIconViewStyle]);

  return (
    <Animatable.View ref={viewRef} key={userData?.username}>
      <AppleStyleSwipeableRow
        enabled={true}
        rightActionsArray={[
          {
            actionName: 'Remove',
            color: colors.BitterSweet,
            onPress: () => {
              viewRef.current.setNativeProps({
                useNativeDriver: true,
              });
              viewRef.current.animate('bounceOutLeft').then(() => {
                onMemberRemove?.(userData?.username);
              });
            },
          },
        ]}
        textStyle={localStyle.removeButtonStyle}
        shouldRenderRightAction={true}>
        <View style={localStyle.cardStyle}>
          <View style={localStyle.cardDetailContainer}>
            {userData?.blocked ? (
              <View style={userProfileImageStyle.background}>
                <Image source={UserIcon} style={userProfileImageStyle.icon} />
              </View>
            ) : (
              <Image
                source={{uri: userData.profile_image_url}}
                style={localStyle.imageStyle}
              />
            )}

            <View style={localStyle.cardNameContainer}>
              <Text style={localStyle.nameText} numberOfLines={1}>
                {userData?.blocked ? 'User unavailable' : userData.name}
              </Text>
              <Text style={localStyle.userNameText}>@{userData.username}</Text>
            </View>
          </View>
          <Image source={SwipeIcon} style={localStyle.swipeIconStyle} />
        </View>
      </AppleStyleSwipeableRow>
    </Animatable.View>
  );
}

const styles = {
  removeButtonStyle: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.White,
  },
  cardStyle: {
    flexDirection: 'row',
    paddingBottom: layoutPtToPx(13),
    borderBottomWidth: 1,
    borderBottomColor: colors.BlackPearl20,
    marginHorizontal: layoutPtToPx(20),
    marginTop: layoutPtToPx(18),
    justifyContent: 'space-between',
  },
  cardDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    borderRadius: layoutPtToPx(20),
    marginRight: layoutPtToPx(8),
  },
  cardNameContainer: {width: '80%'},
  nameText: {
    color: colors.Black,
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
  },
  userNameText: {
    color: colors.BlackPearl,
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
  },
  swipeIconStyle: {
    height: layoutPtToPx(8),
    width: layoutPtToPx(16),
    alignSelf: 'center',
  },
  blockedUserImage: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    borderRadius: layoutPtToPx(20),
    marginRight: layoutPtToPx(8),
    backgroundColor: getColorWithOpacity(colors.GoldenTainoi, 0.2),
  },
  userIconViewStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    marginRight: layoutPtToPx(8),
    borderRadius: layoutPtToPx(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconStyle: {
    height: layoutPtToPx(23),
    width: layoutPtToPx(20),
  },
};

export default React.memo(EditListUserCard);

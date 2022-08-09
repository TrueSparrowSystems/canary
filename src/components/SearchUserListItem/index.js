import {Image, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {verifiedIcon} from '../../assets/common';
import useSearchUserListItemData from './useSearchUserListItemData';

function SearchUserListItem(props) {
  const {userName, fullName, profileImageUrl, isVerified} = props;

  const {oAddButtonData} = useSearchUserListItemData(props);

  const localStyle = useStyleProcessor(styles, 'SearchUserListItem');

  return (
    <View style={localStyle.cardStyle}>
      <View style={localStyle.cardDetailContainer}>
        <Image source={{uri: profileImageUrl}} style={localStyle.imageStyle} />
        <View style={localStyle.cardNameContainer}>
          <Text style={localStyle.nameText} numberOfLines={1}>
            {fullName}
          </Text>
          <View style={localStyle.flexRow}>
            <Text style={localStyle.userNameText}>@{userName}</Text>
            {isVerified ? <Image source={verifiedIcon} /> : null}
          </View>
        </View>
      </View>
      <View style={localStyle.addButtonContainer}>
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
      </View>
    </View>
  );
}

export default React.memo(SearchUserListItem);

const styles = {
  cardStyle: {
    flexDirection: 'row',
    paddingBottom: layoutPtToPx(13),
    borderBottomWidth: 1,
    borderBottomColor: colors.BlackPearl20,
    marginHorizontal: layoutPtToPx(20),
    marginTop: layoutPtToPx(18),
    justifyContent: 'space-between',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetailContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    borderRadius: layoutPtToPx(20),
    marginRight: layoutPtToPx(8),
  },
  cardNameContainer: {
    width: '80%',
  },
  addButtonContainer: {
    justifyContent: 'center',
    flexGrow: 1,
  },
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
    marginRight: layoutPtToPx(4),
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
};

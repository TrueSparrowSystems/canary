import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {SwipeIcon} from '../../assets/common';
import Header from '../../components/common/Header';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useEditListUsersScreenData from './useEditListUsersScreenData';

function EditListUsersScreen(props) {
  const {listId, listUserNames, onDonePress} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'EditListUsersScreen');
  const navigation = useNavigation();

  const {bIsLoading, aListMembers, fnOnMemberRemove} =
    useEditListUsersScreenData(listId, listUserNames);
  const RightAction = username => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={localStyle.rightActionContainer}
        onPress={() => fnOnMemberRemove(username)}>
        <Text style={localStyle.rightActionText}>Remove</Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView>
      <Header
        text="Edit List"
        textStyle={localStyle.headerText}
        enableRightButton={true}
        rightButtonText={'Done'}
        rightButtonTextStyle={localStyle.headerRightButtonText}
        onRightButtonClick={() => {
          navigation.goBack();
          onDonePress();
        }}
      />
      {bIsLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView style={localStyle.listView}>
          {aListMembers.map(listMember => {
            return (
              <Swipeable
                key={listMember.id}
                renderRightActions={() => RightAction(listMember.username)}>
                <View style={localStyle.cardStyle}>
                  <View style={localStyle.cardDetailContainer}>
                    <Image
                      source={{uri: listMember.profile_image_url}}
                      style={localStyle.imageStyle}
                    />
                    <View>
                      <Text style={localStyle.nameText}>{listMember.name}</Text>
                      <Text style={localStyle.userNameText}>
                        @{listMember.username}
                      </Text>
                    </View>
                  </View>
                  <Image source={SwipeIcon} style={localStyle.swipeIconStyle} />
                </View>
              </Swipeable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
const styles = {
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
  },
  headerRightButtonText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    color: colors.GoldenTainoi,
  },
  listView: {marginBottom: layoutPtToPx(50), height: '100%'},
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
  },
  imageStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    borderRadius: layoutPtToPx(20),
    marginRight: layoutPtToPx(8),
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
};

export default React.memo(EditListUsersScreen);

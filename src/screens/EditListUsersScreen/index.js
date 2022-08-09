import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {AddIcon, SwipeIcon} from '../../assets/common';
import Header from '../../components/common/Header';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useEditListUsersScreenData from './useEditListUsersScreenData';
import AppleStyleSwipeableRow from '../../components/AppleStyleSwipeableRow';
import * as Animatable from 'react-native-animatable';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';

function EditListUsersScreen(props) {
  const {listId, listUserNames, onDonePress} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'EditListUsersScreen');
  const navigation = useNavigation();

  const viewRef = useRef(null);

  const {bIsLoading, aListMembers, fnOnMemberRemove, fnOnRefresh} =
    useEditListUsersScreenData(listId, listUserNames);

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <Header
          text="Edit List"
          textStyle={localStyle.headerText}
          enableLeftButton={true}
          leftButtonText={'Add'}
          leftButtonImage={AddIcon}
          leftButtonImageStyle={localStyle.addIconStyle}
          onLeftButtonClick={() => {
            LocalEvent.emit(EventTypes.ShowSearchUserModal, {
              listId: listId,
              onUserAddComplete: fnOnRefresh,
            });
          }}
          enableRightButton={true}
          rightButtonText={'Done'}
          leftButtonTextStyle={localStyle.headerRightButtonText}
          rightButtonTextStyle={localStyle.headerRightButtonText}
          onRightButtonClick={() => {
            navigation.goBack();
            onDonePress();
          }}
        />
        {bIsLoading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView
            style={localStyle.listView}
            refreshControl={
              <RefreshControl refreshing={bIsLoading} onRefresh={fnOnRefresh} />
            }>
            {aListMembers.map(listMember => {
              return (
                <Animatable.View ref={viewRef} key={listMember.username}>
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
                            fnOnMemberRemove(listMember.username);
                          });
                        },
                      },
                    ]}
                    textStyle={localStyle.removeButtonStyle}
                    shouldRenderRightAction={true}>
                    <View style={localStyle.cardStyle}>
                      <View style={localStyle.cardDetailContainer}>
                        <Image
                          source={{uri: listMember.profile_image_url}}
                          style={localStyle.imageStyle}
                        />
                        <View style={localStyle.cardNameContainer}>
                          <Text style={localStyle.nameText} numberOfLines={1}>
                            {listMember.name}
                          </Text>
                          <Text style={localStyle.userNameText}>
                            @{listMember.username}
                          </Text>
                        </View>
                      </View>
                      <Image
                        source={SwipeIcon}
                        style={localStyle.swipeIconStyle}
                      />
                    </View>
                  </AppleStyleSwipeableRow>
                </Animatable.View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = {
  container: {height: '100%', backgroundColor: colors.White},
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
    alignItems: 'center',
  },
  imageStyle: {
    height: layoutPtToPx(40),
    width: layoutPtToPx(40),
    borderRadius: layoutPtToPx(20),
    marginRight: layoutPtToPx(8),
  },
  cardNameContainer: {width: '80%'},
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
  removeButtonStyle: {
    fontFamily: fonts.InterSemiBold,
    fontSize: fontPtToPx(12),
    lineHeight: layoutPtToPx(15),
    color: colors.White,
  },
  addIconStyle: {
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
    tintColor: colors.GoldenTainoi,
    marginRight: layoutPtToPx(4),
  },
};

export default React.memo(EditListUsersScreen);

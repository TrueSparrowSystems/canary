import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, SafeAreaView, ScrollView, View} from 'react-native';
import {AddIcon} from '../../assets/common';
import Header from '../../components/common/Header';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useEditListUsersScreenData from './useEditListUsersScreenData';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import EditListUserCard from '../../components/common/EditListUserCard';
import {RefreshControl} from '@plgworks/applogger';

function EditListUsersScreen(props) {
  const {listId, onDonePress} = props?.route?.params;
  const localStyle = useStyleProcessor(styles, 'EditListUsersScreen');
  const navigation = useNavigation();

  const {bIsLoading, aListMembers, fnOnMemberRemove, fnOnRefresh} =
    useEditListUsersScreenData(listId);

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
          <ActivityIndicator color={colors.GoldenTainoi} />
        ) : (
          <ScrollView
            style={localStyle.listView}
            refreshControl={
              <RefreshControl
                testID={`edit_list_users_screen_list_${listId}`}
                refreshing={bIsLoading}
                onRefresh={fnOnRefresh}
              />
            }>
            {aListMembers?.map(listMember => {
              return (
                <EditListUserCard
                  userData={listMember}
                  onMemberRemove={fnOnMemberRemove}
                />
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
    color: colors.BlackPearl,
  },
  headerRightButtonText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    color: colors.GoldenTainoi,
  },
  listView: {marginBottom: layoutPtToPx(50), height: '100%'},
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
  addIconStyle: {
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
    tintColor: colors.GoldenTainoi,
    marginRight: layoutPtToPx(4),
  },
};

export default React.memo(EditListUsersScreen);

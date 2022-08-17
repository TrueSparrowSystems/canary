import {
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
import React, {useMemo} from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import useSearchUserModalData from './useSearchUserModalData';
import CustomModal from '../common/CustomModal';
import colors, {getColorWithOpacity} from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import fonts from '../../constants/fonts';
import SearchBar from '../SearchBar';
import SearchUserListItem from '../SearchUserListItem';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function SearchUserModal() {
  const localStyle = useStyleProcessor(styles, 'SearchUserModal');

  const {
    aUserData,
    bIsVisible,
    bIsSearchBarEmpty,
    oModalData,
    fnCloseModal,
    fnOnSearchPress,
    fnOnQueryChange,
  } = useSearchUserModalData();

  const getBackdrop = useMemo(() => {
    return <View style={localStyle.blur} />;
  }, [localStyle.blur]);

  const screenHeight = useMemo(() => {
    return Dimensions.get('window').height;
  }, []);

  const modalContainerStyle = useMemo(() => {
    return [localStyle.contentContainer, {height: screenHeight / 1.1}];
  }, [localStyle.contentContainer, screenHeight]);

  return (
    <CustomModal
      visible={bIsVisible}
      onHardwareBackButtonPress={fnCloseModal}
      onBackDropPress={fnCloseModal}
      customBackdrop={getBackdrop}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={modalContainerStyle}>
        {/* Header */}
        <View>
          <View style={localStyle.headerButtonContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={fnCloseModal}>
              <Text style={localStyle.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={localStyle.absoluteHeaderTextContainer}>
            <Text style={localStyle.headerText}>Add User</Text>
          </View>
        </View>
        {/* SearchBox */}
        <SearchBar
          placeholderText="Search Users"
          onSearchPressCallback={fnOnSearchPress}
          onQueryChange={fnOnQueryChange}
        />
        {/* User List */}
        {bIsSearchBarEmpty ? (
          <View style={localStyle.listContainer}>
            <Text style={localStyle.emptyListText}>
              🔍 Search users to add to the list
            </Text>
          </View>
        ) : aUserData.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={localStyle.scrollViewContainerStyle}>
            {aUserData.map(item => {
              return (
                <SearchUserListItem
                  key={item.screen_name}
                  userName={item.screen_name}
                  fullName={item.name}
                  profileImageUrl={item.profile_image_url_https}
                  isVerified={item.verified}
                  listId={oModalData?.listId}
                />
              );
            })}
          </ScrollView>
        ) : (
          <View style={localStyle.listContainer}>
            <Text style={localStyle.emptyListText}>No Result Found</Text>
          </View>
        )}
      </KeyboardAwareScrollView>
    </CustomModal>
  );
}

export default React.memo(SearchUserModal);

const styles = {
  contentContainer: {
    backgroundColor: colors.White,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: layoutPtToPx(14),
    borderTopRightRadius: layoutPtToPx(14),
    paddingTop: layoutPtToPx(20),
  },
  doneButtonText: {
    fontFamily: fonts.SoraSemiBold,
    color: colors.GoldenTainoi,
    fontSize: fontPtToPx(14),
    marginRight: layoutPtToPx(20),
  },
  headerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: layoutPtToPx(20),
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    color: colors.BlackPearl,
    fontSize: fontPtToPx(16),
  },
  absoluteHeaderTextContainer: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: getColorWithOpacity(colors.BlackPearl, 0.5),
  },
  emptyListText: {
    fontFamily: fonts.InterRegular,
    color: getColorWithOpacity(colors.BlackPearl, 0.7),
    fontSize: fontPtToPx(14),
  },
  listContainer: {
    marginHorizontal: layoutPtToPx(20),
    marginTop: layoutPtToPx(20),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainerStyle: {
    paddingBottom: layoutPtToPx(25),
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  emptyContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyScreenTextStyle: {
    fontFamily: fonts.InterRegular,
    fontSize: fontPtToPx(14),
    lineHeight: layoutPtToPx(17),
    color: getColorWithOpacity(colors.BlackPearl, 0.7),
  },
};

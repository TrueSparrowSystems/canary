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

function SearchUserModal() {
  const localStyle = useStyleProcessor(styles, 'SearchUserModal');

  const {
    aUserData,
    bIsVisible,
    bIsSearchBarEmpty,
    oModalData,
    fnCloseModal,
    fnOnSearchPress,
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
      onBackDropPress={fnCloseModal}
      customBackdrop={getBackdrop}>
      <View style={modalContainerStyle}>
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
        />
        {/* User List */}
        {bIsSearchBarEmpty ? (
          <View style={localStyle.listContainer}>
            <Text style={localStyle.emptyListText}>
              🔍 Search users to add to the list
            </Text>
          </View>
        ) : (
          <ScrollView>
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
        )}
      </View>
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
};

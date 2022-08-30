import {ActivityIndicator, ScrollView} from 'react-native';
import React from 'react';
import EditListUserCard from '../EditListUserCard';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import colors from '../../../constants/colors';
import useEditUserListData from './useEditUserListData';
import {layoutPtToPx} from '../../../utils/responsiveUI';
import {isEmpty} from 'lodash';
import EmptyScreenComponent from '../EmptyScreenComponent';
import {RefreshControl} from '@plgworks/applogger';

const EditUserList = props => {
  const {onMemberRemove} = props;
  const localStyle = useStyleProcessor(styles, 'EditUserList');

  const {bIsLoading, aListMembers, fnOnRefresh} = useEditUserListData(props);

  return bIsLoading ? (
    <ActivityIndicator color={colors.GoldenTainoi} />
  ) : (
    <ScrollView
      style={localStyle.listView}
      contentContainerStyle={localStyle.listContent}
      refreshControl={
        <RefreshControl
          testID="edit_users_list"
          refreshing={bIsLoading}
          onRefresh={fnOnRefresh}
        />
      }>
      {isEmpty(aListMembers) ? (
        <EmptyScreenComponent descriptionText="No users present in this list" />
      ) : (
        aListMembers?.map(listMember => {
          return (
            <EditListUserCard
              userData={listMember}
              onMemberRemove={() => {
                onMemberRemove?.(listMember?.username);
                fnOnRefresh();
              }}
              key={listMember?.username}
            />
          );
        })
      )}
    </ScrollView>
  );
};

export default React.memo(EditUserList);

const styles = {
  listView: {
    paddingBottom: layoutPtToPx(50),
    height: '100%',
  },
  listContent: {
    paddingBottom: layoutPtToPx(100),
  },
};

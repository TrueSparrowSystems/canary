import {ActivityIndicator, RefreshControl, ScrollView} from 'react-native';
import React from 'react';
import EditListUserCard from '../EditListUserCard';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import colors from '../../../constants/colors';
import useEditUserListData from './useEditUserListData';
import {layoutPtToPx} from '../../../utils/responsiveUI';

const EditUserList = props => {
  const {onMemberRemove} = props;
  const localStyle = useStyleProcessor(styles, 'EditUserList');

  const {bIsLoading, aListMembers, fnOnRefresh} = useEditUserListData(props);

  return bIsLoading ? (
    <ActivityIndicator color={colors.GoldenTainoi} />
  ) : (
    <ScrollView
      style={localStyle.listView}
      refreshControl={
        <RefreshControl refreshing={bIsLoading} onRefresh={fnOnRefresh} />
      }>
      {aListMembers?.map(listMember => {
        return (
          <EditListUserCard
            userData={listMember}
            onMemberRemove={() => {
              onMemberRemove?.();
            }}
          />
        );
      })}
    </ScrollView>
  );
};

export default React.memo(EditUserList);

const styles = {
  listView: {
    marginBottom: layoutPtToPx(50),
    height: '100%',
  },
};

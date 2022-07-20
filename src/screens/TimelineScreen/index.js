import React from 'react';
import {View} from 'react-native';
import TimelineList from '../../components/TimelineList';

function TimelineScreen() {
  return (
    <View style={{flex: 1}}>
      <TimelineList refreshData={false} reloadData={false} />
    </View>
  );
}
export default React.memo(TimelineScreen);

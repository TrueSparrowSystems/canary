import React from 'react';
import {Text, View} from 'react-native';
import Header from '../../components/common/Header';
import colors from '../../constants/colors';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';

function BackupCompletionScreen() {
  const localStyle = useStyleProcessor(styles, 'BackupCompletionScreen');
  return (
    <View style={localStyle.container}>
      <Header testID="backup_completion_screen" enableBackButton={true} />
      <Text>Backup completed</Text>
    </View>
  );
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
};
export default React.memo(BackupCompletionScreen);

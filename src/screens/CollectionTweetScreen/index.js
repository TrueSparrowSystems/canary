import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionTweetList from '../../components/CollectionTweetList';
import Header from '../../components/common/Header';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {layoutPtToPx} from '../../utils/responsiveUI';

function CollectionTweetScreen(props) {
  const localStyle = useStyleProcessor(styles, 'CollectionTweetScreen');
  const {collectionId, collectionName} = props?.route?.params;

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <Header enableBackButton={true} text={collectionName} />
        <CollectionTweetList collectionId={collectionId} />
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    height: '100%',
  },
  headerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layoutPtToPx(20),
    height: layoutPtToPx(50),
    flexDirection: 'row',
    backgroundColor: 'white',
  },
};

export default React.memo(CollectionTweetScreen);

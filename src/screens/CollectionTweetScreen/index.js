import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionTweetList from '../../components/CollectionTweetList';
import Header from '../../components/common/Header';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import fonts from '../../constants/fonts';

function CollectionTweetScreen(props) {
  const localStyle = useStyleProcessor(styles, 'CollectionTweetScreen');
  const {collectionId, collectionName} = props?.route?.params;

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <Header
          enableBackButton={true}
          text={collectionName}
          textStyle={localStyle.headerTextStyle}
        />
        <CollectionTweetList collectionId={collectionId} />
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    height: '100%',
    backgroundColor: colors.White,
  },
  headerTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
    alignSelf: 'center',
  },
};

export default React.memo(CollectionTweetScreen);

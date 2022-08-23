import React, {useCallback} from 'react';
import {Share, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CollectionTweetList from '../../components/CollectionTweetList';
import Header from '../../components/common/Header';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import colors from '../../constants/colors';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import fonts from '../../constants/fonts';
import {collectionService} from '../../services/CollectionService';
import {ShareAppIcon} from '../../assets/common';

function CollectionTweetScreen(props) {
  const localStyle = useStyleProcessor(styles, 'CollectionTweetScreen');
  const {collectionId, collectionName} = props?.route?.params;

  const onExportCollectionPress = useCallback(() => {
    const _collectionService = collectionService();
    _collectionService
      .exportCollection([collectionId])
      .then(res => {
        Share.share({message: res});
      })
      .catch(() => {});
  }, [collectionId]);

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <Header
          enableBackButton={true}
          text={collectionName}
          textStyle={localStyle.headerTextStyle}
          enableRightButton={true}
          rightButtonImage={ShareAppIcon}
          rightButtonImageStyle={localStyle.shareIconStyle}
          onRightButtonClick={onExportCollectionPress}
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
  shareIconStyle: {
    height: layoutPtToPx(25),
    width: layoutPtToPx(25),
    tintColor: colors.GoldenTainoi,
  },
};

export default React.memo(CollectionTweetScreen);

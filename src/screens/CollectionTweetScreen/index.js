import React, {useCallback, useMemo} from 'react';
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
  const {collectionId, collectionName, isImport, tweetIds} =
    props?.route?.params;

  const onExportCollectionPress = useCallback(() => {
    const _collectionService = collectionService();
    _collectionService
      .exportCollection([collectionId])
      .then(res => {
        Share.share({message: res});
      })
      .catch(() => {});
  }, [collectionId]);

  const headerOptions = useMemo(() => {
    const headerData = {
      enableBackButton: true,
      text: collectionName,
      textStyle: localStyle.headerTextStyle,
      enableRightButton: true,
    };
    if (isImport) {
      headerData.rightButtonText = 'Import';
      headerData.rightButtonTextStyle = localStyle.rightButtonTextStyle;
      headerData.onRightButtonClick = () => {
        console.log('----- clicked import archive');
      };
    } else {
      headerData.rightButtonImage = ShareAppIcon;
      headerData.rightButtonImageStyle = localStyle.shareIconStyle;
      headerData.onRightButtonClick = onExportCollectionPress;
    }
    return headerData;
  }, [
    collectionName,
    isImport,
    localStyle.headerTextStyle,
    localStyle.rightButtonTextStyle,
    localStyle.shareIconStyle,
    onExportCollectionPress,
  ]);

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <Header {...headerOptions} />
        {isImport ? (
          <CollectionTweetList tweetIds={tweetIds} />
        ) : (
          <CollectionTweetList collectionId={collectionId} />
        )}
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
  rightButtonTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.GoldenTainoi,
  },
};

export default React.memo(CollectionTweetScreen);

import React, {useCallback, useMemo, useState, useRef, useEffect} from 'react';
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
  const [isCollectionEmpty, setIsCollectionEmpty] = useState(false);

  const _collectionService = collectionService();

  useEffect(() => {
    if (collectionId) {
      _collectionService.isCollectionEmpty(collectionId).then(isEmpty => {
        setIsCollectionEmpty(isEmpty);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]);

  const onExportCollectionPress = useCallback(() => {
    _collectionService
      .exportCollection([collectionId])
      .then(res => {
        Share.share({message: res});
      })
      .catch(() => {});
  }, [_collectionService, collectionId]);

  const headerOptions = useMemo(() => {
    const headerData = {
      enableBackButton: true,
      text: collectionName,
      textStyle: localStyle.headerTextStyle,
    };

    headerData.enableRightButton = !isCollectionEmpty;
    headerData.rightButtonImage = ShareAppIcon;
    headerData.rightButtonImageStyle = localStyle.shareIconStyle;
    headerData.onRightButtonClick = onExportCollectionPress;
    return headerData;
  }, [
    collectionName,
    isCollectionEmpty,
    localStyle.headerTextStyle,
    localStyle.shareIconStyle,
    onExportCollectionPress,
  ]);
  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <Header {...headerOptions} />

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
  rightButtonTextStyle: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.GoldenTainoi,
  },
};

export default React.memo(CollectionTweetScreen);

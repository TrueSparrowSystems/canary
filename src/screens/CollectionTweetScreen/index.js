import React, {useCallback, useMemo, useState, useRef} from 'react';
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
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import Toast from 'react-native-toast-message';
import {ToastPosition, ToastType} from '../../constants/ToastConstants';

function CollectionTweetScreen(props) {
  const localStyle = useStyleProcessor(styles, 'CollectionTweetScreen');
  const {
    collectionId,
    collectionName,
    isImport = false,
    tweetIds,
  } = props?.route?.params;
  const [isImportState, setIsImportState] = useState(isImport);
  const isImportingInProgressRef = useRef(false);

  const _collectionService = collectionService();

  const onExportCollectionPress = useCallback(() => {
    _collectionService
      .exportCollection([collectionId])
      .then(res => {
        Share.share({message: res});
      })
      .catch(() => {});
  }, [_collectionService, collectionId]);

  const onImportCollectionPress = useCallback(() => {
    if (isImportingInProgressRef.current) {
      return;
    }
    isImportingInProgressRef.current = true;
    LocalEvent.emit(EventTypes.CommonLoader.Show);
    _collectionService
      .importCollection({
        name: collectionName,
        tweetIds,
      })
      .then(() => {
        setTimeout(() => {
          setIsImportState(false);
          LocalEvent.emit(EventTypes.CommonLoader.Hide);
          LocalEvent.emit(EventTypes.UpdateCollection);
          Toast.show({
            type: ToastType.Success,
            text1: 'Archive import successful',
            position: ToastPosition.Top,
          });
        }, 2000);
      })
      .catch(err => {
        setTimeout(() => {
          LocalEvent.emit(EventTypes.CommonLoader.Hide);
          Toast.show({
            type: ToastType.Error,
            text1: err,
            position: ToastPosition.Top,
          });
        }, 2000);
      })
      .finally(() => {
        isImportingInProgressRef.current = false;
      });
  }, [_collectionService, collectionName, tweetIds]);

  const headerOptions = useMemo(() => {
    const headerData = {
      enableBackButton: true,
      text: collectionName,
      textStyle: localStyle.headerTextStyle,
      enableRightButton: true,
    };
    if (isImportState) {
      headerData.rightButtonText = 'Import';
      headerData.rightButtonTextStyle = localStyle.rightButtonTextStyle;
      headerData.onRightButtonClick = () => {
        onImportCollectionPress();
      };
    } else {
      headerData.rightButtonImage = ShareAppIcon;
      headerData.rightButtonImageStyle = localStyle.shareIconStyle;
      headerData.onRightButtonClick = onExportCollectionPress;
    }
    return headerData;
  }, [
    collectionName,
    isImportState,
    localStyle.headerTextStyle,
    localStyle.rightButtonTextStyle,
    localStyle.shareIconStyle,
    onExportCollectionPress,
    onImportCollectionPress,
  ]);

  return (
    <SafeAreaView>
      <View style={localStyle.container}>
        <Header {...headerOptions} />
        {isImportState ? (
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

import {ScrollView, View} from 'react-native';
import React from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import Header from '../../components/common/Header';
import {ArchiveIconBig, ImportIcon} from '../../assets/common';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import {isEmpty} from 'lodash';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';
import useImportArchiveScreenData from './useImportArchiveScreenData';
import ImportCollectionCard from '../../components/common/ImportCollectionCard';
import CollectionTweetList from '../../components/CollectionTweetList';

function ImportArchiveScreen(props) {
  const data = props?.route?.params;

  const localStyle = useStyleProcessor(styles, 'ImportArchiveScreen');

  const {
    nSelectedIndex,
    aData,
    fnUpdateSelectedIndex,
    fnOnArchiveTweetRemove,
    fnOnArchiveRemove,
    fnNavigateToHomescreen,
    fnOnImportPress,
  } = useImportArchiveScreenData(data);

  return (
    <View style={localStyle.container}>
      <Header
        enableRightButton={!isEmpty(aData)}
        onRightButtonClick={fnOnImportPress}
        rightButtonImage={ImportIcon}
        rightButtonText="Import"
        rightButtonImageStyle={localStyle.headerRightButtonImage}
        rightButtonTextStyle={localStyle.headerRightButtonText}
        text="Import Archives"
        textStyle={localStyle.headerText}
      />
      {!isEmpty(aData) ? (
        <View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {aData.map((item, index) => {
                return (
                  <ImportCollectionCard
                    collectionName={item?.name}
                    tweetIds={item?.tweetIds}
                    onArchivePress={() => {
                      fnUpdateSelectedIndex(index);
                    }}
                    key={index}
                    isSelected={nSelectedIndex === index}
                    onArchiveRemove={() => {
                      fnOnArchiveRemove(index);
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>
          <CollectionTweetList
            key={nSelectedIndex}
            tweetIds={aData[nSelectedIndex]?.tweetIds}
            onMemberRemove={fnOnArchiveTweetRemove}
            shouldShowBookmarked={true}
            contentContainerStyle={localStyle.tweetListContentContainer}
            emptyScreenComponent={
              <EmptyScreenComponent descriptionText="No tweets present in this archive" />
            }
          />
        </View>
      ) : (
        <EmptyScreenComponent
          emptyImage={ArchiveIconBig}
          descriptionText="No Archive to import"
          buttonText="Go To Home"
          onButtonPress={fnNavigateToHomescreen}
        />
      )}
    </View>
  );
}

export default React.memo(ImportArchiveScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  tweetListContentContainer: {
    paddingBottom: layoutPtToPx(250),
  },
  headerRightButtonImage: {
    tintColor: colors.GoldenTainoi,
    height: layoutPtToPx(14),
    width: layoutPtToPx(14),
    marginRight: layoutPtToPx(6),
  },
  headerRightButtonText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(14),
    color: colors.GoldenTainoi,
  },
  headerText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(20),
    color: colors.BlackPearl,
  },
};

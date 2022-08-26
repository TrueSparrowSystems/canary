import {ScrollView, View} from 'react-native';
import React from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import Header from '../../components/common/Header';
import {ImportIcon, ListIconBig} from '../../assets/common';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EditUserList from '../../components/common/EditUserList';
import useImportListScreenData from './useImportListScreenData';
import MiniListCard from '../../components/common/MiniListCard';
import {isEmpty} from 'lodash';
import EmptyScreenComponent from '../../components/common/EmptyScreenComponent';

function ImportListScreen(props) {
  const data = props?.route?.params;

  const localStyle = useStyleProcessor(styles, 'ImportListScreen');

  const {
    nSelectedIndex,
    aData,
    fnUpdateSelectedIndex,
    fnOnListMemberRemove,
    fnOnListRemove,
    fnNavigateToHomescreen,
  } = useImportListScreenData(data);

  return (
    <View style={localStyle.container}>
      <Header
        enableRightButton={!isEmpty(aData)}
        onRightButtonClick={() => {}}
        rightButtonImage={ImportIcon}
        rightButtonText="Import"
        rightButtonImageStyle={localStyle.headerRightButtonImage}
        rightButtonTextStyle={localStyle.headerRightButtonText}
        text="Import Lists"
        textStyle={localStyle.headerText}
      />
      {!isEmpty(aData) ? (
        <View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {aData.map((item, index) => {
                return (
                  <MiniListCard
                    listName={item?.name}
                    userNames={item?.userNames}
                    onListPress={() => {
                      fnUpdateSelectedIndex(index);
                    }}
                    key={index}
                    isSelected={nSelectedIndex === index}
                    onListRemove={() => {
                      fnOnListRemove(index);
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>
          <View style={localStyle.separator} />
          <EditUserList
            userNames={aData[nSelectedIndex]?.userNames}
            onMemberRemove={fnOnListMemberRemove}
          />
        </View>
      ) : (
        <EmptyScreenComponent
          emptyImage={ListIconBig}
          descriptionText="No Lists to import"
          buttonText="Go To Home"
          onButtonPress={fnNavigateToHomescreen}
        />
      )}
    </View>
  );
}

export default React.memo(ImportListScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  separator: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderBottomColor: colors.BlackPearl20,
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

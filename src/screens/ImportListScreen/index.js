import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import Header from '../../components/common/Header';
import {ImportIcon} from '../../assets/common';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import EditUserList from '../../components/common/EditUserList';
import useImportListScreenData from './useImportListScreenData';

function ImportListScreen(props) {
  const data = props?.route?.params;

  const localStyle = useStyleProcessor(styles, ImportListScreen);

  const {nSelectedIndex, aData, fnUpdateSelectedIndex} =
    useImportListScreenData(data);

  return (
    <View style={localStyle.container}>
      <Header
        enableRightButton={true}
        onRightButtonClick={() => {}}
        rightButtonImage={ImportIcon}
        rightButtonText="Import"
        rightButtonImageStyle={localStyle.headerRightButtonImage}
        rightButtonTextStyle={localStyle.headerRightButtonText}
        text="Import Lists"
        textStyle={localStyle.headerText}
      />
      <ScrollView horizontal={true}>
        {aData.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                fnUpdateSelectedIndex(index);
              }}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <EditUserList
        userNames={aData[nSelectedIndex]?.userNames}
        onMemberRemove={() => {}}
      />
    </View>
  );
}

export default React.memo(ImportListScreen);

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.White,
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

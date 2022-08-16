import React, {useCallback, useMemo} from 'react';
import {Dimensions, FlatList, Image, Text, View} from 'react-native';
import RoundedButton from '../../components/common/RoundedButton';
import colors, {getColorWithOpacity} from '../../constants/colors';
import fonts from '../../constants/fonts';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {fontPtToPx, layoutPtToPx} from '../../utils/responsiveUI';
import useLandingScreenData from './useLandingScreenData';
import {Pagination as PaginationDots} from 'react-native-snap-carousel';
import LottieView from 'lottie-react-native';

function LandingScreen() {
  const localStyle = useStyleProcessor(style, 'LandingScreen');

  const {
    aCarousalData,
    nActiveIndex,
    nWindowWidth,
    fnOnMomentumScrollEnd,
    fnSetFlatListRef,
    fnOnContinuePress,
  } = useLandingScreenData();

  const renderItemStyle = useMemo(
    () => [
      localStyle.renderItemContainer,
      {
        width: nWindowWidth,
      },
    ],
    [localStyle.renderItemContainer, nWindowWidth],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View key={index} style={renderItemStyle}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height / 2,
            }}>
            {item?.imageAsset ? (
              <Image
                source={item?.imageAsset}
                // style={item?.animationStyle}
              />
            ) : item?.animationAsset ? (
              <LottieView
                autoPlay
                loop
                source={item?.animationAsset}
                style={item?.animationStyle}
              />
            ) : null}
          </View>
        </View>
      );
    },
    [renderItemStyle],
  );

  const paginationOptionsObj = useMemo(
    () => ({
      dotColor: colors.GoldenTainoi,
      inactiveDotColor: getColorWithOpacity(colors.Black, 0.2),
      inactiveDotScale: 1,
      containerStyle: localStyle.paginationContainerStyle,
      dotStyle: localStyle.dotStyle,
      dotContainerStyle: localStyle.dotContainerStyle,
    }),
    [
      localStyle.dotContainerStyle,
      localStyle.dotStyle,
      localStyle.paginationContainerStyle,
    ],
  );

  const activeIndexData = useMemo(
    () => aCarousalData[nActiveIndex],
    [aCarousalData, nActiveIndex],
  );

  const buttonOptions = useMemo(() => {
    const data = {
      text: activeIndexData?.buttonText,
    };

    if (activeIndexData?.buttonImage) {
      data.rightImage = activeIndexData.buttonImage;
      data.rightImageStyle = localStyle.continueButtonIcon;
    }

    return data;
  }, [
    activeIndexData.buttonImage,
    activeIndexData.buttonText,
    localStyle.continueButtonIcon,
  ]);

  return (
    <View style={localStyle.container}>
      <View style={localStyle.contentContainer}>
        <FlatList
          ref={fnSetFlatListRef}
          horizontal={true}
          pagingEnabled={true}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          data={aCarousalData}
          onMomentumScrollEnd={fnOnMomentumScrollEnd}
        />
        <PaginationDots
          {...paginationOptionsObj}
          dotsLength={aCarousalData?.length || 0}
          activeDotIndex={nActiveIndex}
          containerStyle={localStyle.paginationDotsContainerStyle}
        />
        <View style={localStyle.continueButtonContainer}>
          <Text
            style={localStyle.primaryText}
            adjustsFontSizeToFit
            numberOfLines={1}>
            {activeIndexData?.primaryText}
          </Text>

          <Text
            style={localStyle.secondaryText}
            adjustsFontSizeToFit
            numberOfLines={2}>
            {activeIndexData?.secondaryText}
          </Text>
          <RoundedButton
            style={localStyle.continueButton}
            textStyle={localStyle.continueButtonText}
            onPress={fnOnContinuePress}
            underlayColor={colors.GoldenTainoi80}
            {...buttonOptions}
          />
        </View>
      </View>
    </View>
  );
}

const style = {
  container: {
    backgroundColor: colors.White,
    justifyContent: 'center',
    flex: 1,
  },
  renderItemContainer: {
    paddingHorizontal: layoutPtToPx(20),
  },
  continueButtonContainer: {
    paddingHorizontal: layoutPtToPx(10),
  },
  continueButton: {
    backgroundColor: colors.GoldenTainoi,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: layoutPtToPx(40),
    borderRadius: layoutPtToPx(25),
    marginTop: layoutPtToPx(10),
  },
  continueButtonText: {
    marginHorizontal: layoutPtToPx(5),
    fontSize: fontPtToPx(14),
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.BlackPearl,
    fontFamily: fonts.SoraSemiBold,
    textTransform: 'capitalize',
  },
  continueButtonIcon: {
    height: layoutPtToPx(12),
    width: layoutPtToPx(16.5),
  },
  primaryText: {
    fontFamily: fonts.SoraSemiBold,
    fontSize: fontPtToPx(32),
    lineHeight: layoutPtToPx(40),
    textAlign: 'center',
    marginVertical: layoutPtToPx(20),
    color: colors.BlackPearl,
  },
  secondaryText: {
    fontFamily: fonts.InterMedium,
    fontSize: fontPtToPx(16),
    lineHeight: layoutPtToPx(24),
    textAlign: 'center',
    marginBottom: layoutPtToPx(16),
    color: colors.BlackPearl,
  },

  paginationContainerStyle: {
    paddingBottom: 0,
  },
  scrollViewContainer: {
    paddingRight: layoutPtToPx(20),
  },
  dotStyle: {
    marginRight: layoutPtToPx(8),
  },
  paginationDotsContainerStyle: {
    paddingVertical: layoutPtToPx(10),
  },
  dotContainerStyle: {
    marginHorizontal: 0,
  },
};
export default React.memo(LandingScreen);

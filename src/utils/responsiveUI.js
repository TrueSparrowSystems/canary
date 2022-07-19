// packages
import {PixelRatio, useWindowDimensions} from 'react-native';

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                               along with the percentage symbol (%).
 * @return {number}              The calculated dp depending on current device's screen width.
 */
const getWidthFunctionFromScreenWidth = screenWidth => {
  return widthPercent => {
    // Parse string percentage input and convert it to number.
    const elemWidth =
      typeof widthPercent === 'number'
        ? widthPercent
        : parseFloat(widthPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
  };
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string} heightPercent The percentage of screen's height that UI element should cover
 *                                along with the percentage symbol (%).
 * @return {number}               The calculated dp depending on current device's screen height.
 */
const getHeightFunctionFromScreenHeight = screenHeight => {
  return heightPercent => {
    // Parse string percentage input and convert it to number.
    const elemHeight =
      typeof heightPercent === 'number'
        ? heightPercent
        : parseFloat(heightPercent);

    // Use PixelRatio.roundToNearestPixel method in order to round the layout
    // size (dp) to the nearest one that correspons to an integer number of pixels.
    return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
  };
};

/**
 * Converts provided font points to pixels.
 * @param points
 * @returns {number}
 */
const fontPtToPx = points => {
  return points;
  //return points / PixelRatio.getFontScale();
};

/**
 * Converts provided layout points to pixels.
 * @param points
 * @returns {number}
 */
const layoutPtToPx = points => {
  return PixelRatio.roundToNearestPixel(points);
};

/**
 * Hook to provide functions to convert width or height in percentage to dp and orientation
 * @returns {{wp2dp: number, hp2dp: number, orientation: string}}
 */
const useOrientationDimension = () => {
  const screenWidth = useWindowDimensions().width;
  const screenHeight = useWindowDimensions().height;
  const orientation = screenWidth < screenHeight ? 'portrait' : 'landscape';
  const aspectRatio = screenWidth / screenHeight;

  return {
    wp2dp: getWidthFunctionFromScreenWidth(screenWidth),
    hp2dp: getHeightFunctionFromScreenHeight(screenHeight),
    orientation,
    aspectRatio: aspectRatio,
  };
};

export {fontPtToPx, layoutPtToPx, useOrientationDimension};

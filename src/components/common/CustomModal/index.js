import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {Portal} from 'react-native-paper';
import {useOrientationState} from '../../../hooks/useOrientation';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import colors from '../../../utils/colors';

/**
 * @param {Boolean} visible Boolean to indicate if the modal is open or not.
 * @param {Object} animationIn Animated style object for in animation.
 * @param {Number} animationDuration In/Out animation duration in milliseconds.
 * @param {Function} onBackDropPress Function to call on backdrop press.
 * @param {Function} onHardwareBackButtonPress Function to call on hardware back button press.
 * @param {String} backdropColor Backdrop color string.
 * @param {JSX} customBackdrop Custom backdrop element.
 * @param {JSX} children Child components of the modal view.
 */
function CustomModal({
  visible,
  animationIn,
  animationDuration,
  onBackDropPress,
  onHardwareBackButtonPress,
  backdropColor,
  customBackdrop,
  children,
  innerContainer,
  shouldUsePortal = false,
}) {
  // Opacity value for the container.
  const opacityOffset = React.useRef(new Animated.Value(0)).current;

  const {orientation} = useOrientationState();
  const screenHeight = useMemo(() => Dimensions.get('screen').height, []);
  // Boolean variable to store if the modal is visible or not.
  const [visibility, setVisibility] = useState(visible);
  const innerContainerOffset = React.useRef(
    new Animated.Value(screenHeight),
  ).current;
  const localStyle = useStyleProcessor(styles, 'CustomModal');

  /**
   * Subscribe to back button press.
   */
  useEffect(() => {
    if (visibility) {
      const onBackPress = () => {
        onHardwareBackButtonPress?.();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => {
        subscription.remove();
      };
    }
  }, [onHardwareBackButtonPress, visibility]);

  const startAnimation = useCallback(
    ({newOpacity, newInnerContainerOffset, onAnimationEnd}) => {
      if (newOpacity !== undefined && newInnerContainerOffset !== undefined) {
        Animated.parallel([
          Animated.timing(opacityOffset, {
            toValue: newOpacity,
            duration: animationDuration || 300,
            useNativeDriver: true,
          }),
          Animated.timing(innerContainerOffset, {
            toValue: newInnerContainerOffset,
            duration: animationDuration || 300,
            useNativeDriver: true,
          }),
        ]).start(isCompleted => {
          onAnimationEnd?.(isCompleted);
        });
      }
    },
    [animationDuration, innerContainerOffset, opacityOffset],
  );

  const onAnimationStop = useCallback(isCompleted => {
    if (isCompleted) {
      setVisibility(false);
    }
  }, []);

  /**
   * Slide in animation for inner container.
   */
  useEffect(() => {
    if (visible) {
      setVisibility(true);

      startAnimation({newOpacity: 1, newInnerContainerOffset: 0});
    } else {
      startAnimation({
        newOpacity: 0,
        newInnerContainerOffset: screenHeight,
        onAnimationEnd: onAnimationStop,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const innerStyle = useMemo(() => {
    if (animationIn === 'none') {
      return {};
    }

    return (
      animationIn || {
        transform: [{translateY: innerContainerOffset}],
      }
    );
  }, [animationIn, innerContainerOffset]);

  const animatedViewStyle = useMemo(
    () => [
      localStyle.backdrop,
      {
        backgroundColor: customBackdrop
          ? colors.Transparent
          : backdropColor || colors.TransparentBlack50,
        opacity: opacityOffset,
      },
    ],
    [backdropColor, customBackdrop, localStyle.backdrop, opacityOffset],
  );

  const innerContainerStyle = useMemo(
    () => [localStyle.innerContainer, innerStyle],
    [innerStyle, localStyle.innerContainer],
  );

  const portalModalContent = useMemo(
    () => (
      <Portal>
        <Animated.View style={animatedViewStyle}>
          {customBackdrop}
        </Animated.View>
        <Animated.View style={innerContainerStyle}>
          <TouchableOpacity
            style={localStyle.backdrop}
            activeOpacity={1}
            onPress={onBackDropPress}
          />
          {children}
        </Animated.View>
      </Portal>
    ),
    [
      animatedViewStyle,
      children,
      customBackdrop,
      innerContainerStyle,
      localStyle.backdrop,
      onBackDropPress,
    ],
  );

  const viewModalContent = useMemo(
    () => (
      <View style={localStyle.container}>
        <Animated.View style={animatedViewStyle}>
          {customBackdrop}
        </Animated.View>
        <Animated.View style={innerContainerStyle}>
          <TouchableOpacity
            style={localStyle.backdrop}
            activeOpacity={1}
            onPress={onBackDropPress}
          />
          {children}
        </Animated.View>
      </View>
    ),
    [
      animatedViewStyle,
      children,
      customBackdrop,
      innerContainerStyle,
      localStyle.backdrop,
      onBackDropPress,
      localStyle.container,
    ],
  );

  return visibility
    ? shouldUsePortal
      ? portalModalContent
      : viewModalContent
    : null;
}
export default React.memo(CustomModal);

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '200%',
    zIndex: 200,
    bottom: 0,
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
};

import {
  BackHandler,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import colors from '../../constants/colors';
import {layoutPtToPx} from '../../utils/responsiveUI';
import {CrossIcon} from '../../assets/common';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import {TouchableOpacity} from '@plgworks/applogger';

const CustomImageViewer = () => {
  const localStyle = useStyleProcessor(styles, 'CustomImageViewer');

  const [isVisible, setIsVisible] = useState(false);
  const imagesArray = useRef([]);
  const imageIndex = useRef(0);
  useEffect(() => {
    const launchModal = payload => {
      setIsVisible(true);
      imagesArray.current = payload?.media;
      imageIndex.current = payload?.imageIndex;
    };

    LocalEvent.on(EventTypes.OpenImageViewer, launchModal);
    return () => {
      LocalEvent.off(EventTypes.OpenImageViewer, launchModal);
    };
  }, []);

  const images = [];
  imagesArray.current.map(image => {
    images.push({url: image?.url});
  });

  /**
   * Subscribe to back button press.
   */
  useEffect(() => {
    if (isVisible) {
      const onBackPress = () => {
        setIsVisible(false);
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
  }, [isVisible]);

  return (
    <Modal visible={isVisible} animationType="slide" hardwareAccelerated={true}>
      <StatusBar hidden={true} />
      <ImageViewer
        index={imageIndex.current}
        renderHeader={() => {
          return (
            <SafeAreaView>
              <View style={localStyle.headerContainer}>
                <TouchableOpacity
                  testID="image_viewer_cross_icon"
                  style={localStyle.crossIconContainer}
                  onPress={() => {
                    setIsVisible(false);
                  }}>
                  <Image source={CrossIcon} style={localStyle.crossIcon} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          );
        }}
        imageUrls={images}
        enableSwipeDown={true}
        onSwipeDown={() => {
          setIsVisible(false);
        }}
        saveToLocalByLongPress={false}
        enablePreload={true}
      />
    </Modal>
  );
};

export default React.memo(CustomImageViewer);

const styles = {
  headerContainer: {
    alignItems: 'flex-end',
    backgroundColor: colors.Black,
    paddingHorizontal: layoutPtToPx(20),
  },
  crossIconContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossIcon: {
    tintColor: 'white',
    height: 25,
    width: 25,
  },
};

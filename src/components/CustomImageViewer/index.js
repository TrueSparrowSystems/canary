import {
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import {EventTypes, LocalEvent} from '../../utils/LocalEvent';
import colors from '../../constants/colors';
import {layoutPtToPx} from '../../utils/responsiveUI';
import {CrossIcon} from '../../assets/common';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';

const CustomImageViewer = () => {
  const localStyle = useStyleProcessor(styles, 'CustomImageViewer');

  const [isVisisble, setIsVisible] = useState(false);
  const array = useRef([]);
  useEffect(() => {
    const open = payload => {
      setIsVisible(true);
      array.current = payload?.media;
    };

    LocalEvent.on(EventTypes.OpenImageViewer, open);
  }, []);

  const images = [];
  array.current.map(image => {
    images.push({url: image?.url});
  });

  return (
    <Modal visible={isVisisble}>
      <StatusBar hidden={true} />
      <SafeAreaView>
        <View style={localStyle.headerContainer}>
          <TouchableOpacity
            style={localStyle.crossIconContainer}
            onPress={() => {
              setIsVisible(false);
            }}>
            <Image source={CrossIcon} style={localStyle.crossIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ImageViewer imageUrls={images} />
    </Modal>
  );
};

export default CustomImageViewer;

const styles = {
  headerContainer: {
    alignItems: 'flex-end',
    backgroundColor: colors.Black,
    paddingHorizontal: layoutPtToPx(20),
    paddingTop: layoutPtToPx(10),
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

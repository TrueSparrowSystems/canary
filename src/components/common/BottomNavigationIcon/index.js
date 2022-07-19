import React from 'react';
import isEqual from 'lodash/isEqual';
import {useStyleProcessor} from '../../../hooks/useStyleProcessor';
import {Image} from 'react-native';

/**
 * @param {Object} style Object containing style info for the component.
 * @param {String} image Image file/url to be displayed.
 */
const BottomNavigationIcon = ({image, style}) => {
  const styles = useStyleProcessor(localStyle, 'BottomNavigationIcon');

  return (
    <Image source={image} resizeMode={'contain'} style={style || styles.img} />
  );
};

const localStyle = {
  img: {
    marginTop: 16,
    marginBottom: 4,
    alignSelf: 'center',
    height: 20,
    width: 20,
    tablet: {
      marginTop: 0,
      marginBottom: 0,
    },
  },
};

const areEqual = (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(BottomNavigationIcon, areEqual);

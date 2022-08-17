import {ErrorToast, InfoToast, SuccessToast} from 'react-native-toast-message';
import React from 'react';
import colors from '../constants/colors';

const toastConfig = {
  success: props => (
    <SuccessToast {...props} style={{borderLeftColor: colors.ScreaminGreen}} />
  ),
  error: props => (
    <ErrorToast {...props} style={{borderLeftColor: colors.BitterSweet}} />
  ),
  info: props => (
    <InfoToast {...props} style={{borderLeftColor: colors.GoldenTainoi}} />
  ),
};

export default toastConfig;

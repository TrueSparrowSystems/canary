import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
const isTablet = DeviceInfo.isTablet();

export default function useLockOrientationForMobile() {
  !isTablet && Orientation.lockToPortrait();
}

import React from 'react';
import {View} from 'react-native';
import {useStyleProcessor} from '../../hooks/useStyleProcessor';
import Header from '../../components/common/Header';
import colors from '../../constants/colors';
import PdfViewer from 'react-native-pdf';
import {ActivityIndicator} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {ToastType} from '../../constants/ToastConstants';

function InAppPdfViewerScreen(props) {
  const {pdfUrl} = props.route.params;
  const localStyle = useStyleProcessor(styles, 'InAppPdfViewerScreen');

  return (
    <View style={localStyle.container}>
      <Header enableBackButton={true} />
      <PdfViewer
        trustAllCerts={false}
        source={{
          uri: pdfUrl,
          cache: true,
        }}
        renderActivityIndicator={() => {
          return <ActivityIndicator color={colors.GoldenTainoi} />;
        }}
        onError={() => {
          Toast.show({
            type: ToastType.Error,
            text1: 'Failed to Load PDF',
          });
        }}
        style={localStyle.fullScreen}
      />
    </View>
  );
}

export default React.memo(InAppPdfViewerScreen);

const styles = {
  container: {flex: 1, backgroundColor: colors.White},
  fullScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.White,
  },
};

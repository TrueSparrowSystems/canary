import base64 from 'react-native-base64';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import firebase from '@react-native-firebase/app';
import {Constants} from '../constants/Constants';
import url from 'url';

export async function getExportURL(exportData) {
  return new Promise((resolve, reject) => {
    const encodedData = base64.encode(JSON.stringify(exportData));
    dynamicLinks()
      .buildShortLink(
        {
          link: `${Constants.DeepLinkUrl}?query=${encodedData}`,
          domainUriPrefix: Constants.DeepLinkUrl,
          android: {
            // TODO: See if we can get this using some function?
            packageName: 'com.personalized_twitter',
          },
        },
        firebase.dynamicLinks.ShortLinkType.DEFAULT,
      )
      .then(url => {
        return resolve(url);
      })
      .catch(err => {
        return reject(err);
      });
  });
}
export function getImportData(importUrl) {
  const encodedImportData = decodeURIComponent(importUrl);
  const queryParams = url.parse(encodedImportData, true)?.query;
  if (queryParams?.query) {
    const importData = JSON.parse(base64.decode(queryParams.query));
    return importData;
  }
  return {
    error: true,
    message: 'Invalid import url',
  };
}

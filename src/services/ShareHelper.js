import dynamicLinks from '@react-native-firebase/dynamic-links';
import firebase from '@react-native-firebase/app';
import {Constants} from '../constants/Constants';
import URL from 'url';

export async function getExportURL(exportData) {
  return new Promise((resolve, reject) => {
    const JsonData = JSON.stringify(exportData);
    dynamicLinks()
      .buildShortLink(
        {
          link: `${Constants.DeepLinkUrl}?query=${JsonData}`,
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
  const queryParams = URL.parse(encodedImportData, true)?.query;
  if (queryParams?.query) {
    const importData = JSON.parse(queryParams?.query);
    return importData;
  }
  return {
    error: true,
    message: 'Invalid import url',
  };
}

export async function resolveAndGetImportData(importUrl) {
  return new Promise((resolve, reject) => {
    dynamicLinks()
      .resolveLink(importUrl)
      .then(response => {
        const importData = getImportData(response?.url);
        if (importData?.error) {
          return reject();
        }
        return resolve(importData);
      })
      .catch(() => {
        return reject();
      });
  });
}

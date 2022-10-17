import dynamicLinks from '@react-native-firebase/dynamic-links';
import firebase from '@react-native-firebase/app';
import {Constants} from '../constants/Constants';
import URL from 'url';
import axios from 'axios';

export async function getExportURL(exportData) {
  return new Promise((resolve, reject) => {
    const JsonData = JSON.stringify(exportData);

    axios
      .post(
        `${Constants.ShortLinkUrl}?key=${firebase?.app?.()?.options?.apiKey}`,
        {
          dynamicLinkInfo: {
            link: `${Constants.DeepLinkUrl}?query=${JsonData}`,
            domainUriPrefix: Constants.DeepLinkUrl,
            androidInfo: {
              androidPackageName: Constants.BundleId,
            },
            iosInfo: {
              iosBundleId: Constants.BundleId,
            },
          },
        },
      )
      .then(res => {
        return resolve(res.data.shortLink);
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
    try {
      const importData = JSON.parse(queryParams?.query);
      return importData;
    } catch (e) {
      return {
        error: true,
        message: 'Import Failed. Please try again with different URL',
      };
    }
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

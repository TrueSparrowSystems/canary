import base64 from 'react-native-base64';

export function getExportURL(exportData) {
  const encodedData = base64.encode(JSON.stringify(exportData));
  const exportUrl = `https://https://plgworkscanary.page.link/${encodedData}`;
  return exportUrl;
}
export function getImportData(importUrl) {
  const encodedImportData = importUrl;
  const importData = JSON.parse(base64.decode(encodedImportData));
  return importData;
}

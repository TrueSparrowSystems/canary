import TwitterAPI from '../api/helpers/TwitterAPI';
import {Constants} from '../constants/Constants';
import Cache from '../services/Cache';
import {CacheKey} from '../services/Cache/CacheStoreConstants';

export function setCountriesWoeidsInCache() {
  const countryWoeids = {};
  TwitterAPI.getAvailableWoeids()
    .then(res => {
      const availableWoeids = res.data;
      availableWoeids.map(woeid => {
        if (woeid.parentid === 0 || woeid.parentid === 1) {
          countryWoeids[woeid.name] = woeid;
        }
      });
      Cache.setValue(CacheKey.AvailableWoeidsList, countryWoeids);
    })
    .catch(() => {});
}

export function getTrendingTopicsForCountry(countryName = 'Worldwide') {
  return new Promise((resolve, reject) => {
    const availableWoeids = Cache.getValue(CacheKey.AvailableWoeidsList);
    const countryWoeidData =
      availableWoeids?.[countryName] || Constants.WorldWideWoeidData;
    const countryWoeid = countryWoeidData.woeid;
    TwitterAPI.getTrendsFromWoeid(countryWoeid)
      .then(res => {
        const trendsArray = res.data[0].trends;
        const trendingTopicArray = [];
        trendsArray.map(trend => {
          trendingTopicArray.push(trend.name);
        });
        resolve(trendingTopicArray);
      })
      .catch(err => {
        reject(err);
      });
  });
}

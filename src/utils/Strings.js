import {isNull, isUndefined} from 'lodash-es';

export function replace(str, obj) {
  let result = str;
  if (obj && !!str) {
    Object.entries(obj).forEach(([key, value]) => {
      if (!!key && !isNull(value) && !isUndefined(value)) {
        result = result.replace(`{{${key}}}`, value);
      }
    });
  }

  return result;
}

export const SORT_TYPE = {
  Asc: 'asc',
  Desc: 'desc',
};

export function compareFunction(string1, string2, sortType = SORT_TYPE.Asc) {
  if (string1 > string2) {
    return sortType === SORT_TYPE.Asc ? 1 : -1;
  } else if (string1 < string2) {
    return sortType === SORT_TYPE.Asc ? -1 : 1;
  }
  return 0;
}

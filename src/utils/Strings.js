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

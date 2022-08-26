import {useCallback} from 'react';

function useMiniListCardData({userNames}) {
  const getDescriptionText = useCallback(() => {
    if (userNames.length === 0) {
      return 'includes no one yet 😢';
    } else if (userNames.length === 1) {
      return `includes @${userNames[0]}`;
    } else {
      return `includes ${userNames.length} members`;
    }
  }, [userNames]);

  return {
    fnGetDescriptionText: getDescriptionText,
  };
}
export default useMiniListCardData;

import {colorCombination} from '../constants/colors';

export const getRandomColorCombination = (theme = 'light') => {
  const colorCombinationArray = colorCombination[theme];
  const randomIndex = Math.floor(Math.random() * colorCombinationArray.length);
  return colorCombinationArray[randomIndex];
};

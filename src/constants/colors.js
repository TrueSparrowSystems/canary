const colors = {
  DodgerBlue: '#1DA1F2',
  Mandy: '#EF515A',
  White: '#FFFFFF',
  SherpaBlue: '#003C43',
  SherpaBlue70: '#003C43B3',
  MandyShade: '#D9444D',
  Black: '#000000',
  Gothic20: '#65898D33',
  Gothic: '#65898D',
  Transparent: '#FFFFFF00',
  LightGrey: '#D1D1D1',
  CuriousBlue: '#2980B9',
  GoldenTainoi: '#FEC244',
  GoldenTainoi80: '#FEC244CC',
  GoldenTainoi20: '#FEC24433',
  BlackPearl: '#141819',
  BlackPearl20: '#14181933',
  BlackPearl50: '#14181980',
};
export default colors;

export function getColorWithOpacity(color, opacity) {
  if (color?.length !== 6) {
    return colors.Black;
  }

  if (opacity === 1) {
    return color;
  }

  var aRgbHex = this.match(/.{1,2}/g);
  var aRgb = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16),
  ];

  return `rgba(${aRgb[0]},${aRgb[1]},${aRgb[2]},${opacity})`;
}

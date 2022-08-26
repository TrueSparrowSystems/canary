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
  CornField: '#FFFBBE',
  KourniKova: '#FED05B',
  OxfordBlue: '#2B2F30',
  Grandis: '#FED56B',
  SweetCorn: '#FEE077',
  BitterSweet: '#FF6363',
  EarlyDawn: '#FFF3da',
  ScreaminGreen: '#80FE44',
  Niagara: '#33B498',
};

export default colors;

export function getColorWithOpacity(color, opacity) {
  if (color?.length !== 7) {
    return colors.Black;
  }

  if (opacity === 1) {
    return color;
  }

  if (color.charAt(0) === '#') {
    color = color.slice(1);

    var aRgbHex = color.match(/.{1,2}/g);
    var aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16),
    ];

    return `rgba(${aRgb[0]},${aRgb[1]},${aRgb[2]},${opacity})`;
  }
  return colors.Black;
}

export const colorCombination = {
  light: [
    {textColor: colors.GoldenTainoi, backgroundColor: colors.CornField},
    {textColor: colors.KourniKova, backgroundColor: colors.OxfordBlue},
    {textColor: colors.BlackPearl, backgroundColor: colors.Grandis},
    {textColor: colors.BlackPearl, backgroundColor: colors.SweetCorn},
    {textColor: colors.SweetCorn, backgroundColor: colors.OxfordBlue},
    {textColor: colors.CornField, backgroundColor: colors.GoldenTainoi},
    {textColor: colors.BlackPearl, backgroundColor: colors.GoldenTainoi},
  ],
  dark: [
    {textColor: colors.GoldenTainoi, backgroundColor: colors.CornField},
    {textColor: colors.KourniKova, backgroundColor: colors.OxfordBlue},
    {textColor: colors.BlackPearl, backgroundColor: colors.Grandis},
    {textColor: colors.BlackPearl, backgroundColor: colors.SweetCorn},
    {textColor: colors.SweetCorn, backgroundColor: colors.OxfordBlue},
    {textColor: colors.CornField, backgroundColor: colors.GoldenTainoi},
    {textColor: colors.BlackPearl, backgroundColor: colors.GoldenTainoi},
  ],
};

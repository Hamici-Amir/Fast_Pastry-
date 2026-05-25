export const fonts = {
  poppins: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  cairo: {
    regular: 'Cairo_400Regular',
    medium: 'Cairo_500Medium',
    semiBold: 'Cairo_600SemiBold',
    bold: 'Cairo_700Bold',
  }
};

export const typography = {
  h1: { fontSize: 32, fontFamily: fonts.poppins.bold, lineHeight: 40 },
  h2: { fontSize: 24, fontFamily: fonts.poppins.semiBold, lineHeight: 32 },
  h3: { fontSize: 20, fontFamily: fonts.poppins.semiBold, lineHeight: 28 },
  h4: { fontSize: 18, fontFamily: fonts.poppins.medium, lineHeight: 24 },
  body1: { fontSize: 16, fontFamily: fonts.poppins.regular, lineHeight: 24 },
  body2: { fontSize: 14, fontFamily: fonts.poppins.regular, lineHeight: 20 },
  caption: { fontSize: 12, fontFamily: fonts.poppins.medium, lineHeight: 16 },
  button: { fontSize: 16, fontFamily: fonts.poppins.semiBold, letterSpacing: 0.5 },
};

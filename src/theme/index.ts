import { colors } from './colors';
import { spacing } from './spacing';
import { typography, fonts } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';

export const theme = {
  colors,
  spacing,
  typography,
  fonts,
  radius,
  shadows,
};

export type Theme = typeof theme;

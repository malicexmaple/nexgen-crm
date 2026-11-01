import { type CallOutcome } from 'src/constants/select-options';

export type CallingPalette = {
  text: string;
  secondaryText: string;
  tertiaryText: string;
  border: string;
  card: string;
  subtleBackground: string;
  accent: string;
  success: string;
  successBackground: string;
  warning: string;
  warningBackground: string;
};

const LIGHT_PALETTE: CallingPalette = {
  text: '#1f1f1f',
  secondaryText: '#5c5c5c',
  tertiaryText: '#8c8c8c',
  border: '#e5e5e5',
  card: '#ffffff',
  subtleBackground: '#f7f7f7',
  accent: '#3b5bdb',
  success: '#15803D',
  successBackground: '#ecfdf3',
  warning: '#9a3412',
  warningBackground: '#fff7ed',
};

const DARK_PALETTE: CallingPalette = {
  text: '#ebebeb',
  secondaryText: '#b3b3b3',
  tertiaryText: '#808080',
  border: '#333333',
  card: '#171717',
  subtleBackground: '#1f1f1f',
  accent: '#91a7ff',
  success: '#4ade80',
  successBackground: '#0f2a1a',
  warning: '#fdba74',
  warningBackground: '#2a1a0f',
};

export const getCallingPalette = (colorScheme: 'light' | 'dark'): CallingPalette =>
  colorScheme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

export const OUTCOME_BUTTONS: { outcome: CallOutcome; label: string; color: string }[] = [
  { outcome: 'ANSWERED', label: 'ANSWERED', color: '#15803D' },
  { outcome: 'NO_ANSWER', label: 'NO ANSWER', color: '#DC2626' },
  { outcome: 'NURTURE', label: 'NURTURE', color: '#EA580C' },
  { outcome: 'DNQ', label: 'DNQ – DO NOT QUALIFY', color: '#B91C1C' },
];

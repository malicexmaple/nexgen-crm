import { type ComplexityTier, type SizeTier } from 'src/constants/select-options';

// Starting quotes in the workspace currency; tune these to NEXGEN's real price list.
export const BASE_PRICE_BY_COMPLEXITY: Record<ComplexityTier, number> = {
  BASIC: 1500,
  STANDARD: 3500,
  ADVANCED: 7500,
};

export const PRICE_MULTIPLIER_BY_SIZE: Record<SizeTier, number> = {
  SMALL: 1,
  MEDIUM: 1.5,
  LARGE: 2.5,
};

// Google review counts are the best size signal Places gives us for local businesses.
export const REVIEW_COUNT_THRESHOLDS = {
  medium: 50,
  large: 300,
} as const;

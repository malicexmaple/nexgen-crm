import { REVIEW_COUNT_THRESHOLDS } from 'src/constants/pricing';
import { type SizeTier } from 'src/constants/select-options';

export const getSizeTier = (reviewCount: number | null): SizeTier => {
  const reviews = reviewCount ?? 0;

  if (reviews >= REVIEW_COUNT_THRESHOLDS.large) {
    return 'LARGE';
  }

  if (reviews >= REVIEW_COUNT_THRESHOLDS.medium) {
    return 'MEDIUM';
  }

  return 'SMALL';
};

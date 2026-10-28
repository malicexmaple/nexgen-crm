import {
  BASE_PRICE_BY_COMPLEXITY,
  PRICE_MULTIPLIER_BY_SIZE,
} from 'src/constants/pricing';
import {
  type ComplexityTier,
  type SizeTier,
} from 'src/constants/select-options';

export const estimatePrice = ({
  complexityTier,
  sizeTier,
}: {
  complexityTier: ComplexityTier;
  sizeTier: SizeTier;
}): number => {
  const price =
    BASE_PRICE_BY_COMPLEXITY[complexityTier] *
    PRICE_MULTIPLIER_BY_SIZE[sizeTier];

  return Math.round(price / 100) * 100;
};

import { type SizeTier } from 'src/constants/select-options';

const SIZE_POINTS: Record<SizeTier, number> = {
  SMALL: 10,
  MEDIUM: 25,
  LARGE: 40,
};

// 60 points for how bad the site is, 40 for how much the business can pay.
export const getLeadPriority = ({
  websiteScore,
  sizeTier,
}: {
  websiteScore: number;
  sizeTier: SizeTier;
}): number => {
  const websitePoints = ((10 - websiteScore) / 9) * 60;

  return Math.round(Math.min(100, websitePoints + SIZE_POINTS[sizeTier]));
};

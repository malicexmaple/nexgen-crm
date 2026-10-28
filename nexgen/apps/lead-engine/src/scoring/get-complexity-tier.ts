import { type ComplexityTier } from 'src/constants/select-options';

// Google Places primary types (https://developers.google.com/maps/documentation/places/web-service/place-types).
const ADVANCED_CATEGORY_PATTERN =
  /store|shop|supermarket|car_dealer|hotel|lodging|resort|furniture|jewelry|clothing|electronics|winery|brewery/;
const STANDARD_CATEGORY_PATTERN =
  /restaurant|cafe|coffee|bar|bakery|dentist|doctor|clinic|physiotherap|chiropract|veterinar|hair|beauty|salon|barber|spa|gym|fitness|yoga|real_estate|lawyer|accounting|school|child_care|massage|nail/;

const ECOMMERCE_PATTERN =
  /add to cart|shopping cart|checkout|woocommerce|shopify|bigcommerce|\/cart\b/i;
const BOOKING_PATTERN =
  /book (now|online|an appointment)|appointment|reservation|calendly|opentable|resy\.com|fresha|vagaro|mindbody/i;

const COMPLEXITY_RANK: Record<ComplexityTier, number> = {
  BASIC: 0,
  STANDARD: 1,
  ADVANCED: 2,
};

const maxComplexity = (
  left: ComplexityTier,
  right: ComplexityTier,
): ComplexityTier =>
  COMPLEXITY_RANK[left] >= COMPLEXITY_RANK[right] ? left : right;

// The current site's features set a floor: a business already taking orders online needs a store.
export const getComplexityTier = ({
  category,
  html,
}: {
  category: string | null;
  html: string | null;
}): ComplexityTier => {
  const normalizedCategory = (category ?? '').toLowerCase();

  let tier: ComplexityTier = ADVANCED_CATEGORY_PATTERN.test(normalizedCategory)
    ? 'ADVANCED'
    : STANDARD_CATEGORY_PATTERN.test(normalizedCategory)
      ? 'STANDARD'
      : 'BASIC';

  if (html) {
    if (ECOMMERCE_PATTERN.test(html)) {
      tier = maxComplexity(tier, 'ADVANCED');
    } else if (BOOKING_PATTERN.test(html)) {
      tier = maxComplexity(tier, 'STANDARD');
    }
  }

  return tier;
};

export const SETTING_NAMES = {
  googlePlacesApiKey: 'GOOGLE_PLACES_API_KEY',
  anthropicApiKey: 'ANTHROPIC_API_KEY',
  currencyCode: 'CURRENCY_CODE',
  autoGeneratePitchSites: 'AUTO_GENERATE_PITCH_SITES',
  pitchSiteMaxScore: 'PITCH_SITE_MAX_SCORE',
  pitchSiteModel: 'PITCH_SITE_MODEL',
} as const;

export const DEFAULT_CURRENCY_CODE = 'USD';
export const DEFAULT_PITCH_SITE_MAX_SCORE = 4;
export const DEFAULT_PITCH_SITE_MODEL = 'claude-opus-5-5';

import { defineApplication, FieldType } from 'twenty-sdk/define';

import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_PITCH_SITE_MAX_SCORE,
  DEFAULT_PITCH_SITE_MODEL,
  SETTING_NAMES,
} from 'src/constants/settings';
import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
  APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  author: 'NEXGEN Solutions',
  category: 'Sales',
  applicationVariables: {
    [SETTING_NAMES.googlePlacesApiKey]: {
      universalIdentifier:
        APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.googlePlacesApiKey,
      label: 'Google Places API key',
      description:
        'Google Cloud API key with "Places API (New)" enabled. Used to import businesses from Google Maps.',
      isSecret: true,
    },
    [SETTING_NAMES.anthropicApiKey]: {
      universalIdentifier:
        APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.anthropicApiKey,
      label: 'Anthropic API key',
      description:
        'Claude API key used to build pitch sites. Without it, leads are still scored but no sites are generated.',
      isSecret: true,
    },
    [SETTING_NAMES.currencyCode]: {
      universalIdentifier: APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.currencyCode,
      label: 'Quote currency',
      description: 'ISO currency code for estimated prices, e.g. USD or AUD.',
      isSecret: false,
      value: DEFAULT_CURRENCY_CODE,
    },
    [SETTING_NAMES.autoGeneratePitchSites]: {
      universalIdentifier:
        APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.autoGeneratePitchSites,
      label: 'Auto-build pitch sites',
      description:
        'Build a pitch site automatically for every lead at or below the score threshold. Each site is one Claude API call.',
      type: FieldType.BOOLEAN,
      isSecret: false,
      value: true,
    },
    [SETTING_NAMES.pitchSiteMaxScore]: {
      universalIdentifier:
        APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.pitchSiteMaxScore,
      label: 'Pitch site score threshold',
      description:
        'Leads whose website scores at or below this (1-10) get a pitch site.',
      type: FieldType.NUMBER,
      isSecret: false,
      value: DEFAULT_PITCH_SITE_MAX_SCORE,
    },
    [SETTING_NAMES.pitchSiteModel]: {
      universalIdentifier: APPLICATION_VARIABLE_UNIVERSAL_IDENTIFIERS.pitchSiteModel,
      label: 'Pitch site Claude model',
      description:
        'Claude model that writes pitch sites. claude-sonnet-5-5 is cheaper; claude-opus-5-5 is the most polished.',
      isSecret: false,
      value: DEFAULT_PITCH_SITE_MODEL,
    },
  },
});

import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';

import { SETTING_NAMES } from 'src/constants/settings';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';
import {
  createCompany,
  findExistingGooglePlaceIds,
} from 'src/logic-functions/utils/company-records';
import { isNonEmptyString, isPlainObject } from 'src/logic-functions/utils/guards';
import {
  isOperationalPlace,
  mapPlaceToCompanyData,
} from 'src/logic-functions/utils/map-place-to-company';
import {
  MAX_PLACES_PER_QUERY,
  searchGooglePlaces,
} from 'src/logic-functions/utils/search-google-places';
import { getRequiredSetting } from 'src/logic-functions/utils/settings';

type ScanAreaInput = { query?: unknown; maxResults?: unknown };

const DEFAULT_MAX_RESULTS = 20;

const toScanAreaInput = (
  input: ScanAreaInput | RoutePayload<ScanAreaInput>,
): ScanAreaInput =>
  isPlainObject(input) && 'requestContext' in input
    ? ((input as RoutePayload<ScanAreaInput>).body ?? {})
    : (input as ScanAreaInput);

// Creates one Company per business found; the audit function picks each one up from its created event.
const handler = async (rawInput: ScanAreaInput | RoutePayload<ScanAreaInput>) => {
  const { query, maxResults } = toScanAreaInput(rawInput);

  if (!isNonEmptyString(query)) {
    return {
      success: false,
      message: 'Provide a search like "plumbers in Dallas, TX".',
    };
  }

  const apiKey = getRequiredSetting(
    SETTING_NAMES.googlePlacesApiKey,
    'Google Places API key',
  );
  const places = (
    await searchGooglePlaces({
      apiKey,
      query: query.trim(),
      maxResults: Number(maxResults) || DEFAULT_MAX_RESULTS,
    })
  ).filter(isOperationalPlace);

  const client = new CoreApiClient();
  const existingPlaceIds = await findExistingGooglePlaceIds({
    client,
    googlePlaceIds: places.map((place) => place.id),
  });
  const newPlaces = places.filter((place) => !existingPlaceIds.has(place.id));

  const createdCompanyIds: string[] = [];
  const failures: string[] = [];
  let duplicateWebsites = 0;

  for (const place of newPlaces) {
    try {
      createdCompanyIds.push(
        await createCompany({ client, data: mapPlaceToCompanyData(place) }),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      // Company websites are unique in Twenty; chains often share one, so the business is already a lead.
      if (/duplicate|already exists/i.test(message)) {
        duplicateWebsites += 1;
        continue;
      }

      failures.push(`${place.displayName?.text ?? place.id}: ${message}`);
    }
  }

  return {
    success: failures.length === 0,
    found: places.length,
    created: createdCompanyIds.length,
    alreadyInCrm: places.length - newPlaces.length + duplicateWebsites,
    failures,
    companyIds: createdCompanyIds,
  };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.scanArea.universalIdentifier,
  name: 'scan-area',
  description:
    'Search Google Maps (e.g. "plumbers in Dallas, TX") and add every business found as a lead.',
  timeoutSeconds: 300,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.scanArea.path,
    httpMethod: 'POST',
    isAuthRequired: true,
  },
  workflowActionTriggerSettings: {
    label: 'Find leads on Google Maps',
    icon: 'IconMapSearch',
    inputSchema: [
      {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            label: 'Search (e.g. "dentists in Austin, TX")',
          },
          maxResults: {
            type: 'number',
            label: `Max businesses (1-${MAX_PLACES_PER_QUERY})`,
          },
        },
      },
    ],
    outputSchema: [
      {
        type: 'object',
        properties: {
          success: { type: 'boolean', label: 'Success' },
          found: { type: 'number', label: 'Found' },
          created: { type: 'number', label: 'Added to CRM' },
          alreadyInCrm: { type: 'number', label: 'Already in CRM' },
        },
      },
    ],
  },
});

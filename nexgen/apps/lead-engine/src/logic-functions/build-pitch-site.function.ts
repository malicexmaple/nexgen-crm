import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import { DEFAULT_PITCH_SITE_MODEL, SETTING_NAMES } from 'src/constants/settings';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';
import {
  readLeadCompanies,
  updateCompany,
} from 'src/logic-functions/utils/company-records';
import { extractCompanyIds } from 'src/logic-functions/utils/extract-company-ids';
import {
  getOptionalSetting,
  getRequiredSetting,
} from 'src/logic-functions/utils/settings';
import { fetchBrandKit } from 'src/pitch-site/fetch-brand-kit';
import { fetchGoogleListing } from 'src/pitch-site/fetch-google-listing';
import { generatePitchSiteHtml } from 'src/pitch-site/generate-pitch-site-html';
import {
  buildPitchSiteUrl,
  savePitchSiteHtml,
} from 'src/pitch-site/pitch-site-storage';
import { writeCallOpener } from 'src/pitch-site/write-call-opener';

const STATUSES_TO_ADVANCE = new Set([null, 'NEW', 'AUDITED']);

// Queue target only (see queue-pitch-sites): no trigger of its own.
const handler = async (input: unknown) => {
  const apiKey = getRequiredSetting(
    SETTING_NAMES.anthropicApiKey,
    'Anthropic API key',
  );
  const model =
    getOptionalSetting(SETTING_NAMES.pitchSiteModel) ?? DEFAULT_PITCH_SITE_MODEL;
  const googlePlacesApiKey = getOptionalSetting(SETTING_NAMES.googlePlacesApiKey);
  const client = new CoreApiClient({ runAs: 'application' });
  const companies = await readLeadCompanies({
    client,
    companyIds: extractCompanyIds(input),
  });
  const built: string[] = [];

  for (const company of companies) {
    const [brandKit, googleListing] = await Promise.all([
      fetchBrandKit({
        websiteUrl: company.domainName?.primaryLinkUrl,
        businessName: company.name,
      }),
      googlePlacesApiKey !== null && company.googlePlaceId
        ? fetchGoogleListing({
            apiKey: googlePlacesApiKey,
            googlePlaceId: company.googlePlaceId,
          })
        : { photos: [], reviews: [] },
    ]);

    console.log(
      `Building pitch site for ${company.name ?? company.id}: ` +
        (brandKit === null
          ? 'current website unreadable'
          : `logo ${brandKit.logo === null ? 'missing' : 'found'}, ${brandKit.photos.length} website photos, colours ${brandKit.colors.join(' ') || 'none'}`) +
        `, ${googleListing.photos.length} Google photos, ${googleListing.reviews.length} Google reviews`,
    );

    const [html, callOpener] = await Promise.all([
      generatePitchSiteHtml({
        apiKey,
        model,
        company,
        brandKit,
        googleListing,
      }),
      writeCallOpener({ apiKey, company, reviews: googleListing.reviews }).catch((error) => {
        console.warn(
          'Could not write the call opener:',
          error instanceof Error ? error.message : error,
        );

        return null;
      }),
    ]);

    await savePitchSiteHtml(company.id, html);
    await updateCompany({
      client,
      companyId: company.id,
      data: {
        pitchSiteUrl: {
          primaryLinkUrl: buildPitchSiteUrl(company.id),
          primaryLinkLabel: 'Pitch site',
          secondaryLinks: null,
        },
        ...(callOpener !== null ? { callOpener } : {}),
        ...(STATUSES_TO_ADVANCE.has(company.leadStatus)
          ? { leadStatus: 'PITCH_READY' }
          : {}),
      },
    });
    built.push(company.id);
  }

  return { built };
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.buildPitchSite.universalIdentifier,
  name: 'build-pitch-site',
  description: 'Asks Claude to design a concept site for one Company and stores it.',
  timeoutSeconds: 600,
  handler,
});

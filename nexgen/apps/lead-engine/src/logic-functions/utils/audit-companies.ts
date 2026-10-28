import { CoreApiClient } from 'twenty-client-sdk/core';

import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_PITCH_SITE_MAX_SCORE,
  SETTING_NAMES,
} from 'src/constants/settings';
import {
  type LeadCompany,
  readLeadCompanies,
  updateCompany,
} from 'src/logic-functions/utils/company-records';
import {
  fetchWebsite,
  normalizeWebsiteUrl,
} from 'src/logic-functions/utils/fetch-website';
import { mapWithConcurrency } from 'src/logic-functions/utils/map-with-concurrency';
import {
  getBooleanSetting,
  getNumberSetting,
  getOptionalSetting,
} from 'src/logic-functions/utils/settings';
import { queuePitchSites } from 'src/pitch-site/queue-pitch-sites';
import {
  buildLeadAssessment,
  getStatusAfterAudit,
} from 'src/scoring/build-lead-assessment';

const AUDIT_CONCURRENCY = 6;

type AuditOutcome = {
  companyId: string;
  websiteScore?: number;
  error?: string;
};

const auditCompany = async ({
  client,
  company,
  currencyCode,
}: {
  client: CoreApiClient;
  company: LeadCompany;
  currencyCode: string;
}): Promise<AuditOutcome> => {
  try {
    const websiteUrl = normalizeWebsiteUrl(company.domainName?.primaryLinkUrl);
    const fetchResult = websiteUrl ? await fetchWebsite(websiteUrl) : null;
    const assessment = buildLeadAssessment({
      websiteUrl,
      fetchResult,
      category: company.googleCategory,
      reviewCount: company.googleReviewCount,
      currentYear: new Date().getFullYear(),
    });
    const nextStatus = getStatusAfterAudit(company.leadStatus);

    await updateCompany({
      client,
      companyId: company.id,
      data: {
        websiteScore: assessment.websiteScore,
        websiteIssues: assessment.websiteIssues,
        websiteCheckedAt: new Date().toISOString(),
        sizeTier: assessment.sizeTier,
        complexityTier: assessment.complexityTier,
        estimatedPrice: {
          amountMicros: assessment.estimatedPrice * 1_000_000,
          currencyCode,
        },
        leadPriority: assessment.leadPriority,
        ...(nextStatus ? { leadStatus: nextStatus } : {}),
      },
    });

    return { companyId: company.id, websiteScore: assessment.websiteScore };
  } catch (error) {
    return {
      companyId: company.id,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const auditCompanies = async (companyIds: string[]) => {
  // Runs as the app: database events and queued jobs have no user behind them.
  const client = new CoreApiClient({ runAs: 'application' });
  const companies = await readLeadCompanies({ client, companyIds });
  const currencyCode =
    getOptionalSetting(SETTING_NAMES.currencyCode)?.toUpperCase() ??
    DEFAULT_CURRENCY_CODE;

  const outcomes = await mapWithConcurrency(
    companies,
    AUDIT_CONCURRENCY,
    (company) => auditCompany({ client, company, currencyCode }),
  );

  const pitchSiteMaxScore = getNumberSetting(
    SETTING_NAMES.pitchSiteMaxScore,
    DEFAULT_PITCH_SITE_MAX_SCORE,
  );
  const shouldAutoGenerate =
    getBooleanSetting(SETTING_NAMES.autoGeneratePitchSites, true) &&
    getOptionalSetting(SETTING_NAMES.anthropicApiKey) !== null;
  const companiesWithPitchSite = new Set(
    companies
      .filter((company) => company.pitchSiteUrl?.primaryLinkUrl)
      .map((company) => company.id),
  );
  const pitchSiteCandidates = outcomes
    .filter(
      (outcome) =>
        outcome.websiteScore !== undefined &&
        outcome.websiteScore <= pitchSiteMaxScore &&
        !companiesWithPitchSite.has(outcome.companyId),
    )
    .map((outcome) => outcome.companyId);

  if (shouldAutoGenerate && pitchSiteCandidates.length > 0) {
    await queuePitchSites(pitchSiteCandidates);
  }

  const failed = outcomes.filter((outcome) => outcome.error);
  const summary = {
    requested: companyIds.length,
    audited: outcomes.length - failed.length,
    failed,
    pitchSitesQueued: shouldAutoGenerate ? pitchSiteCandidates.length : 0,
  };

  if (failed.length > 0) {
    console.error('Lead audit failures', JSON.stringify(failed));
  }
  console.log('Lead audit finished', JSON.stringify(summary));

  return summary;
};

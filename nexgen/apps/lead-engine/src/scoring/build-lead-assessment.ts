import {
  type ComplexityTier,
  type LeadStatus,
  type SizeTier,
} from 'src/constants/select-options';
import {
  auditWebsiteHtml,
  type WebsiteFetchResult,
} from 'src/scoring/audit-website-html';
import { estimatePrice } from 'src/scoring/estimate-price';
import { getComplexityTier } from 'src/scoring/get-complexity-tier';
import { getLeadPriority } from 'src/scoring/get-lead-priority';
import { getSizeTier } from 'src/scoring/get-size-tier';

export type LeadAssessment = {
  websiteScore: number;
  websiteIssues: string;
  sizeTier: SizeTier;
  complexityTier: ComplexityTier;
  estimatedPrice: number;
  leadPriority: number;
};

const STATUSES_BEFORE_AUDIT: (LeadStatus | null)[] = [null, 'NEW'];

export const buildLeadAssessment = ({
  websiteUrl,
  fetchResult,
  category,
  reviewCount,
  currentYear,
}: {
  websiteUrl: string | null;
  fetchResult: WebsiteFetchResult | null;
  category: string | null;
  reviewCount: number | null;
  currentYear: number;
}): LeadAssessment => {
  const audit = auditWebsiteHtml({ websiteUrl, fetchResult, currentYear });
  const sizeTier = getSizeTier(reviewCount);
  const complexityTier = getComplexityTier({
    category,
    html: fetchResult?.ok ? fetchResult.html : null,
  });

  return {
    websiteScore: audit.score,
    websiteIssues: audit.issues.join('; '),
    sizeTier,
    complexityTier,
    estimatedPrice: estimatePrice({ complexityTier, sizeTier }),
    leadPriority: getLeadPriority({ websiteScore: audit.score, sizeTier }),
  };
};

// Never move a lead the team is already working backwards to AUDITED.
export const getStatusAfterAudit = (
  currentStatus: LeadStatus | null,
): LeadStatus | null =>
  STATUSES_BEFORE_AUDIT.includes(currentStatus) ? 'AUDITED' : null;

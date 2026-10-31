import { type CoreApiClient } from 'twenty-client-sdk/core';

import { updateCompany } from 'src/logic-functions/utils/company-records';
import { isNonEmptyString } from 'src/logic-functions/utils/guards';

const SAME_VISIT_WINDOW_MS = 30 * 60 * 1000;

// Link previews (iMessage, WhatsApp, Gmail, Outlook) and crawlers fetch the page with nobody looking at it.
const AUTOMATED_USER_AGENT_PATTERN =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|slack|discord|skype|google|bing|headless|lighthouse|curl|wget|python|axios|okhttp|go-http|java\//i;

export const PITCH_SITE_OPEN_HEADERS = ['user-agent', 'sec-fetch-site', 'sec-purpose', 'purpose'];

export const isProspectOpen = (headers: Record<string, string | undefined>): boolean => {
  const userAgent = headers['user-agent'];
  const purpose = `${headers['sec-purpose'] ?? ''} ${headers.purpose ?? ''}`;

  // Pitch sites are served from the CRM's own domain, so same-origin means the team clicked it in the CRM.
  return (
    isNonEmptyString(userAgent) &&
    !AUTOMATED_USER_AGENT_PATTERN.test(userAgent) &&
    headers['sec-fetch-site'] !== 'same-origin' &&
    !/prefetch|prerender/i.test(purpose)
  );
};

type PitchSiteOpenRecord = {
  pitchSiteOpens: number | null;
  pitchSiteLastOpenedAt: string | null;
};

export const recordPitchSiteOpen = async ({
  client,
  companyId,
  openedAt,
}: {
  client: CoreApiClient;
  companyId: string;
  openedAt: Date;
}): Promise<void> => {
  const result = (await client.query({
    companies: {
      __args: { filter: { id: { eq: companyId } }, first: 1 },
      edges: { node: { pitchSiteOpens: true, pitchSiteLastOpenedAt: true } },
    },
  } as never)) as { companies?: { edges?: { node: PitchSiteOpenRecord }[] } };
  const company = result.companies?.edges?.[0]?.node;

  if (company === undefined) {
    return;
  }

  const lastOpenedAt =
    company.pitchSiteLastOpenedAt === null ? null : Date.parse(company.pitchSiteLastOpenedAt);

  if (lastOpenedAt !== null && openedAt.getTime() - lastOpenedAt < SAME_VISIT_WINDOW_MS) {
    return;
  }

  await updateCompany({
    client,
    companyId,
    data: {
      pitchSiteOpens: (company.pitchSiteOpens ?? 0) + 1,
      pitchSiteLastOpenedAt: openedAt.toISOString(),
    },
  });
};

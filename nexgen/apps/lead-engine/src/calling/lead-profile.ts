import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type LeadContact, type LeadProfile } from 'src/calling/calling-api-types';
import { formatFullName } from 'src/calling/calling-records';
import { type LeadStatus } from 'src/constants/select-options';
import { isNonEmptyString } from 'src/logic-functions/utils/guards';

const MAX_CONTACTS = 5;

type PhoneValue = {
  primaryPhoneNumber: string | null;
  primaryPhoneCallingCode: string | null;
} | null;

export type LeadProfileNode = {
  domainName: { primaryLinkUrl: string | null } | null;
  address: {
    addressStreet1: string | null;
    addressStreet2: string | null;
    addressCity: string | null;
    addressState: string | null;
    addressPostcode: string | null;
  } | null;
  googleMapsUrl: { primaryLinkUrl: string | null } | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  googleCategory: string | null;
  websiteScore: number | null;
  websiteIssues: string | null;
  estimatedPrice: { amountMicros: number | null; currencyCode: string | null } | null;
  leadStatus: LeadStatus | null;
  leadPriority: number | null;
  pitchSiteOpens: number | null;
  pitchSiteLastOpenedAt: string | null;
  people?: {
    edges?: {
      node: {
        name: { firstName: string | null; lastName: string | null } | null;
        jobTitle: string | null;
        emails: { primaryEmail: string | null } | null;
        phones: PhoneValue;
      };
    }[];
  };
};

const LEAD_PROFILE_SELECTION = {
  domainName: { primaryLinkUrl: true },
  address: {
    addressStreet1: true,
    addressStreet2: true,
    addressCity: true,
    addressState: true,
    addressPostcode: true,
  },
  googleMapsUrl: { primaryLinkUrl: true },
  googleRating: true,
  googleReviewCount: true,
  googleCategory: true,
  websiteScore: true,
  websiteIssues: true,
  estimatedPrice: { amountMicros: true, currencyCode: true },
  leadStatus: true,
  leadPriority: true,
  pitchSiteOpens: true,
  pitchSiteLastOpenedAt: true,
  people: {
    __args: { first: MAX_CONTACTS, orderBy: [{ createdAt: 'AscNullsFirst' }] },
    edges: {
      node: {
        name: { firstName: true, lastName: true },
        jobTitle: true,
        emails: { primaryEmail: true },
        phones: { primaryPhoneNumber: true, primaryPhoneCallingCode: true },
      },
    },
  },
};

export const formatPhone = (phone: PhoneValue) => {
  const number = phone?.primaryPhoneNumber?.trim() ?? '';

  if (number.length === 0) {
    return { phoneNumber: null, phoneHref: null };
  }

  const phoneNumber = number.startsWith('+')
    ? number
    : `${phone?.primaryPhoneCallingCode ?? ''} ${number}`.trim();

  return { phoneNumber, phoneHref: `tel:${phoneNumber.replace(/[^\d+]/g, '')}` };
};

const toUrl = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim() ?? '';

  if (trimmed.length === 0) {
    return null;
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const toContact = (
  node: NonNullable<NonNullable<LeadProfileNode['people']>['edges']>[number]['node'],
): LeadContact => ({
  name: formatFullName(node.name),
  jobTitle: node.jobTitle?.trim() || null,
  email: node.emails?.primaryEmail?.trim() || null,
  ...formatPhone(node.phones),
});

export const toLeadProfile = (node: LeadProfileNode | null): LeadProfile => {
  const address = node?.address;
  const amountMicros = node?.estimatedPrice?.amountMicros ?? null;
  const currencyCode = node?.estimatedPrice?.currencyCode ?? null;

  return {
    address:
      [
        address?.addressStreet1,
        address?.addressStreet2,
        address?.addressCity,
        address?.addressState,
        address?.addressPostcode,
      ]
        .map((part) => part?.trim())
        .filter(isNonEmptyString)
        .join(', ') || null,
    websiteUrl: toUrl(node?.domainName?.primaryLinkUrl),
    googleMapsUrl: toUrl(node?.googleMapsUrl?.primaryLinkUrl),
    googleRating: node?.googleRating ?? null,
    googleReviewCount: node?.googleReviewCount ?? null,
    businessType: node?.googleCategory?.trim() || null,
    websiteScore: node?.websiteScore ?? null,
    websiteIssues: (node?.websiteIssues ?? '')
      .split(';')
      .map((issue) => issue.trim())
      .filter(isNonEmptyString),
    estimatedPrice:
      amountMicros !== null && isNonEmptyString(currencyCode)
        ? { amount: amountMicros / 1_000_000, currencyCode }
        : null,
    leadStatus: node?.leadStatus ?? null,
    leadPriority: node?.leadPriority ?? null,
    pitchSiteOpens: node?.pitchSiteOpens ?? 0,
    pitchSiteLastOpenedAt: node?.pitchSiteLastOpenedAt ?? null,
    contacts: (node?.people?.edges ?? []).map((edge) => toContact(edge.node)),
  };
};

export const readLeadProfile = async ({
  client,
  companyId,
}: {
  client: CoreApiClient;
  companyId: string;
}): Promise<LeadProfile> => {
  const result = (await client.query({
    companies: {
      __args: { filter: { id: { eq: companyId } }, first: 1 },
      edges: { node: LEAD_PROFILE_SELECTION },
    },
  } as never)) as { companies?: { edges?: { node: LeadProfileNode }[] } };

  return toLeadProfile(result.companies?.edges?.[0]?.node ?? null);
};

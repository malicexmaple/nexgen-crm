import { type CoreApiClient } from 'twenty-client-sdk/core';

import { type LeadStatus } from 'src/constants/select-options';

export type LeadCompany = {
  id: string;
  name: string | null;
  domainName: { primaryLinkUrl: string | null } | null;
  address: {
    addressCity: string | null;
    addressState: string | null;
    addressCountry: string | null;
  } | null;
  phone: { primaryPhoneNumber: string | null; primaryPhoneCallingCode: string | null } | null;
  googlePlaceId: string | null;
  googleCategory: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  websiteScore: number | null;
  websiteIssues: string | null;
  leadStatus: LeadStatus | null;
  pitchSiteUrl: { primaryLinkUrl: string | null } | null;
};

type CompaniesQueryResult = {
  companies?: { edges?: { node: LeadCompany }[] };
};

export const readLeadCompanies = async ({
  client,
  companyIds,
}: {
  client: CoreApiClient;
  companyIds: string[];
}): Promise<LeadCompany[]> => {
  if (companyIds.length === 0) {
    return [];
  }

  const result = (await client.query({
    companies: {
      __args: { filter: { id: { in: companyIds } }, first: companyIds.length },
      edges: {
        node: {
          id: true,
          name: true,
          domainName: { primaryLinkUrl: true },
          address: { addressCity: true, addressState: true, addressCountry: true },
          phone: { primaryPhoneNumber: true, primaryPhoneCallingCode: true },
          googlePlaceId: true,
          googleCategory: true,
          googleRating: true,
          googleReviewCount: true,
          websiteScore: true,
          websiteIssues: true,
          leadStatus: true,
          pitchSiteUrl: { primaryLinkUrl: true },
        },
      },
    },
  } as never)) as CompaniesQueryResult;

  return (result.companies?.edges ?? []).map((edge) => edge.node);
};

export const findExistingGooglePlaceIds = async ({
  client,
  googlePlaceIds,
}: {
  client: CoreApiClient;
  googlePlaceIds: string[];
}): Promise<Set<string>> => {
  if (googlePlaceIds.length === 0) {
    return new Set();
  }

  const result = (await client.query({
    companies: {
      __args: {
        filter: { googlePlaceId: { in: googlePlaceIds } },
        first: googlePlaceIds.length,
      },
      edges: { node: { googlePlaceId: true } },
    },
  } as never)) as {
    companies?: { edges?: { node: { googlePlaceId: string | null } }[] };
  };

  return new Set(
    (result.companies?.edges ?? [])
      .map((edge) => edge.node.googlePlaceId)
      .filter((placeId): placeId is string => placeId !== null),
  );
};

export const createCompany = async ({
  client,
  data,
}: {
  client: CoreApiClient;
  data: Record<string, unknown>;
}): Promise<string> => {
  const result = (await client.mutation({
    createCompany: { __args: { data }, id: true },
  } as never)) as { createCompany?: { id: string } };

  if (!result.createCompany?.id) {
    throw new Error(`Twenty did not return an id for company "${String(data.name)}"`);
  }

  return result.createCompany.id;
};

export const updateCompany = async ({
  client,
  companyId,
  data,
}: {
  client: CoreApiClient;
  companyId: string;
  data: Record<string, unknown>;
}): Promise<void> => {
  await client.mutation({
    updateCompany: { __args: { id: companyId, data }, id: true },
  } as never);
};

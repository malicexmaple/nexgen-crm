import { enqueueJobs } from 'twenty-sdk/logic-function';

import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';

const MAX_JOBS_PER_ENQUEUE = 200;

// One job per company: each Claude call can take minutes, and a job id per company
// stops the same site from being queued twice. A rebuild needs a fresh id, or the
// queue would treat it as the job that already ran.
export const queuePitchSites = async (
  companyIds: string[],
  { rebuild = false }: { rebuild?: boolean } = {},
) => {
  const jobIdSuffix = rebuild ? `-${Date.now()}` : '';

  for (let start = 0; start < companyIds.length; start += MAX_JOBS_PER_ENQUEUE) {
    await enqueueJobs({
      logicFunctionUniversalIdentifier:
        LOGIC_FUNCTIONS.buildPitchSite.universalIdentifier,
      jobs: companyIds
        .slice(start, start + MAX_JOBS_PER_ENQUEUE)
        .map((companyId) => ({
          payload: { companyIds: [companyId] },
          jobId: `pitch-site-${companyId}${jobIdSuffix}`,
        })),
      retryLimit: 1,
    });
  }
};

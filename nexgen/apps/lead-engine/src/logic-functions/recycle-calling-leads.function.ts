import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction } from 'twenty-sdk/define';

import { recycleCallingLeads } from 'src/calling/recycle-calling-leads';
import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';

// Due dates are read from the database on every run, so leads that came due
// during a restart or deploy return on the first run afterwards.
const handler = async () => {
  const result = await recycleCallingLeads({
    client: new CoreApiClient({ runAs: 'application' }),
    now: new Date(),
  });

  if (result.snoozedReturned > 0 || result.nurtureReturned > 0) {
    console.log(
      `Back in Ready to call: ${result.snoozedReturned} snoozed, ${result.nurtureReturned} from Nurture`,
    );
  }

  return result;
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.recycleCallingLeads.universalIdentifier,
  name: 'recycle-calling-leads',
  description: 'Every minute, returns snoozed and Nurture leads whose next call date has passed.',
  timeoutSeconds: 120,
  handler,
  cronTriggerSettings: { pattern: '* * * * *' },
});

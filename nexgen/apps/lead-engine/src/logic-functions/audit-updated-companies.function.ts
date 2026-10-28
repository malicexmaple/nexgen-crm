import {
  defineLogicFunction,
  type ObjectRecordUpdateEvent,
} from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';
import { auditCompanies } from 'src/logic-functions/utils/audit-companies';

const handler = async (
  batch: DatabaseEventBatchPayload<ObjectRecordUpdateEvent<{ id?: string }>>,
) => {
  const companyIds = [
    ...new Set(
      batch.events.map((event) => event.properties.after?.id ?? event.recordId),
    ),
  ];

  return auditCompanies(companyIds);
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.auditUpdatedCompanies.universalIdentifier,
  name: 'audit-updated-companies',
  description: 'Re-scores a Company when its website changes.',
  timeoutSeconds: 900,
  handler,
  // Only the website: the audit itself writes other Company fields and must not re-trigger.
  databaseEventTriggerSettings: {
    eventName: 'company.updated',
    updatedFields: ['domainName'],
    batchMode: true,
  },
});

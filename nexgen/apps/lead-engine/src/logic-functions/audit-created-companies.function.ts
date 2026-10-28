import {
  defineLogicFunction,
  type ObjectRecordCreateEvent,
} from 'twenty-sdk/define';
import { type DatabaseEventBatchPayload } from 'twenty-sdk/logic-function';

import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';
import { auditCompanies } from 'src/logic-functions/utils/audit-companies';

const handler = async (
  batch: DatabaseEventBatchPayload<ObjectRecordCreateEvent<{ id?: string }>>,
) => {
  const companyIds = [
    ...new Set(
      batch.events.map((event) => event.properties.after?.id ?? event.recordId),
    ),
  ];

  return auditCompanies(companyIds);
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.auditCreatedCompanies.universalIdentifier,
  name: 'audit-created-companies',
  description: 'Scores the website, size and price of every new Company.',
  timeoutSeconds: 900,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'company.created',
    batchMode: true,
  },
});

import { isNonEmptyString, isPlainObject } from 'src/logic-functions/utils/guards';

const toIds = (value: unknown): string[] => {
  const values = Array.isArray(value) ? value : [value];

  return values
    .map((entry) => (isPlainObject(entry) ? entry.id : entry))
    .filter(isNonEmptyString);
};

// Accepts an HTTP route payload ({ body: { companyIds } }), a workflow action
// ({ records }) or a queued job payload ({ companyIds }).
export const extractCompanyIds = (input: unknown): string[] => {
  if (!isPlainObject(input)) {
    return [];
  }

  const source = 'requestContext' in input && isPlainObject(input.body)
    ? input.body
    : input;

  return [
    ...new Set([...toIds(source.companyIds), ...toIds(source.records)]),
  ];
};

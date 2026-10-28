import { SELECT_OPTION_UNIVERSAL_IDENTIFIERS } from 'src/constants/universal-identifiers';

type SelectOptionColor =
  | 'green'
  | 'turquoise'
  | 'sky'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'gray';

type SelectOptionDefinition<TValue extends string> = {
  value: TValue;
  label: string;
  color: SelectOptionColor;
};

const toFieldOptions = <TValue extends string>(
  definitions: readonly SelectOptionDefinition<TValue>[],
  ids: Record<TValue, string>,
) =>
  definitions.map((definition, position) => ({
    id: ids[definition.value],
    value: definition.value,
    label: definition.label,
    color: definition.color,
    position,
  }));

export type SizeTier = 'SMALL' | 'MEDIUM' | 'LARGE';
export type ComplexityTier = 'BASIC' | 'STANDARD' | 'ADVANCED';
export type LeadStatus =
  | 'NEW'
  | 'AUDITED'
  | 'PITCH_READY'
  | 'CALLED'
  | 'FOLLOW_UP'
  | 'WON'
  | 'LOST';

export const SIZE_TIER_OPTIONS = toFieldOptions<SizeTier>(
  [
    { value: 'SMALL', label: 'Small', color: 'sky' },
    { value: 'MEDIUM', label: 'Medium', color: 'blue' },
    { value: 'LARGE', label: 'Large', color: 'purple' },
  ],
  SELECT_OPTION_UNIVERSAL_IDENTIFIERS.sizeTier,
);

export const COMPLEXITY_TIER_OPTIONS = toFieldOptions<ComplexityTier>(
  [
    { value: 'BASIC', label: 'Basic site', color: 'green' },
    { value: 'STANDARD', label: 'Booking / menus', color: 'yellow' },
    { value: 'ADVANCED', label: 'Store / complex', color: 'orange' },
  ],
  SELECT_OPTION_UNIVERSAL_IDENTIFIERS.complexityTier,
);

export const LEAD_STATUS_OPTIONS = toFieldOptions<LeadStatus>(
  [
    { value: 'NEW', label: 'New', color: 'gray' },
    { value: 'AUDITED', label: 'Audited', color: 'sky' },
    { value: 'PITCH_READY', label: 'Pitch ready', color: 'purple' },
    { value: 'CALLED', label: 'Called', color: 'blue' },
    { value: 'FOLLOW_UP', label: 'Follow up', color: 'yellow' },
    { value: 'WON', label: 'Won', color: 'green' },
    { value: 'LOST', label: 'Lost', color: 'red' },
  ],
  SELECT_OPTION_UNIVERSAL_IDENTIFIERS.leadStatus,
);

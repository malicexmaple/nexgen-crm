import { isNonEmptyString } from 'src/logic-functions/utils/guards';

export class LeadEngineConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LeadEngineConfigError';
  }
}

export const getOptionalSetting = (name: string): string | null => {
  const value = process.env[name]?.trim();

  return isNonEmptyString(value) ? value : null;
};

export const getRequiredSetting = (name: string, label: string): string => {
  const value = getOptionalSetting(name);

  if (value === null) {
    throw new LeadEngineConfigError(
      `${label} is not set. Add it in Settings -> Apps -> NEXGEN Lead Engine.`,
    );
  }

  return value;
};

// Application variables always arrive as strings.
export const getBooleanSetting = (name: string, fallback: boolean): boolean => {
  const value = getOptionalSetting(name);

  return value === null ? fallback : value.toLowerCase() === 'true';
};

export const getNumberSetting = (name: string, fallback: number): number => {
  const value = getOptionalSetting(name);
  const parsed = Number(value);

  return value !== null && Number.isFinite(parsed) ? parsed : fallback;
};

import { type CoreApiClient } from 'twenty-client-sdk/core';

import { readWorkspaceMembers } from 'src/calling/calling-records';
import { SETTING_NAMES } from 'src/constants/settings';
import { getOptionalSetting } from 'src/logic-functions/utils/settings';

export type CallingActor = {
  workspaceMemberId: string | null;
  name: string;
  isCallingAdmin: boolean;
};

export const parseAdminEmails = (value: string | null): Set<string> =>
  new Set(
    (value ?? '')
      .split(/[\s,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0),
  );

// Admins are listed in the app's settings, which only workspace admins can edit.
export const resolveCallingActor = async ({
  client,
  workspaceMemberId,
}: {
  client: CoreApiClient;
  workspaceMemberId: string | null;
}): Promise<CallingActor> => {
  if (workspaceMemberId === null) {
    return { workspaceMemberId: null, name: 'API', isCallingAdmin: false };
  }

  const members = await readWorkspaceMembers({
    client,
    workspaceMemberIds: [workspaceMemberId],
  });
  const member = members.get(workspaceMemberId);
  const email = member?.email?.toLowerCase() ?? null;
  const adminEmails = parseAdminEmails(getOptionalSetting(SETTING_NAMES.callingAdminEmails));

  return {
    workspaceMemberId,
    name: member?.name ?? 'Unknown member',
    isCallingAdmin: email !== null && adminEmails.has(email),
  };
};

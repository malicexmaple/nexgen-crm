import { canUndoCall } from 'src/calling/build-lead-card';
import { type CallingActor, parseAdminEmails } from 'src/calling/calling-actor';

const NOW = new Date('2026-11-02T00:10:00.000Z');

const salesperson: CallingActor = { workspaceMemberId: 'sam', name: 'Sam', isCallingAdmin: false };
const admin: CallingActor = { workspaceMemberId: 'jake', name: 'Jake', isCallingAdmin: true };

const callBy = (calledById: string, minutesAgo: number) => ({
  calledById,
  calledAt: new Date(NOW.getTime() - minutesAgo * 60 * 1000).toISOString(),
  undoneAt: null,
});

describe('canUndoCall', () => {
  it('lets a salesperson undo their own call for 10 minutes', () => {
    expect(canUndoCall({ call: callBy('sam', 9), actor: salesperson, now: NOW })).toBe(true);
    expect(canUndoCall({ call: callBy('sam', 11), actor: salesperson, now: NOW })).toBe(false);
  });

  it('does not let a salesperson undo someone else’s call', () => {
    expect(canUndoCall({ call: callBy('alex', 1), actor: salesperson, now: NOW })).toBe(false);
  });

  it('lets a calling admin undo any call at any time', () => {
    expect(canUndoCall({ call: callBy('sam', 60 * 24 * 30), actor: admin, now: NOW })).toBe(true);
  });

  it('never undoes the same call twice', () => {
    expect(
      canUndoCall({
        call: { ...callBy('sam', 1), undoneAt: NOW.toISOString() },
        actor: admin,
        now: NOW,
      }),
    ).toBe(false);
  });
});

describe('parseAdminEmails', () => {
  it('accepts commas, spaces and mixed case', () => {
    expect(parseAdminEmails(' Jake@NexGen.com.au, sam@nexgen.com.au;ops@x.com ')).toEqual(
      new Set(['jake@nexgen.com.au', 'sam@nexgen.com.au', 'ops@x.com']),
    );
  });

  it('treats an empty setting as no admins', () => {
    expect(parseAdminEmails(null).size).toBe(0);
    expect(parseAdminEmails('').size).toBe(0);
  });
});

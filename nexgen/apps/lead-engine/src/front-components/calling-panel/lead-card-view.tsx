import { type CSSProperties, type SyntheticEvent } from 'react';

import { type LeadCard } from 'src/calling/calling-api-types';
import { MAX_CALL_ATTEMPTS } from 'src/calling/calling-rules';
import { type CallOutcome } from 'src/constants/select-options';
import {
  describeLeadStatus,
  formatTime,
  getStatusLabel,
} from 'src/front-components/calling-panel/calling-panel-text';
import {
  type CallingPalette,
  OUTCOME_BUTTONS,
} from 'src/front-components/calling-panel/calling-panel-theme';
import { LeadProfileView } from 'src/front-components/calling-panel/lead-profile-view';

type LeadCardViewProps = {
  lead: LeadCard;
  palette: CallingPalette;
  isBusy: boolean;
  note: string;
  onNoteChange: (note: string) => void;
  onOutcome: (outcome: CallOutcome) => void;
  onUndo: (callId: string) => void;
  onReactivate: () => void;
  onCopyPhone: (phoneNumber: string) => void;
  onNextLead: () => void;
};

// The sandbox can deliver input values on detail, on the event or on its target.
const readInputValue = (event: SyntheticEvent<HTMLElement>): string | undefined => {
  const candidate = event as unknown as {
    detail?: { value?: unknown };
    value?: unknown;
    target?: { value?: unknown };
  };

  for (const value of [candidate.detail?.value, candidate.value, candidate.target?.value]) {
    if (typeof value === 'string') {
      return value;
    }
  }

  return undefined;
};

const secondaryButtonStyle = (palette: CallingPalette): CSSProperties => ({
  border: `1px solid ${palette.border}`,
  background: palette.card,
  color: palette.text,
  borderRadius: 8,
  padding: '8px 14px',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
});

const columnStyle = (palette: CallingPalette): CSSProperties => ({
  border: `1px solid ${palette.border}`,
  borderRadius: 12,
  background: palette.card,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  minWidth: 0,
});

export const LeadCardView = ({
  lead,
  palette,
  isBusy,
  note,
  onNoteChange,
  onOutcome,
  onUndo,
  onReactivate,
  onCopyPhone,
  onNextLead,
}: LeadCardViewProps) => {
  const lastCallLabel =
    lead.lastCallAt !== null ? formatTime(lead.lastCallAt) : 'Never';
  const nextCallLabel =
    lead.callingStatus === 'READY'
      ? 'Ready now'
      : lead.nextCallAt !== null
        ? formatTime(lead.nextCallAt)
        : 'Not scheduled';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: 16,
        alignItems: 'start',
      }}
    >
      <div style={columnStyle(palette)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: palette.text, overflowWrap: 'break-word' }}>
              {lead.name}
            </div>
            <div style={{ fontSize: 14, color: palette.secondaryText, marginTop: 4 }}>
              {lead.contactName ?? 'No contact name yet'}
            </div>
          </div>
          <div
            role="img"
            aria-label={`Current attempt: call ${lead.callAttempt} of ${MAX_CALL_ATTEMPTS}`}
            style={{ textAlign: 'right', flexShrink: 0, userSelect: 'none' }}
          >
            <div style={{ fontSize: 12, color: palette.tertiaryText, fontWeight: 600 }}>
              CURRENT ATTEMPT
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: palette.text, lineHeight: 1.1 }}>
              CALL {lead.callAttempt}
            </div>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 6 }}>
              {Array.from({ length: MAX_CALL_ATTEMPTS }, (_, index) => (
                <span
                  key={index}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: index < lead.callAttempt ? palette.text : palette.border,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {lead.phoneNumber !== null ? (
            <>
              <a
                href={lead.phoneHref ?? undefined}
                style={{ fontSize: 22, fontWeight: 600, color: palette.accent, textDecoration: 'none' }}
              >
                {lead.phoneNumber}
              </a>
              <button
                type="button"
                style={secondaryButtonStyle(palette)}
                onClick={() => lead.phoneNumber !== null && onCopyPhone(lead.phoneNumber)}
              >
                Copy
              </button>
            </>
          ) : (
            <span style={{ fontSize: 16, color: palette.warning }}>No phone number</span>
          )}
        </div>

        <div style={{ fontSize: 13, color: palette.secondaryText }}>
          {getStatusLabel(lead.callingStatus)} · Cycle {lead.callingCycle} ·{' '}
          {lead.totalCallAttempts} {lead.totalCallAttempts === 1 ? 'call' : 'calls'} so far
        </div>

        {lead.callOpener !== null && lead.callOpener.length > 0 && (
          <div
            style={{
              background: palette.subtleBackground,
              borderRadius: 8,
              padding: 12,
              fontSize: 14,
              color: palette.text,
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: palette.tertiaryText, marginBottom: 4 }}>
              CALL OPENER
            </div>
            {lead.callOpener}
          </div>
        )}

        {lead.pitchSiteUrl !== null && (
          <a
            href={lead.pitchSiteUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 14, color: palette.accent }}
          >
            Open their sample site
          </a>
        )}

        {lead.canRecordOutcome ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text"
              value={note}
              placeholder="Note (optional, saved with the call)"
              maxLength={500}
              onChange={(event) => {
                const value = readInputValue(event);

                if (value !== undefined) {
                  onNoteChange(value);
                }
              }}
              style={{
                border: `1px solid ${palette.border}`,
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 14,
                background: palette.card,
                color: palette.text,
              }}
            />
            {OUTCOME_BUTTONS.map(({ outcome, label, color }) => (
              <button
                key={outcome}
                type="button"
                disabled={isBusy}
                onClick={() => onOutcome(outcome)}
                style={{
                  background: color,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '16px 12px',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  cursor: isBusy ? 'wait' : 'pointer',
                  opacity: isBusy ? 0.6 : 1,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: palette.warningBackground,
              color: palette.warning,
              borderRadius: 8,
              padding: 12,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {describeLeadStatus(lead)}
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: palette.secondaryText, flexWrap: 'wrap' }}>
          <span>Last called: {lastCallLabel}</span>
          <span>Next call: {nextCallLabel}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {lead.undoableCallId !== null && (
            <button
              type="button"
              disabled={isBusy}
              style={secondaryButtonStyle(palette)}
              onClick={() => lead.undoableCallId !== null && onUndo(lead.undoableCallId)}
            >
              Undo last call
            </button>
          )}
          {lead.canReactivate && (
            <button
              type="button"
              disabled={isBusy}
              style={secondaryButtonStyle(palette)}
              onClick={onReactivate}
            >
              Move back to Ready to call
            </button>
          )}
          <button type="button" disabled={isBusy} style={secondaryButtonStyle(palette)} onClick={onNextLead}>
            Next lead →
          </button>
        </div>

        {lead.recentCalls.length > 0 && (
          <div style={{ borderTop: `1px solid ${palette.border}`, paddingTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: palette.tertiaryText, marginBottom: 8 }}>
              CALL HISTORY
            </div>
            {lead.recentCalls.map((call) => (
              <div
                key={call.id}
                style={{
                  fontSize: 13,
                  color: call.isUndone ? palette.tertiaryText : palette.text,
                  textDecoration: call.isUndone ? 'line-through' : 'none',
                  padding: '3px 0',
                }}
              >
                {call.name}
                {call.calledAt !== null ? ` · ${formatTime(call.calledAt)}` : ''}
                {call.calledByName !== null ? ` · ${call.calledByName}` : ''}
                {call.note !== null ? ` · ${call.note}` : ''}
                {call.isUndone ? ' (undone)' : ''}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={columnStyle(palette)}>
        <LeadProfileView profile={lead.profile} palette={palette} />
      </div>
    </div>
  );
};

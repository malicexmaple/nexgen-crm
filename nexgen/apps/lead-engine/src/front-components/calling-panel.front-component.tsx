import { useCallback, useEffect, useRef, useState } from 'react';
import { RestApiClient } from 'twenty-client-sdk/rest';
import {
  defineFrontComponent,
  PageLayoutType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  AppPath,
  copyToClipboard,
  enqueueSnackbar,
  navigate,
  openCommandConfirmationModal,
  useColorScheme,
  useSelectedRecordIds,
} from 'twenty-sdk/front-component';

import {
  type CallingResponse,
  type LeadCard,
  type SavedCall,
} from 'src/calling/calling-api-types';
import { type CallOutcome } from 'src/constants/select-options';
import {
  CALLING_PANEL_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  LOGIC_FUNCTIONS,
} from 'src/constants/universal-identifiers';
import {
  describeSavedCall,
  formatTime,
} from 'src/front-components/calling-panel/calling-panel-text';
import { getCallingPalette } from 'src/front-components/calling-panel/calling-panel-theme';
import { createRequestId } from 'src/front-components/calling-panel/create-request-id';
import { LeadCardView } from 'src/front-components/calling-panel/lead-card-view';

const EMPTY_POOL_REFRESH_MS = 60 * 1000;

const postCallingRoute = (path: string, body: Record<string, unknown>) =>
  new RestApiClient().post<CallingResponse>(`/s${path}`, body);

// A dropped connection is retried with the same request id, which the server
// recognises, so the retry can never record a second call.
const postCallingRouteWithRetry = async (path: string, body: Record<string, unknown>) => {
  try {
    return await postCallingRoute(path, body);
  } catch {
    return postCallingRoute(path, body);
  }
};

type PanelState = {
  isLoading: boolean;
  lead: LeadCard | null;
  nextDueAt: string | null;
  savedCall: SavedCall | null;
  message: string | null;
};

const CallingPanel = () => {
  const [selectedRecordId] = useSelectedRecordIds();
  const companyId = selectedRecordId ?? null;
  const isDialer = companyId === null;
  const palette = getCallingPalette(useColorScheme());
  const [state, setState] = useState<PanelState>({
    isLoading: true,
    lead: null,
    nextDueAt: null,
    savedCall: null,
    message: null,
  });
  const [note, setNote] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const isBusyRef = useRef(false);
  const skippedCompanyIdsRef = useRef<string[]>([]);

  const loadLead = useCallback(async () => {
    const response =
      companyId !== null
        ? await postCallingRoute(LOGIC_FUNCTIONS.callingLead.path, { companyId })
        : await postCallingRoute(LOGIC_FUNCTIONS.callingNextLead.path, {
            skipCompanyIds: skippedCompanyIdsRef.current,
          });

    setState((previous) => ({
      ...previous,
      isLoading: false,
      lead: response.lead,
      nextDueAt: response.nextDueAt,
      message: response.status === 'rejected' ? response.message : null,
    }));
  }, [companyId]);

  const runExclusive = async (action: () => Promise<void>) => {
    if (isBusyRef.current) {
      return;
    }

    isBusyRef.current = true;
    setIsBusy(true);

    try {
      await action();
    } catch {
      await enqueueSnackbar({
        message: 'That could not be saved. Check your connection and try again.',
        variant: 'error',
      });
    } finally {
      isBusyRef.current = false;
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadLead().catch(() =>
      setState((previous) => ({
        ...previous,
        isLoading: false,
        message: 'The calling list could not be loaded. Refresh the page to try again.',
      })),
    );
  }, [loadLead]);

  const isPoolEmpty = isDialer && !state.isLoading && state.lead === null;

  useEffect(() => {
    if (!isPoolEmpty) {
      return;
    }

    const interval = setInterval(() => {
      loadLead().catch(() => undefined);
    }, EMPTY_POOL_REFRESH_MS);

    return () => clearInterval(interval);
  }, [isPoolEmpty, loadLead]);

  const handleRejected = async (response: CallingResponse) => {
    await enqueueSnackbar({
      message: response.message ?? 'That could not be saved.',
      variant: 'warning',
    });
    setState((previous) => ({ ...previous, lead: response.lead ?? previous.lead }));
  };

  const handleOutcome = (outcome: CallOutcome) =>
    runExclusive(async () => {
      const lead = state.lead;

      if (lead === null) {
        return;
      }

      if (outcome === 'DNQ') {
        const answer = await openCommandConfirmationModal({
          title: `Mark ${lead.name} as DNQ?`,
          subtitle:
            'The lead leaves the calling list for good. Its history is kept, and only a calling admin can bring it back.',
          confirmButtonText: 'Mark as DNQ',
          confirmButtonAccent: 'danger',
        });

        if (answer !== 'confirm') {
          return;
        }
      }

      const response = await postCallingRouteWithRetry(LOGIC_FUNCTIONS.callingOutcome.path, {
        companyId: lead.id,
        outcome,
        expectedAttempt: lead.callAttempt,
        expectedCycle: lead.callingCycle,
        requestId: createRequestId(),
        note: note.trim(),
      });

      if (response.status === 'rejected') {
        await handleRejected(response);

        return;
      }

      setNote('');
      setState((previous) => ({
        ...previous,
        savedCall: response.savedCall,
        lead: isDialer ? previous.lead : response.lead,
      }));

      if (isDialer) {
        await loadLead();
      }
    });

  const handleUndo = (callId: string) =>
    runExclusive(async () => {
      const response = await postCallingRoute(LOGIC_FUNCTIONS.callingUndo.path, { callId });

      if (response.status === 'rejected') {
        await handleRejected(response);

        return;
      }

      const shownLead = state.lead;

      if (isDialer && shownLead !== null && shownLead.id !== response.lead?.id) {
        await postCallingRoute(LOGIC_FUNCTIONS.callingRelease.path, { companyId: shownLead.id });
      }

      await enqueueSnackbar({ message: response.message ?? 'Call undone.', variant: 'success' });
      setState((previous) => ({ ...previous, lead: response.lead, savedCall: null }));
    });

  const handleReactivate = () =>
    runExclusive(async () => {
      const lead = state.lead;

      if (lead === null) {
        return;
      }

      const response = await postCallingRouteWithRetry(LOGIC_FUNCTIONS.callingReactivate.path, {
        companyId: lead.id,
        requestId: createRequestId(),
      });

      if (response.status === 'rejected') {
        await handleRejected(response);

        return;
      }

      setState((previous) => ({
        ...previous,
        lead: response.lead,
        savedCall: response.savedCall,
      }));
    });

  const handleSkip = () =>
    runExclusive(async () => {
      const lead = state.lead;

      if (lead === null) {
        return;
      }

      skippedCompanyIdsRef.current = [...skippedCompanyIdsRef.current, lead.id];
      await postCallingRoute(LOGIC_FUNCTIONS.callingRelease.path, { companyId: lead.id });
      setNote('');
      await loadLead();
    });

  const handleRefresh = () =>
    runExclusive(async () => {
      skippedCompanyIdsRef.current = [];
      await loadLead();
    });

  const handleOpenLead = () => {
    if (state.lead !== null) {
      navigate(AppPath.RecordShowPage, {
        objectNameSingular: 'company',
        objectRecordId: state.lead.id,
      });
    }
  };

  const handleCopyPhone = async (phoneNumber: string) => {
    await copyToClipboard(phoneNumber);
    await enqueueSnackbar({ message: 'Phone number copied', variant: 'success' });
  };

  const { savedCall, lead } = state;

  return (
    <div
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 640,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        color: palette.text,
      }}
    >
      {savedCall !== null && (
        <div
          role="status"
          style={{
            background: palette.successBackground,
            color: palette.success,
            borderRadius: 10,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span style={{ flex: 1 }}>Saved. {describeSavedCall(savedCall)}</span>
          {savedCall.canUndo && savedCall.callId !== null && (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => savedCall.callId !== null && handleUndo(savedCall.callId)}
              style={{
                border: `1px solid ${palette.success}`,
                background: 'transparent',
                color: palette.success,
                borderRadius: 8,
                padding: '6px 12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Undo
            </button>
          )}
        </div>
      )}

      {state.isLoading ? (
        <div style={{ color: palette.secondaryText, padding: 24, textAlign: 'center' }}>
          Loading…
        </div>
      ) : lead !== null ? (
        <LeadCardView
          lead={lead}
          palette={palette}
          isBusy={isBusy}
          note={note}
          onNoteChange={setNote}
          onOutcome={handleOutcome}
          onUndo={handleUndo}
          onReactivate={handleReactivate}
          onCopyPhone={handleCopyPhone}
          onSkip={isDialer ? handleSkip : undefined}
          onOpenLead={isDialer ? handleOpenLead : undefined}
        />
      ) : (
        <div
          style={{
            border: `1px solid ${palette.border}`,
            borderRadius: 12,
            padding: 24,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {state.message ?? 'No leads are ready to call right now.'}
          </div>
          {isDialer && (
            <>
              <div style={{ fontSize: 14, color: palette.secondaryText }}>
                {state.nextDueAt !== null
                  ? `The next snoozed lead comes back at ${formatTime(state.nextDueAt)}.`
                  : 'New leads appear here as soon as they are added.'}
              </div>
              <button
                type="button"
                disabled={isBusy}
                onClick={handleRefresh}
                style={{
                  border: `1px solid ${palette.border}`,
                  background: palette.card,
                  color: palette.text,
                  borderRadius: 8,
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                Check again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: CALLING_PANEL_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'calling-panel',
  description:
    'Shows the lead to call with its call number and the Answered, No answer, Nurture and DNQ buttons.',
  component: CallingPanel,
  widgetAvailability: {
    pageLayoutType: PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifiers: [STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier],
  },
});

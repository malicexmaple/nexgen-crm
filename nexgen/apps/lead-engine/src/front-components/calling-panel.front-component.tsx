import { useEffect, useRef, useState } from 'react';
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

const releaseLead = (companyId: string) =>
  postCallingRoute(LOGIC_FUNCTIONS.callingRelease.path, { companyId }).catch(() => undefined);

type PanelState = {
  isLoading: boolean;
  lead: LeadCard | null;
  savedCall: SavedCall | null;
  message: string | null;
};

const INITIAL_STATE: PanelState = {
  isLoading: true,
  lead: null,
  savedCall: null,
  message: null,
};

const CallingPanel = () => {
  const [selectedRecordId] = useSelectedRecordIds();
  const companyId = selectedRecordId ?? null;
  const palette = getCallingPalette(useColorScheme());
  const [state, setState] = useState<PanelState>(INITIAL_STATE);
  const [note, setNote] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const isBusyRef = useRef(false);

  useEffect(() => {
    if (companyId === null) {
      return;
    }

    setState(INITIAL_STATE);
    setNote('');
    postCallingRoute(LOGIC_FUNCTIONS.callingLead.path, { companyId, claim: true })
      .then((response) =>
        setState({
          isLoading: false,
          lead: response.lead,
          savedCall: null,
          message: response.status === 'rejected' ? response.message : null,
        }),
      )
      .catch(() =>
        setState({
          ...INITIAL_STATE,
          isLoading: false,
          message: 'This lead could not be loaded. Refresh the page to try again.',
        }),
      );

    return () => {
      releaseLead(companyId);
    };
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
        lead: response.lead,
      }));
    });

  const handleUndo = (callId: string) =>
    runExclusive(async () => {
      const response = await postCallingRoute(LOGIC_FUNCTIONS.callingUndo.path, { callId });

      if (response.status === 'rejected') {
        await handleRejected(response);

        return;
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

  const handleNextLead = () =>
    runExclusive(async () => {
      if (companyId === null) {
        return;
      }

      await releaseLead(companyId);

      const response = await postCallingRoute(LOGIC_FUNCTIONS.callingNextLead.path, {
        skipCompanyIds: [companyId],
      });

      if (response.lead === null) {
        await enqueueSnackbar({
          message:
            response.nextDueAt !== null
              ? `No other leads are ready to call. The next one comes back at ${formatTime(response.nextDueAt)}.`
              : 'No other leads are ready to call right now.',
          variant: 'info',
        });

        return;
      }

      navigate(AppPath.RecordShowPage, {
        objectNameSingular: 'company',
        objectRecordId: response.lead.id,
      });
    });

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
        maxWidth: 1100,
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
            flexWrap: 'wrap',
          }}
        >
          <span style={{ flex: 1, minWidth: 200 }}>Saved. {describeSavedCall(savedCall)}</span>
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
          <button
            type="button"
            disabled={isBusy}
            onClick={handleNextLead}
            style={{
              border: 'none',
              background: palette.success,
              color: palette.card,
              borderRadius: 8,
              padding: '6px 14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Next lead →
          </button>
        </div>
      )}

      {companyId === null ? (
        <div style={{ color: palette.secondaryText, padding: 24, textAlign: 'center' }}>
          Open a lead to call it.
        </div>
      ) : state.isLoading ? (
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
          onNextLead={handleNextLead}
        />
      ) : (
        <div
          style={{
            border: `1px solid ${palette.border}`,
            borderRadius: 12,
            padding: 24,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {state.message ?? 'This lead could not be loaded.'}
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: CALLING_PANEL_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'calling-panel',
  description:
    "Shows a lead's details with its call number and the Answered, No answer, Nurture and DNQ buttons.",
  component: CallingPanel,
  widgetAvailability: {
    pageLayoutType: PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifiers: [STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier],
  },
});

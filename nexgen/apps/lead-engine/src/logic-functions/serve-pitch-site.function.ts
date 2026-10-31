import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';

import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';
import {
  isCompanyId,
  loadPitchSiteHtml,
} from 'src/pitch-site/pitch-site-storage';
import {
  isProspectOpen,
  PITCH_SITE_OPEN_HEADERS,
  recordPitchSiteOpen,
} from 'src/pitch-site/record-pitch-site-open';

const NOT_FOUND_HTML =
  '<!doctype html><html><body style="font-family:sans-serif;padding:3rem">This preview is no longer available.</body></html>';

const htmlResponse = (html: string, status: number) =>
  new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

// Public so a prospect can open the link; company ids are random UUIDs, so links are unlisted.
const handler = async (event: RoutePayload) => {
  const companyId = event.pathParameters?.companyId;

  if (!isCompanyId(companyId)) {
    return htmlResponse(NOT_FOUND_HTML, 404);
  }

  const html = await loadPitchSiteHtml(companyId);

  if (!html) {
    return htmlResponse(NOT_FOUND_HTML, 404);
  }

  if (isProspectOpen(event.headers ?? {})) {
    await recordPitchSiteOpen({
      client: new CoreApiClient({ runAs: 'application' }),
      companyId,
      openedAt: new Date(),
    }).catch((error) =>
      console.warn(
        'Could not record the pitch site open:',
        error instanceof Error ? error.message : error,
      ),
    );
  }

  return htmlResponse(html, 200);
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.servePitchSite.universalIdentifier,
  name: 'serve-pitch-site',
  description: 'Serves a generated pitch site at an unlisted public link and counts prospect opens.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.servePitchSite.path,
    httpMethod: 'GET',
    isAuthRequired: false,
    forwardedRequestHeaders: PITCH_SITE_OPEN_HEADERS,
  },
});

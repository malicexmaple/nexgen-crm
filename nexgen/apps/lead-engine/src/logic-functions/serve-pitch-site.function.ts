import { defineLogicFunction, type RoutePayload } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';

import { LOGIC_FUNCTIONS } from 'src/constants/universal-identifiers';
import {
  isCompanyId,
  loadPitchSiteHtml,
} from 'src/pitch-site/pitch-site-storage';

const NOT_FOUND_HTML =
  '<!doctype html><html><body style="font-family:sans-serif;padding:3rem">This preview is no longer available.</body></html>';

// Public so a prospect can open the link; company ids are random UUIDs, so links are unlisted.
const handler = async (event: RoutePayload) => {
  const companyId = event.pathParameters?.companyId;
  const html = isCompanyId(companyId) ? await loadPitchSiteHtml(companyId) : null;

  return new Response(html ?? NOT_FOUND_HTML, {
    status: html ? 200 : 404,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
};

export default defineLogicFunction({
  universalIdentifier: LOGIC_FUNCTIONS.servePitchSite.universalIdentifier,
  name: 'serve-pitch-site',
  description: 'Serves a generated pitch site at an unlisted public link.',
  timeoutSeconds: 30,
  handler,
  httpRouteTriggerSettings: {
    path: LOGIC_FUNCTIONS.servePitchSite.path,
    httpMethod: 'GET',
    isAuthRequired: false,
  },
});

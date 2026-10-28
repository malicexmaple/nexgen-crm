import Anthropic from '@anthropic-ai/sdk';

import { type LeadCompany } from 'src/logic-functions/utils/company-records';
import {
  buildPitchSitePrompt,
  PITCH_SITE_SYSTEM_PROMPT,
} from 'src/pitch-site/build-pitch-site-prompt';
import { sanitizePitchSiteHtml } from 'src/pitch-site/sanitize-pitch-site-html';

// Models that accept server-side refusal fallbacks in the "default" form.
const FALLBACK_CAPABLE_MODELS = new Set([
  'claude-fable-5-1',
  'claude-opus-5-5',
  'claude-opus-5',
  'claude-sonnet-5-5',
]);

export class PitchSiteGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PitchSiteGenerationError';
  }
}

export const generatePitchSiteHtml = async ({
  apiKey,
  model,
  company,
}: {
  apiKey: string;
  model: string;
  company: LeadCompany;
}): Promise<string> => {
  const client = new Anthropic({ apiKey });
  const supportsFallback = FALLBACK_CAPABLE_MODELS.has(model);

  const stream = client.beta.messages.stream({
    model,
    max_tokens: 32000,
    output_config: { effort: 'medium' },
    system: PITCH_SITE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPitchSitePrompt(company) }],
    ...(supportsFallback
      ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }
      : {}),
  } as Anthropic.Beta.Messages.MessageCreateParamsStreaming);

  const message = await stream.finalMessage();

  if (message.stop_reason === 'refusal') {
    throw new PitchSiteGenerationError(
      `Claude declined to build this site (${message.stop_details?.category ?? 'no category'}).`,
    );
  }

  if (message.stop_reason === 'max_tokens') {
    throw new PitchSiteGenerationError('Claude ran out of output tokens before finishing the page.');
  }

  const text = message.content
    .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');
  const html = sanitizePitchSiteHtml(text);

  if (!/<\/html>\s*$/i.test(html)) {
    throw new PitchSiteGenerationError('Claude returned an incomplete HTML document.');
  }

  return html;
};

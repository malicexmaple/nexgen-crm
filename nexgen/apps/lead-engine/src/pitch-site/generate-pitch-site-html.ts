import Anthropic from '@anthropic-ai/sdk';

import { type LeadCompany } from 'src/logic-functions/utils/company-records';
import {
  buildPitchSiteContent,
  PITCH_SITE_SYSTEM_PROMPT,
} from 'src/pitch-site/build-pitch-site-prompt';
import { type BrandKit } from 'src/pitch-site/fetch-brand-kit';
import { type GoogleListing } from 'src/pitch-site/fetch-google-listing';
import {
  addPitchSiteSafetyTags,
  sanitizePitchSiteHtml,
} from 'src/pitch-site/sanitize-pitch-site-html';

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
  brandKit,
  googleListing,
}: {
  apiKey: string;
  model: string;
  company: LeadCompany;
  brandKit: BrandKit | null;
  googleListing: GoogleListing;
}): Promise<string> => {
  const client = new Anthropic({ apiKey });
  const supportsFallback = FALLBACK_CAPABLE_MODELS.has(model);

  // High effort: the page is the sales pitch, so design quality is worth the extra thinking.
  const stream = client.beta.messages.stream({
    model,
    max_tokens: 48000,
    output_config: { effort: 'high' },
    system: PITCH_SITE_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: buildPitchSiteContent(company, { brandKit, googleListing }) },
    ],
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

  return addPitchSiteSafetyTags(html);
};

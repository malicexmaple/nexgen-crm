export type WebsiteFetchResult = {
  ok: boolean;
  status: number;
  finalUrl: string;
  html: string;
  responseTimeMs: number;
  bytes: number;
};

export type WebsiteAudit = {
  score: number;
  issues: string[];
};

const MIN_SCORE = 1;
const MAX_SCORE = 10;

const PARKED_OR_PLACEHOLDER_PATTERN =
  /under construction|coming soon|domain (is )?for sale|this domain may be for sale|parked free|default web site page|it works!/i;
const COPYRIGHT_YEAR_PATTERN = /(?:©|&copy;|copyright)[^<]{0,40}?((?:19|20)\d{2})(?:\s*[-–]\s*((?:19|20)\d{2}))?/gi;
const OUTDATED_TECH_PATTERN =
  /jquery[.-]?1\.\d|\.swf\b|swfobject|<marquee|<font\s|<frameset|bgsound/i;
const CONTACT_PATTERN = /href=["']tel:|<form[\s>]/i;

const clampScore = (score: number) =>
  Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.round(score)));

const findLatestCopyrightYear = (html: string) => {
  let latestYear: number | null = null;

  for (const match of html.matchAll(COPYRIGHT_YEAR_PATTERN)) {
    const year = Number(match[2] ?? match[1]);

    if (latestYear === null || year > latestYear) {
      latestYear = year;
    }
  }

  return latestYear;
};

// Scores how much a business would benefit from a new site: 1 = no usable site, 10 = modern.
export const auditWebsiteHtml = ({
  websiteUrl,
  fetchResult,
  currentYear,
}: {
  websiteUrl: string | null;
  fetchResult: WebsiteFetchResult | null;
  currentYear: number;
}): WebsiteAudit => {
  if (!websiteUrl) {
    return { score: 1, issues: ['No website'] };
  }

  if (!fetchResult || !fetchResult.ok) {
    const status = fetchResult?.status ? ` (HTTP ${fetchResult.status})` : '';

    return {
      score: 2,
      issues: [`Website is down or unreachable${status}`],
    };
  }

  const { html, finalUrl, responseTimeMs, bytes } = fetchResult;

  if (PARKED_OR_PLACEHOLDER_PATTERN.test(html.slice(0, 20_000))) {
    return {
      score: 2,
      issues: ['Website is a placeholder, parked or "coming soon" page'],
    };
  }

  const issues: string[] = [];
  let score = MAX_SCORE;

  const deduct = (points: number, issue: string) => {
    score -= points;
    issues.push(issue);
  };

  if (!finalUrl.toLowerCase().startsWith('https://')) {
    deduct(2, 'No HTTPS: browsers show "Not secure"');
  }

  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) {
    deduct(2, 'Not mobile-friendly (no viewport meta tag)');
  }

  const latestCopyrightYear = findLatestCopyrightYear(html);

  if (latestCopyrightYear !== null) {
    const yearsOld = currentYear - latestCopyrightYear;

    if (yearsOld >= 4) {
      deduct(2, `Copyright year is ${latestCopyrightYear}: site looks abandoned`);
    } else if (yearsOld >= 2) {
      deduct(1, `Copyright year is ${latestCopyrightYear}: site looks dated`);
    }
  }

  if (responseTimeMs > 3000) {
    deduct(1, `Slow to respond (${(responseTimeMs / 1000).toFixed(1)}s)`);
  }

  if (bytes > 3_000_000) {
    deduct(1, `Heavy page (${(bytes / 1_000_000).toFixed(1)} MB)`);
  }

  if (!/<title>\s*[^<\s][^<]*<\/title>/i.test(html)) {
    deduct(1, 'Missing page title');
  }

  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i.test(html)) {
    deduct(1, 'Missing meta description (hurts Google ranking)');
  }

  if (OUTDATED_TECH_PATTERN.test(html)) {
    deduct(1, 'Uses outdated web technology');
  }

  if (!CONTACT_PATTERN.test(html)) {
    deduct(1, 'No click-to-call link or contact form');
  }

  return { score: clampScore(score), issues };
};

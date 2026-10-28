import {
  buildLeadAssessment,
  getStatusAfterAudit,
} from 'src/scoring/build-lead-assessment';
import { estimatePrice } from 'src/scoring/estimate-price';
import { getComplexityTier } from 'src/scoring/get-complexity-tier';
import { getLeadPriority } from 'src/scoring/get-lead-priority';
import { getSizeTier } from 'src/scoring/get-size-tier';

describe('getSizeTier', () => {
  it.each([
    [null, 'SMALL'],
    [12, 'SMALL'],
    [50, 'MEDIUM'],
    [299, 'MEDIUM'],
    [300, 'LARGE'],
  ])('maps %s reviews to %s', (reviewCount, expected) => {
    expect(getSizeTier(reviewCount)).toBe(expected);
  });
});

describe('getComplexityTier', () => {
  it('uses the Google category', () => {
    expect(getComplexityTier({ category: 'plumber', html: null })).toBe('BASIC');
    expect(getComplexityTier({ category: 'dentist', html: null })).toBe('STANDARD');
    expect(getComplexityTier({ category: 'clothing_store', html: null })).toBe(
      'ADVANCED',
    );
  });

  it('raises the tier when the current site already sells or books online', () => {
    expect(
      getComplexityTier({ category: 'plumber', html: '<a>Book now</a>' }),
    ).toBe('STANDARD');
    expect(
      getComplexityTier({ category: 'dentist', html: 'cdn.shopify.com' }),
    ).toBe('ADVANCED');
  });

  it('never lowers a category tier', () => {
    expect(
      getComplexityTier({ category: 'furniture_store', html: 'appointment' }),
    ).toBe('ADVANCED');
  });
});

describe('estimatePrice', () => {
  it('multiplies base price by size and rounds to the nearest 100', () => {
    expect(estimatePrice({ complexityTier: 'BASIC', sizeTier: 'SMALL' })).toBe(1500);
    expect(estimatePrice({ complexityTier: 'STANDARD', sizeTier: 'MEDIUM' })).toBe(
      5300,
    );
    expect(estimatePrice({ complexityTier: 'ADVANCED', sizeTier: 'LARGE' })).toBe(
      18800,
    );
  });
});

describe('getLeadPriority', () => {
  it('ranks a big business with no website highest', () => {
    expect(getLeadPriority({ websiteScore: 1, sizeTier: 'LARGE' })).toBe(100);
    expect(getLeadPriority({ websiteScore: 10, sizeTier: 'SMALL' })).toBe(10);
  });

  it('prefers a worse website at the same size', () => {
    expect(getLeadPriority({ websiteScore: 3, sizeTier: 'MEDIUM' })).toBeGreaterThan(
      getLeadPriority({ websiteScore: 7, sizeTier: 'MEDIUM' }),
    );
  });
});

describe('buildLeadAssessment', () => {
  it('scores a business with no website', () => {
    expect(
      buildLeadAssessment({
        websiteUrl: null,
        fetchResult: null,
        category: 'hair_care',
        reviewCount: 120,
        currentYear: 2026,
      }),
    ).toEqual({
      websiteScore: 1,
      websiteIssues: 'No website',
      sizeTier: 'MEDIUM',
      complexityTier: 'STANDARD',
      estimatedPrice: 5300,
      leadPriority: 85,
    });
  });
});

describe('getStatusAfterAudit', () => {
  it('only advances leads that have not been worked yet', () => {
    expect(getStatusAfterAudit(null)).toBe('AUDITED');
    expect(getStatusAfterAudit('NEW')).toBe('AUDITED');
    expect(getStatusAfterAudit('CALLED')).toBeNull();
  });
});

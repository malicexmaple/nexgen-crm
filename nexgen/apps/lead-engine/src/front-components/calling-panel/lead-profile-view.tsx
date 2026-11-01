import { type CSSProperties, type ReactNode } from 'react';

import { type LeadProfile } from 'src/calling/calling-api-types';
import {
  formatBusinessType,
  formatPrice,
  formatTime,
  getLeadStatusLabel,
} from 'src/front-components/calling-panel/calling-panel-text';
import { type CallingPalette } from 'src/front-components/calling-panel/calling-panel-theme';

type LeadProfileViewProps = {
  profile: LeadProfile;
  palette: CallingPalette;
};

const sectionLabelStyle = (palette: CallingPalette): CSSProperties => ({
  fontSize: 12,
  fontWeight: 600,
  color: palette.tertiaryText,
  marginBottom: 6,
});

const ProfileRow = ({
  label,
  palette,
  children,
}: {
  label: string;
  palette: CallingPalette;
  children: ReactNode;
}) => (
  <div style={{ display: 'flex', gap: 12, fontSize: 14, padding: '3px 0' }}>
    <span style={{ width: 84, flexShrink: 0, color: palette.secondaryText }}>{label}</span>
    <span style={{ minWidth: 0, overflowWrap: 'anywhere', color: palette.text }}>{children}</span>
  </div>
);

const Fact = ({
  label,
  value,
  palette,
}: {
  label: string;
  value: string;
  palette: CallingPalette;
}) => (
  <div
    style={{
      background: palette.subtleBackground,
      borderRadius: 8,
      padding: '8px 10px',
      minWidth: 0,
    }}
  >
    <div style={{ fontSize: 11, fontWeight: 600, color: palette.tertiaryText }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: palette.text, marginTop: 2 }}>{value}</div>
  </div>
);

export const LeadProfileView = ({ profile, palette }: LeadProfileViewProps) => {
  const linkStyle: CSSProperties = { color: palette.accent, textDecoration: 'none' };
  const facts = [
    profile.googleRating !== null
      ? {
          label: 'Google rating',
          value: `★ ${profile.googleRating}${
            profile.googleReviewCount !== null ? ` (${profile.googleReviewCount} reviews)` : ''
          }`,
        }
      : null,
    profile.websiteScore !== null
      ? { label: 'Website score', value: `${profile.websiteScore} / 10` }
      : null,
    profile.estimatedPrice !== null
      ? { label: 'Estimated price', value: formatPrice(profile.estimatedPrice) }
      : null,
    profile.leadPriority !== null
      ? { label: 'Lead priority', value: String(profile.leadPriority) }
      : null,
    profile.leadStatus !== null
      ? { label: 'Lead status', value: getLeadStatusLabel(profile.leadStatus) }
      : null,
    {
      label: 'Sample site opens',
      value:
        profile.pitchSiteOpens > 0 && profile.pitchSiteLastOpenedAt !== null
          ? `${profile.pitchSiteOpens} · last ${formatTime(profile.pitchSiteLastOpenedAt)}`
          : String(profile.pitchSiteOpens),
    },
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 8,
        }}
      >
        {facts.map((fact) => (
          <Fact key={fact.label} label={fact.label} value={fact.value} palette={palette} />
        ))}
      </div>

      <div>
        <div style={sectionLabelStyle(palette)}>CONTACTS</div>
        {profile.contacts.length === 0 ? (
          <div style={{ fontSize: 14, color: palette.secondaryText }}>
            No contact person saved yet. Add one in the People section of this page.
          </div>
        ) : (
          profile.contacts.map((contact, index) => (
            <div
              key={`${contact.name ?? 'contact'}-${index}`}
              style={{
                padding: '6px 0',
                borderTop: index > 0 ? `1px solid ${palette.border}` : 'none',
                fontSize: 14,
              }}
            >
              <div style={{ fontWeight: 600, color: palette.text }}>
                {contact.name ?? 'Unnamed contact'}
                {contact.jobTitle !== null && (
                  <span style={{ fontWeight: 400, color: palette.secondaryText }}>
                    {' '}
                    · {contact.jobTitle}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 2 }}>
                {contact.phoneNumber !== null && (
                  <a href={contact.phoneHref ?? undefined} style={linkStyle}>
                    {contact.phoneNumber}
                  </a>
                )}
                {contact.email !== null && (
                  <a href={`mailto:${contact.email}`} style={linkStyle}>
                    {contact.email}
                  </a>
                )}
                {contact.phoneNumber === null && contact.email === null && (
                  <span style={{ color: palette.secondaryText }}>No phone or email saved</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <div style={sectionLabelStyle(palette)}>BUSINESS</div>
        {profile.businessType !== null && (
          <ProfileRow label="Type" palette={palette}>
            {formatBusinessType(profile.businessType)}
          </ProfileRow>
        )}
        <ProfileRow label="Address" palette={palette}>
          {profile.address ?? 'Not saved'}
        </ProfileRow>
        <ProfileRow label="Website" palette={palette}>
          {profile.websiteUrl !== null ? (
            <a href={profile.websiteUrl} target="_blank" rel="noreferrer" style={linkStyle}>
              {profile.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          ) : (
            'No website'
          )}
        </ProfileRow>
        {profile.googleMapsUrl !== null && (
          <ProfileRow label="Google" palette={palette}>
            <a href={profile.googleMapsUrl} target="_blank" rel="noreferrer" style={linkStyle}>
              Open in Google Maps
            </a>
          </ProfileRow>
        )}
      </div>

      {profile.websiteIssues.length > 0 && (
        <div>
          <div style={sectionLabelStyle(palette)}>WEBSITE PROBLEMS TO MENTION</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: palette.text, lineHeight: 1.6 }}>
            {profile.websiteIssues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

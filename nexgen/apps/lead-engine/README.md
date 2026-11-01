# NEXGEN Lead Engine

A Twenty app that turns Google Maps into a cold-call list:

1. **Find leads** – searches Google Maps ("plumbers in Dallas, TX") and adds each business as a Company with phone, address, website, rating and review count.
2. **Score the website (1-10)** – runs automatically on every new Company: HTTPS, mobile-friendliness, copyright year, speed, page weight, title/description, outdated tech, click-to-call/contact form. No website = 1.
3. **Size and price** – size tier from Google review count, build complexity from the business type and the current site (online store, booking), and a quote = base price × size multiplier (`src/constants/pricing.ts`).
4. **Pitch site** – for websites scoring at or below the threshold (default 4), Claude designs a one-page concept site. It is served at an unlisted link `<CRM URL>/s/nexgen/pitch/<company id>` and saved in the Company's *Pitch site* field.
5. **Call opener** – alongside each pitch site, Claude Sonnet writes two or three lines to open the call with, from the rating, reviews and website problems.
6. **Site opens** – each time the business opens its pitch site, *Site opens* goes up and *Site last opened* is set. Opens from inside the CRM, link previews, bots and reloads within 30 minutes are not counted.
7. **Views** – *Call queue* (sorted by lead priority) and *Lead pipeline* (kanban by lead status, summing estimated price).
8. **Calling pipeline** – every lead starts READY on CALL 1. Four buttons record each call:
   - **ANSWERED** moves the lead to *Spoken to*, keeping its call number.
   - **NO ANSWER** snoozes calls 1-4 for 3 hours and brings the lead back on the next call. On call 5 it goes to *Nurture*.
   - **NURTURE** parks the lead for 6 calendar months, then brings it back on CALL 1.
   - **DNQ** removes the lead for good and keeps its history.

   A scheduled job runs every minute and returns leads whose time is up. Every click is saved as a *Call* record.

## Settings (Settings → Apps → NEXGEN Lead Engine → Variables)

| Setting | Needed for |
|---|---|
| Google Places API key | Finding leads. Google Cloud project with **Places API (New)** enabled and billing on. |
| Anthropic API key | Pitch sites. Without it, leads are still scored. |
| Quote currency | `USD` by default. |
| Auto-build pitch sites | On by default; each site is one Claude API call. |
| Pitch site score threshold | 4 by default. |
| Pitch site Claude model | `claude-opus-5-5` by default; `claude-sonnet-5-5` is cheaper. |
| Calling time zone | `Australia/Sydney` by default. Sets the time zone for the six calendar months of Nurture. |
| Calling admins | Emails, comma separated. These people can undo any call, reverse a DNQ and move Spoken to leads back. |

## Using it

- **Find leads:** Workflows → new workflow → Manual trigger → action **Find leads on Google Maps** → enter a search. Or `POST <CRM URL>/s/nexgen/scan-area` with `{"query": "dentists in Austin, TX", "maxResults": 20}` and an API key as Bearer token.
- **Re-score existing companies:** workflow action **Audit websites**, or `POST /s/nexgen/audit-companies` with `{"companyIds": [...]}`.
- **Build pitch sites on demand:** workflow action **Build pitch sites**, or `POST /s/nexgen/generate-pitch-sites` with `{"companyIds": [...]}`.
- **Call leads:**
  - **Calling → Start calling** is the lead pool: a board with a column per calling status, highest Lead priority first. Snoozed and Nurture cards count down to their next call.
  - Click a lead to open its page on the **Call** tab: the four buttons, the call opener, contacts with phones and emails, address, Google details and website problems. Opening a Ready lead holds it for you for 10 minutes. **Next lead →** opens the top Ready lead.
  - Cards can't be dragged between columns; leads only move through the buttons.
  - The lists are *READY TO CALL*, *SPOKEN TO*, *NURTURE* and *DISQUALIFIED*; numbers are on **Calling reports**.
  - A salesperson can undo their own call for 10 minutes. Calling admins can undo any call at any time.

## Installing on the live CRM

Sign in to the CRM, create an API key (Settings → Developers → API keys, role Admin), then from Windows PowerShell:

```powershell
wsl -u root -- bash /mnt/c/Users/R9AMD/nexgen-crm/nexgen/apps/lead-engine/scripts/install-on-railway.sh
```

Copy the key, then press Enter when it asks: it reads the key from the Windows clipboard (falling back to a hidden paste prompt), installs the app, and on later runs just updates it.

## Developing

App tooling is Linux/macOS only; on Windows use WSL. Node 24.5+ and Yarn 4 (Corepack).

```bash
npm install -g twenty@2.51.3
yarn install
yarn test              # unit tests for scoring, mapping and the HTML sanitizer
yarn typecheck
printf '%s' "$TWENTY_API_KEY" | twenty auth login --with-token --url https://YOUR-CRM-URL --name prod --use
twenty app apply --create   # first install; afterwards just `twenty app apply`
```

The server must run logic functions: set `LOGIC_FUNCTION_TYPE=LOCAL` on both the server and the worker.

When an apply adds a new object, the server may generate the functions' API client before the object is visible. Calls then fail with "type `Query` does not have a field". The server only rebuilds the client when the schema changes, so apply again with any field or description change.

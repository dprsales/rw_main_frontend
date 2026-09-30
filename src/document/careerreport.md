# Careers Report — 30 September 2026

Complete record of today's careers-application work, plus the exact server
commands needed to get it live.

| | |
|---|---|
| **Date** | 30 September 2026 |
| **Scope** | Careers apply page, applicant email, HR email, HEXACO, success animation |
| **Repos** | `merchandising_backend`, `react`, `rw_admin_final` (partial) |
| **Builds** | Backend typecheck + build pass · React build pass |
| **Commits** | **None.** Nothing committed or pushed. All changes are uncommitted. |
| **Live status** | Recovered — root cause was an incomplete `dist`, see §7 |

---

## 1. What was done today

| # | Change | Repo |
|---|---|---|
| 1 | HEXACO score card removed from applicant confirmation | `react` |
| 2 | Careers reference number created — **it never existed before** | both |
| 3 | Success screen redesigned, reference moved to the top | `react` |
| 4 | Lottie animation now loops and replays on hover/click | `react` |
| 5 | Applicant "under review" email created — **none existed at all** | backend |
| 6 | HR email rebuilt as 7 styled cards + a HEXACO scorecard | backend |
| 7 | Logo asset was never copied to `dist` — would 404 in production | backend |
| 8 | All applicant free-text was unescaped in email HTML | backend |
| 9 | Mail credentials unified into shared env config | backend |
| 10 | Admin detail view started — **incomplete** | `rw_admin_final` |

---

## 1a. FRONTEND work today (`react`)

### The careers form — `src/pages/CareersApply.jsx`

The form itself was **not** rebuilt. What changed is what it submits, what it
shows afterwards, and how it looks.

| Change | Detail |
|---|---|
| Removed the HEXACO snapshot card | "YOUR SNAPSHOT" — overall %, three bars, written read-back |
| Removed `hexacoSummary` import | the state, the `setSummary(...)` call and the card JSX are all gone |
| Added `firstName` state | captured at submit, used for "Thank you, Ananya." |
| Added reference display | renders only when a reference exists (see §3 — it never did before) |
| Added `SuccessAnimation` | new import, now looping + interactive |
| Kept raw assessment submission | the candidate still answers all 9 statements |

The form still validates and still ships `hexacoAnswers`. Only the **result** is
withheld. Sections in order: personal details → role → professional summary →
**character & mindset (7 open questions)** → **HEXACO assessment (9 statements)** →
references → resume → cover letter → privacy consent → submit.

Validation that is in place: phone exactly 10 digits via `isValidPhone`, each
character answer capped at `ANSWER_MAX` (300) with a live counter, resume PDF /
DOC / DOCX under 5 MB, privacy consent required, role must come from the
`/jobs` endpoint so it is always a live opening.

### Form content module — `src/data/careersApplication.js`

**Before:** content **+** all scoring. **After:** content only.

Deleted as dead code once the browser stopped scoring:

```
scoreHexaco()      TRAIT_SUMMARY      hexacoSummary()
pctToNumber()      bandFor()
```

Surviving exports — all of them presentational or input-shaping:

```
ANSWER_MAX          300
CHARACTER_QUESTIONS 7 prompts: qImpact, qDuties, qMotivation,
                    qPressure, qGrowth, qLeadership, qFlexibility
LIKERT_MIN          -2
LIKERT_MAX          2
LIKERT              the five button values
likertLabel(v)      +1 / 0 / -1  (explicit + sign, no bare 1)
HEXACO_TRAITS       Integrity, Loyalty, Flexibility
HEXACO_STATEMENT_IDS flat list, used to build the payload
```

`likertLabel` exists because the buttons read `-2 -1 0 +1 +2`, not `1..5`.
Buttons and label had to be changed together.

> The header comment previously said the backend *"runs `scoreHexaco`"* — a
> function that only ever existed in this browser file. Corrected today to "runs
> the HEXACO scoring" so it no longer points at deleted code.

### CSS — `src/form/form.css`

| Selector | Purpose |
|---|---|
| `.rw-form-panel--glow` | careers panel, sits inside `<BorderGlow>` |
| `.rw-form-panel--glow > .rw-form-field-wrap { box-shadow: none; }` | the fix that ended the duplicate outline |
| `.rw-form-ring` | retained focus ring on the outer panel |
| `.rw-success-anim` | wrapper, `cursor: pointer` so hover is discoverable |
| `.rw-success-anim > div` | `transform: scale(1.07)` on hover/active |
| reduced-motion block | neutralises both the transition and the scale |

**The duplicate-outline bug:** the careers panel draws its own animated border,
but `.rw-form-field-wrap` — shared with Partner, CoachingPurchase and
AssessmentForm — also carried a `box-shadow`. Result was a doubled top and left
edge. Scoping the reset to `--glow` means one component's fix did not change the
other three forms.

`form.css` stays fluid by default at a 600px breakpoint. No media queries were
added, and no property outside the `--glow` subtree was touched.

### Success animation — `src/components/SuccessAnimation.jsx` (new)

Full detail in §5. Summary: `lottie-react@3.1.2` + `src/utils/Success.json`
(93.4 kB, `OG_thumbsUP` export). Loops continuously, replays on hover and tap,
pauses in background tabs, and renders the final frame only under
`prefers-reduced-motion`.

---

## 1b. BACKEND work today (`merchandising_backend`)

| Area | Change |
|---|---|
| Schema | `referenceNo?: string` added to the application model |
| Scoring | `src/application/hexaco.ts` — authoritative, server-side only |
| Emails | shared shell + rebuilt HR email + **new** applicant email |
| Delivery | HR and applicant sends now independent `try/catch` |
| Security | all applicant free-text escaped in email HTML |
| Assets | `nest-cli.json` now copies `mail/assets/**/*` |
| Config | `src/mail/mail.config.ts` — shared `MAIL_*`, warn-not-throw at boot |
| Refactor | 9 services moved onto shared mail config |
| Regression | channel partners repointed at shared shell, typo fixed |

New files

```
src/application/hexaco.ts
src/mail/email-shell.ts
src/mail/mail.config.ts
src/mail/assets/rw-logo-ccr.png
.env.example
```

### Reference number (§3)

`nextReferenceNo()` generates `RW-JOB-<year>-0001`, assigned at the model
constructor so it cannot be submitted by a client. Wired into both emails and the
success screen.

### HEXACO scoring (§2)

`src/application/hexaco.ts` is the only place personality is scored.
`application.service.ts` recomputes all four values from the raw answers on every
submission, before saving — client-supplied scores are overwritten, so a tampered
payload cannot influence hiring.

### Email system (§6)

`email-shell.ts` extracted the channel-partner chrome into shared helpers:
`renderEmailShell()`, `card()`, `answerBlock()`, `detailRow()`, `detailRowHtml()`,
`scoreBar()`, `scoreRow()`, `eyebrow()`, `ctaButton()`, `esc()`, `orDash()`,
`formatStamp()`, `pctToNumber()`.

The **applicant email did not exist before today** — the team was notified but the
candidate received nothing. Now sent, with independent error handling so neither
send can block the other or fail the application.

### Mail configuration (§9)

Nine services previously hardcoded or duplicated credentials. All now read
`MAIL_USER` / `MAIL_PASS` from `mail.config.ts`. `leads` keeps its own
`LEAD_MAIL_USER` / `LEAD_MAIL_PASS`. Missing config **warns instead of throwing**
— mail can never take the API down, only sending breaks.

---

## 2. HEXACO assessment

Nine statements, HEXACO-*style* (not the full 240-item inventory — do not
describe it internally as "HEXACO").

- Traits: **Integrity**, **Loyalty**, **Flexibility**
- Three statements each, scale `-2 … +2`
- **Third statement of each trait is reverse-scored** (negated, not `6 − a`)
- Output: 0–100% per trait plus an overall figure

**The server owns the score.** `application.service.ts` recomputes all four
scores from the raw answers on every submission, before the save, overwriting
anything the client sent:

```ts
const scores = scoreHexaco(dto.hexacoAnswers);
dto.hexacoIntegrity = scores.hexacoIntegrity;
// loyalty, flexibility, overall
```

### Removed from the applicant view

The "YOUR SNAPSHOT" card — overall percentage, three bars, written read-back —
is now **internal only**.

Deleted from `react/src/pages/CareersApply.jsx`: the `hexacoSummary` import, the
`summary` state, the `setSummary(...)` call, and the card JSX.

Deleted from `react/src/data/careersApplication.js` as dead code: `scoreHexaco()`,
`TRAIT_SUMMARY`, `hexacoSummary()`, `pctToNumber()`, `bandFor()`.

The form still collects and ships raw answers. Only the **result** is hidden.

---

## 3. Reference number — this was a live bug

The success screen had:

```jsx
Application received{referenceNo ? ` · ${referenceNo}` : ''}.
```

But **`referenceNo` never existed on careers applications.** It had only ever
been built for channel partners (`RW-CP-2026-0001`). So the value was always `''`
and the heading rendered as plain "Application received." — that conditional had
been dead code.

### Fix

- `application.schema.ts` — added `referenceNo?: string`
- `nextReferenceNo()` → `RW-JOB-<year>-0001`, sequential per calendar year,
  mirroring the channel-partner format
- Assigned at the model constructor (`{ ...dto, referenceNo }`) rather than on the
  DTO, so it is **not** client-submittable
- Now also appears in the HR email and the applicant email

Verified the counting regex in isolation, because a wrong pattern silently
numbers every applicant `0001`:

```
regex source : ^RW\-JOB\-2026\-
PASS  RW-JOB-2026-0001   -> true
PASS  RW-JOB-2026-1234   -> true
PASS  RW-JOB-2025-0001   -> false   (different year, excluded)
PASS  RW-CP-2026-0001    -> false   (other flow, excluded)
```

> **Known race:** the number is `count + 1`, so two simultaneous submissions could
> collide. Channel partners has the same pre-existing flaw. Add a unique index +
> retry before volume makes it matter.

---

## 4. Success screen

```
      [ Lottie thumbs-up — looping, replays on hover/click ]

      A P P L I C A T I O N   R E C E I V E D      copper eyebrow

      RW-JOB-2026-0001                              mono, large, the hero

      Thank you, Ananya.                             serif, first name

      Quote that reference if you get in touch…      sets expectations

      [ WHATSAPP THE TEAM ]   [ BACK TO CAREERS ]
```

The reference moved **above** the thank-you as its own element — it is the one
thing the candidate needs in order to act. "Thank you, *first name*." added via
new `firstName` state captured at submit.

Copy constraint respected: no semicolons, no em dashes in rendered copy.

---

## 5. Lottie animation

**Why it looked dead:** it was built `loop={false}` with a single `autoplay`, so it
played once and held the final frame. Not a rendering fault — wrong behaviour.

| Behaviour | Implementation |
|---|---|
| Continuous | `loop` |
| Replay on hover | `onMouseEnter` → `stop()` + `play()` |
| Replay on tap | `onClick` → same |
| Pause in background tab | `visibilitychange` |
| Reduced motion | final frame only, handlers return early |
| Hover feedback | `scale(1.07)`, disabled under reduced motion |

### `lottie-react@3.1.2` API traps

- **There is no `useLottieRef` hook in v3.** It is a plain prop:
  `lottieRef={myRef}` filled with a `LottieHandle`.
- **There is no `goToAndPlay`.** v3 exposes `play()`, `pause()`, `stop()`,
  `seek()`, `setLoop()`. Since `stop()` rewinds to the first playable frame,
  `stop()` then `play()` **is** the replay.

Click is not optional — touch devices never fire `mouseenter`, so without it the
replay is unreachable on a phone. The handler sits on a plain `div`, so there is
no invalid nested-interactive markup.

---

## 6. Emails

### There was no applicant email

Only the internal team was notified. A candidate got **nothing**. Fixed.

Both sends use **independent `try/catch`**, so neither can block the other and
neither can fail the application — the same pattern the channel-partner flow uses.

### `src/mail/email-shell.ts` — new shared module

The channel-partner emails were the only well-designed templates in the codebase,
so that chrome was lifted out and shared rather than duplicated.

| Export | Purpose |
|---|---|
| `renderEmailShell()` | Document, logo header, hairlines, contact footer |
| `card(title, inner)` | Titled hairline-bordered block |
| `answerBlock(prompt, answer)` | Free-text answer on its own panel |
| `detailRow(label, value)` | Label/value — **escapes** |
| `detailRowHtml(label, html)` | For deliberate markup (mailto:, tel:) |
| `scoreBar(pct)` / `scoreRow(label, value)` | Scorecard gauges |
| `eyebrow()` / `ctaButton()` / `anchor()` | Chrome pieces |
| `esc()` / `orDash()` / `formatStamp()` / `pctToNumber()` | Utilities |

Design tokens unchanged: bg `#0B0A09`, card `#141210`, text `#F2EFE9`, muted
`#9A9289`, gold `#C39B53`.

Table-based throughout — Outlook desktop renders with Word's engine and ignores
flexbox/grid. Two-layer responsive: fluid tables for clients that strip
`<style>`, plus a real media query for clients that honour it.

### HR notification — 7 cards

```
Applicant                     ref, email, phone, location, LinkedIn, portfolio, source, consent
Role & expectations           role, experience, current/expected CTC, notice, relocation, work mode
Character & mindset           all seven answers, each its own block
HEXACO personality scorecard  below the other details
References
Cover letter
Attachments
```

Scorecard shows the overall figure at 38px plus three labelled gauges:

```
Integrity     100%  ████████████████████
Loyalty        83%  ████████████████▍
Flexibility    92%  ██████████████████▍
```

Bars are two cells in one row — the filled cell takes `width:X%`, the empty one
absorbs the rest. That is the only bar shape Outlook renders correctly. `bgcolor`
is set alongside the inline style because Outlook ignores inline backgrounds.

The card states explicitly that the applicant never sees this and cannot
influence it, and that it is an interview prompt rather than a verdict.

### Applicant acknowledgement — new

- "Thank you, *Ananya*." / "…and it is now under review."
- Reference in its own gold-bordered block so it can be quoted
- "What happens next" card: read personally, reply within a couple of working
  days, nothing needed from you, reply to add anything
- WhatsApp CTA
- **Explicitly says their assessment results were not sent** — pre-empts the
  obvious "where are my scores?" email without leaking them

No score, no read-back, nothing beyond name and role.

### Channel-partner regression check

Repointed at the shared shell; its own `rw-logo.png` retained but attached under
the same content-id the shell's `<img>` expects. Rendered output compared — no
layout change. Also fixed a user-facing typo: *"your application **an** it is
under review"* → *"and"*.

---

## 7. The production outage — and the npm commands that fix it

### What happened

Every route on `api.rajivwilliams.com` returned **502**, which the browser
reported as a CORS error. It was never CORS.

```
Error: Cannot find module '../users/dto/register-user.dto'
Require stack:
- /root/merchandising_backend/dist/auth/auth.controller.js
```

`dist/auth/auth.controller.js` existed but `dist/users/dto/register-user.dto.js`
did not. Node threw before Nest started, pm2 marked the process dead, and nginx —
with nothing behind it — returned 502.

**Why it looked like CORS:** a 502 from nginx carries no
`Access-Control-Allow-Origin` header. The browser refuses to expose such a
response to JavaScript and reports *"blocked by CORS policy"*, whatever the real
status was. It is a very common misdiagnosis.

**Root cause:** an incomplete `dist`. `nest-cli.json` sets
`"deleteOutDir": true`, so the build **wipes `dist` before writing**. If the wipe
or build dies partway — disk full, OOM, half-finished upload — you get a `dist`
holding some new files and missing others. The same failure mode occurred locally:

```
Error EBUSY: resource busy or locked, unlink 'dist/mentoringleads/schema/mentoringleads.schema.js'
```

Confirmed the source was fine: deleting `dist` locally and rebuilding emitted
`register-user.dto.js` correctly.

### The fix — run these on the server

```bash
cd /root/merchandising_backend

pm2 stop merchandising_backend          # stop FIRST so nothing holds old files
rm -rf dist                             # full wipe, no partial state survives
npm ci                                  # or: npm install
npm run build
echo "build exit code: $?"              # MUST be 0 — if not, stop and read the TS errors

# verify both of today's additions actually landed
ls -l dist/users/dto/register-user.dto.js    # the file that was missing
ls -l dist/mail/assets/rw-logo-ccr.png      # new logo asset

pm2 restart merchandising_backend
sleep 3
pm2 status                              # want: online, NOT errored
pm2 logs merchandising_backend --lines 30
```

If `npm run build` exits non-zero, **stop there** — do not restart pm2, or it
returns to 502 immediately.

### Verify from outside

```bash
curl -i -X OPTIONS https://api.rajivwilliams.com/leads \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
```

Expect `HTTP/1.1 204` with `Access-Control-Allow-Origin: *`.

> **Rule:** never let pm2 restart before a build exits 0. A half-written `dist`
> plus an auto-restarting process is exactly how a deploy takes the API down.

---

## 8. Frontend deploy

Build is **local**, then upload the static output — there is no Node on the
frontend host.

```bash
cd C:/Users/sales/OneDrive/Desktop/RW/react
npm install
npm run build
```

Verify the bundle targets production, not localhost:

```powershell
$m = Select-String -Path "dist/assets/*.js" -Pattern "api\.rajivwilliams\.com" -List
$l = Select-String -Path "dist/assets/*.js" -Pattern "localhost" -List
"api in bundle: " + [bool]$m; "localhost in bundle: " + [bool]$l
```

Expected: `api in bundle: True` / `localhost in bundle: False`.

Upload `dist/*` to the live root, then fix permissions and purge the CDN:

```bash
cd ~/domains/rajivwilliams.com/public_html
chmod 755 assets fonts
chmod 644 assets/* fonts/* index.html robots.txt sitemap.xml
```

Then hPanel → Website → Security & Speed / CDN → **Purge cache** (apex + www),
and hard-refresh.

> `react/.env` still reads `VITE_API_BASE_URL=http://localhost:8088`-era dev
> values during local testing. **Never build with the dev value** or every form
> silently posts to the local machine.

---

## 9. Environment variables

`src/mail/mail.config.ts` — shared across nine services (`application`,
`builders`, `channel-partners`, `highticketcloserform`,
`individualmentoringform`, `luxurysalesmastery`, `organizationalmentoringform`,
`salesarchitecturemasterclass`, `tribhujadigitalform`):

```
MAIL_USER   full sending address
MAIL_PASS   a Gmail *app* password
```

`leads` is deliberately separate via `LEAD_MAIL_USER` / `LEAD_MAIL_PASS`.

Missing config **warns at boot instead of throwing**, so mail can never take the
API down — only sending breaks, and the log says why.

### Spaces in the app password — tested, not a problem

`MAIL_PASS` is unquoted in `.env` with spaces, as Gmail displays it (`xxxx xxxx
xxxx xxxx` = 19 chars, 16 stripped). Confirmed `dotenv` passes it to
`process.env` intact. Tested live against Gmail SMTP (`verify()` only
authenticates, sends nothing):

```
as written (spaces kept) : AUTH OK
spaces stripped          : AUTH OK
```

**Both work.** Gmail normalises the spaces internally. No change needed. Worth
remembering for other providers, where a space in a password is not always
tolerated.

---

## 10. Two bugs fixed today that were invisible in code review

**The logo would have 404'd in production.** `nest-cli.json` copied only
`channel-partners/assets/**/*`, so `src/mail/assets/rw-logo-ccr.png` would never
reach `dist/` — broken in every careers email, while working perfectly locally.
Now `["channel-partners/assets/**/*", "mail/assets/**/*"]`.

**All applicant free-text was unescaped.** Cover letter, seven character answers
and the candidate name were interpolated raw. A candidate typing `<b>` would
corrupt the HR email layout. Verified against hostile input:

| Input | Result |
|---|---|
| `<script>alert(1)</script>` | escaped — no raw `<script>` in output |
| `<b>Mallory</b>` | `&lt;b&gt;Mallory&lt;/b&gt;` |
| `5 < 6 & 7 > 3` | `5 &lt; 6 &amp; 7 &gt; 3` |

Channel partners gained the same protection as a side effect of sharing helpers.

---

## 11. Admin panel — INCOMPLETE

`rw_admin_final/src/Pages/Applications/index.tsx`

**Useful discovery:** the backend `findAll()` has no projection, so the admin
endpoint **already returns every `q*` answer and all four `hexaco*` scores**. No
backend change was needed — the admin simply was not rendering them.

**Done:** interface fields added (`qImpact` … `qFlexibility`, `hexacoIntegrity` …
`hexacoAnswers`), plus `CHARACTER_PROMPTS`, `TRAIT_BANDS`, `TRAIT_KEYS`,
`pctToNumber`. `LinearProgress` and `Stack` imported.

**Not done:** the "In their words" section, the scorecard section, the `bandFor()`
helper, the `TraitScore` component.

**The admin build has never been run**, and the two MUI imports are currently
unused. The detail dialog still shows only contact details, references, resume and
cover letter.

> The written trait bands now exist **only** in this admin file — not in the
> backend. HR email shows numbers and bars only, deliberately, to avoid a third
> copy. If HR should get the narrative, move the bands into
> `src/application/hexaco.ts` so both callers read one source.

---

## 12. Verification performed

| Check | Result |
|---|---|
| Backend `npx tsc --noEmit` | pass |
| Backend `npm run build` | pass |
| React `npm run build` | pass |
| `dist/mail/assets/rw-logo-ccr.png` after build | present, 34,000 bytes |
| `dist/channel-partners/assets` intact | present |
| All 4 email templates rendered | pass |
| `undefined` / `NaN` / `[object Object]` | none |
| `cid:rw-logo` in every template | yes |
| Table tag balance | 29/29, 52/52, 77/77 |
| Scorecard bar widths vs percentages | match |
| Escaping vs hostile input | pass |
| Reference-number regex | 4/4 cases |
| Backend boots and routes respond | verified on a spare port |

Emails were verified by requiring the compiled `dist/` services with a stubbed
transporter that captured HTML instead of sending, rendering all four templates
including a hostile payload. Harness deleted afterwards.

**Not verified:** nothing was opened in a real browser or mail client. Visual
layout, the scorecard as rendered, and the live Lottie loop have not been seen by
a human.

---

## 13. Outstanding work

| # | Item | Where |
|---|---|---|
| 1 | **Finish the admin detail view** — both sections unwritten | `rw_admin_final` |
| 2 | Run the admin build; two unused MUI imports | `rw_admin_final` |
| 3 | Unique index on `referenceNo` + retry, to close the numbering race | `application.schema.ts` |
| 4 | Move trait read-back copy into the backend as single source | `application.service.ts` |
| 5 | Remove the inline `LEAD_MAIL_PASS` fallback | `leads.service.ts` |
| 6 | Rotate all credentials — old values remain in git history | both repos |
| 7 | `npm audit`: 13 vulnerabilities (5 moderate, 8 high) | `react` |
| 8 | Consider `LottieLight` — bundle ~1,236 kB vs ~991 kB. Safe: JSON has no expressions | `react` |
| 9 | Fix `origin: '*'` + `credentials: true` — spec-invalid, works only because nothing sends credentials | `main.ts` |
| 10 | Visual QA in a real browser and mail client | — |
| 11 | **Commit and push — nothing is committed** | both repos |

---

## 14. Local test setup

**Backend** — `.env` mail vars present, recipients pointed at
`tech@rajivwilliams.com` for local testing. Source defaults remain `hr@` with
`connect@` copied. Port `8088`, no global API prefix.

**React** — `VITE_API_BASE_URL` must point at production when building for
deploy, and at `http://localhost:8088` when testing locally. Restart Vite after
changing it.

**Assessment values that produce a high score** — buttons are
`-2, -1, 0, +1, +2`, **not** 1–5:

```
int1 +2   int2 +2   int3 -2      Integrity   100%
loy1 +1   loy2 +1   loy3 -1      Loyalty      83%
flex1 +2  flex2 +1  flex3 -2      Flexibility  92%
                                    Overall     92%
```

Form constraints: phone exactly 10 digits · character answers max 300 characters
· resume PDF/DOC/DOCX under 5 MB · privacy consent required · role must come from
the local `/jobs` endpoint.

---

## 15. File manifest

### `merchandising_backend` — branch `master`, last commit `f786c7d` (28 Sep)

Modified

```
nest-cli.json                                       + mail/assets copied to dist
src/application/application.service.ts               + cards, scorecard, applicant email, referenceNo, escaping
src/application/schema/application.schema.ts         + referenceNo
src/application/dto/create-application.dto.ts
src/builders/builders.service.ts                    \
src/channel-partners/channel-partners.service.ts    /  shared MAIL_* credentials
src/highticketcloserform/highticketcloserform.service.ts
src/individualmentoringform/individualmentoringform.service.ts
src/leads/leads.service.ts                            separate LEAD_MAIL_*
src/luxurysalesmastery/luxurysalesmastery.service.ts
src/organizationalmentoringform/organizationalmentoringform.service.ts
src/salesarchitecturemasterclass/salesarchitecturemasterclass.service.ts
src/tribhujadigitalform/tribhujadigitalform.service.ts
```

New

```
.env.example                           documented mail variables
src/application/hexaco.ts              authoritative scoring
src/mail/email-shell.ts                shared email chrome
src/mail/mail.config.ts                shared credentials
src/mail/assets/rw-logo-ccr.png        logo for the shared shell
document/careerreport.md               this report
```

### `react` — last commit `40201e3` (29 Sep)

Touched today

```
src/pages/CareersApply.jsx             form, success screen, scorecard removed
src/form/form.css                      single outline, animation styles
package.json / package-lock.json       lottie-react@3.1.2
```

New

```
src/pages/CareersApply.jsx
src/data/careersApplication.js         form content only; scoring deleted
src/components/SuccessAnimation.jsx    looping + interactive Lottie
src/utils/Success.json                 OG_thumbsUP export, 93.4 kB
document/careerreport.md               this report
```

Also modified in this repo but **not** today's work: `src/App.jsx`,
`src/components/BookingModal.jsx`, `src/components/GuidedFinder.jsx`,
`src/data/booking.js`, `src/data/content.js`, `src/data/seo-config.js`,
`src/pages/Careers.jsx`.

### `rw_admin_final` — incomplete

```
src/Pages/Applications/index.tsx        interface + constants only; UI not written
```

---

## 16. Constraints worth keeping

- `.rw-form-panel` in `form.css` is **shared** with Partner, CoachingPurchase and
  AssessmentForm. Careers styling stays under `.rw-form-panel--glow`.
- Form CSS is fluid by default at a 600px breakpoint — no media queries.
- Rendered careers copy: no semicolons, no em dashes. Code comments may use them.
- Backend scoring is authoritative; nothing scores personality in the browser.
- `.env` holds live secrets — never commit, never overwrite the server's copy.
- `deleteOutDir: true` means a failed build leaves a broken `dist`. Always wipe
  and rebuild, and check the exit code.

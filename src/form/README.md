# `src/form/` — pre-consultation assessment

A self-contained React component: a track picker, one of three questionnaires
(Coaching, Consulting, Realty), and a confirmation. Nothing in this folder
imports from outside it, so the folder can be copied into another project on its
own. React 18 is the only dependency.

```
form/
  AssessmentForm.jsx   the component
  tracks.js            the three questionnaires, as data
  form.css             all styles, including the brand tokens
  useReveal.js         the scroll-in animation hook
  README.md
```

## Use

```jsx
import AssessmentForm from './form/AssessmentForm'

<AssessmentForm onSubmit={(payload) => post('/saleleads', payload)} />
```

| Prop | Default | What it does |
| --- | --- | --- |
| `initialTrack` | — | `'coaching' \| 'consulting' \| 'realty'`, opens that questionnaire and skips the picker. Anything else is ignored. |
| `onTrackChange(key \| null)` | — | Fires on every pick and on going back, so the host can mirror the choice into the URL. |
| `onSubmit(payload)` | logs to console | Receives `{ track, answers, submittedAt }`. |
| `stickyOffset` | `0` | Px from the top of the viewport where the progress rail parks — set this to the height of the host page's own sticky header. |

`answers` is keyed by question `id`: a string for `pill`, `input` and `text`
questions, an array of strings for `check`.

## On this site

[`src/pages/Form.jsx`](../pages/Form.jsx) is the whole integration — it adds the
site header and footer, measures the header for `stickyOffset`, and maps
`onTrackChange` onto the URL path. The routes are `/form` and `/form/:track` in
[`src/App.jsx`](../App.jsx), so each questionnaire has an address of its own:

- `/form` — the track picker
- `/form/coaching`
- `/form/consulting`
- `/form/realty`

An unknown or differently-cased segment redirects to the canonical URL, and the
older `/form?track=x` links redirect onto `/form/x`. React Router matches
case-insensitively, so `/FORM` resolves there too.

Submission is not wired yet. `POST /leads` requires a name, email and ten-digit
phone, none of which this form asks for — those arrive with the Meta lead form
upstream. Either widen the endpoint, or carry the lead id through in the query
string and `PATCH` it from `onSubmit`.

## Colours and type

`form.css` declares the black-and-gold tokens (`--bg`, `--ink`, `--faded`,
`--line`, `--copper` `#C39B53`, `--gold-gradient`, `--chip`, `--card`) on
`.rw-form`. On this site the identical names are already set on `:root` by
`global.css` and win, so the form tracks the live palette rather than a copy of
it that can drift. Anywhere else, those values are the palette.

The faces are Cormorant Garamond (display) and Jost (everything else), named in
`form.css` but **not loaded by it** — this site fetches both in `index.html`. A
project without them falls back to its system serif and sans.

## Editing the questions

Everything a visitor reads is in `tracks.js`; nothing needs touching in the
component. A question is:

```js
{ id, type, required, title, help?, options?, inputType?, placeholder? }
```

`type` is one of `pill` (one of `options`), `check` (any number of `options`),
`input` (one line, `inputType` is the `<input type>`), or `text` (a paragraph).
`id` is what the answer is keyed by, so keep it unique within its track and
stable once submissions are flowing.

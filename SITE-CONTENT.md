# Site content snapshot — rajivwilliams.com

A copy-only record of every piece of user-facing text on the site. Nothing here is read by the
app — it is a reference so the copy can be reviewed or restored without reading JSX.

**Updated 1 August 2026**, after the rewrite that took the marketing copy off the
"structured mastery / disciplined execution" register and into plainer, spoken English.
Testimonials and factual records (projects, roles, education, memberships) were left exactly
as they were.

**Where each block lives** is noted under every heading, so an edit made here can be applied
back to the right file.

Routes: `/` · `/coaching` · `/consulting` · `/realty` · `/realty/portfolio` ·
`/projects/:slug` (project detail, content served live from `api.rajivwilliams.com`).

---

## Global

*Source: `react/src/theme.js`, `react/src/components/Header.jsx`, `react/src/components/Footer.jsx`*

**Contact**
- Email — connect@rajivwilliams.com
- Phone — +91 95495 46568
- Happening Hyderabad ↗ — https://www.linkedin.com/company/hyderabad1st/
- LinkedIn ↗ — https://www.linkedin.com/in/rajivwilliams/
- Instagram ↗ / YouTube ↗ / Facebook ↗ / X ↗ — `#` (placeholder URLs, not yet supplied)

**Wheel menu (same on every page)**
Home · Coaching · Consulting · RW Realty · Portfolio · Book a call

**Marquee strip (home)**
RERA registered · Member — HRA & NAR India · 500+ professionals mentored · 4.9/5 rating ·
15+ years in luxury real estate · Clarity · Confidence · Conversion

### Booking modal

*Source: `react/src/components/BookingModal.jsx` (submission stubbed — see `data/booking.js`)*

- Eyebrow — BOOK A STRATEGY CALL
- Heading — Tell us a bit about it.
- Intro — Leave your details and we will call you to fix a time. No obligation either way.
- Fields — Name * · Email * · Phone (Optional) · I'm interested in · Message
- Interest options — Coaching · Consulting · RW Realty mandate · Something else
- Placeholders — "Your full name" · "you@company.com" · "Optional" · "Select one…" ·
  "What would you like to discuss? (optional)"
- Submit — Request my call / Sending…
- Success eyebrow — REQUEST RECEIVED
- Success heading — Got it. We'll call you.
- Success body — Someone from the team will be in touch within a working day to fix a time.
  If it is urgent, ring +91 95495 46568.

---

## Home — `/`

*Source: `react/src/pages/Home.jsx`, copy blocks from `react/src/data/content.js`*

### Hero

- Eyebrow — RAJIV WILLIAMS · LUXURY SALES MENTOR, HYDERABAD
- Headline — Clarity. / Confidence. / *Conversion.*
- Body (`HERO_COPY`) — Selling a fifty-crore apartment is not the same job as selling a
  fifty-lakh one. The buyer asks different questions, and most of what works lower down the
  market falls flat. We teach sales teams how the top of the market actually buys.
- CTAs — BOOK A STRATEGY CALL · The story →
- Stats — 500+ PROFESSIONALS MENTORED · 4.9/5 CLIENT RATING
- Meta — 15+ YEARS IN LUXURY REAL ESTATE | RERA REGISTERED | MEMBER — HRA & NAR INDIA

### Philosophy

- Heading — Nobody here will tell you to / *believe in yourself.*
- Body — What we teach came out of deals in this city, most of them hard ones. We do two
  things. We train sales teams who are selling premium homes, and we work with developers
  whose projects are good but are not moving the way they should.

### About (`#about`)

- Eyebrow — ABOUT / (01)
- Heading — Fifteen years, / mostly in this city.
- Para 1 — I have spent my career in Hyderabad luxury real estate, first running sales for a
  developer and now on my own. RERA registered, and a member of HRA and NAR India.
- Para 2 — My team works at both ends of the same problem. On one side, advising UHNW families
  on what is worth buying in Hyderabad. On the other, training the people selling to them, and
  sorting out the sales operation behind the project.

*This is the only block on the site written in Rajiv's own voice. Everywhere else the site
speaks as "we". See the note on voice at the foot of this file.*
- Footer row — RERA REGISTERED · MEMBER — HRA & NAR INDIA · HYDERABAD, INDIA

### How we work with people — the three ways in (`WAYS`)

| # | Kicker | Title | Line | CTA |
|---|--------|-------|------|-----|
| I | COACHING · FOR SALES PROFESSIONALS | Learn how the top of the market buys. | Better questions, calmer rooms, and fewer deals given away on price. | Coaching → `/coaching` |
| II | CONSULTING · FOR DEVELOPERS, SENIOR SALES LEADERSHIP & TOP CLOSERS. | Your product is fine. The selling isn't. | We go through how your team sells, find where it leaks, and rebuild that part. | Consulting → `/consulting` |
| III | RW REALTY · MANDATE MODEL | You build it. We sell it. | One team carrying the sales number on your project, from launch to the last unit. | RW Realty → `/realty` |

### Long-form programme blocks (`PROGRAMS` — data retained, not currently rendered on home)

**(I) COACHING · FOR SALES PROFESSIONALS — Learn how the top of the market buys.**
We train premium and luxury residential sales teams. Most of the work is unlearning habits
picked up in the mid-market: talking too early, answering questions nobody asked, dropping the
price the moment a buyer goes quiet. Everything we teach came out of deals we have sat in, so
it holds up in the room rather than only in the classroom. *CTA: Explore coaching*

**(II) CONSULTING · FOR DEVELOPERS, SENIOR SALES LEADERSHIP & TOP CLOSERS. — Your product is fine. The selling isn't.**
We sit with developer teams and go through the whole thing: how leads come in, what happens to
them, who follows up, what the CRM actually records, how a site visit runs. Then we fix what is
broken and write down how it should work, so it survives the next person who joins.
*CTA: Explore consulting*

**(III) RW REALTY · MANDATE MODEL — You build it. We sell it.**
On a handful of projects each year we take the sale itself. Our team runs the pricing, the site
visits, the negotiations and the reporting, and answers for the number at the end of every
month. You get one partner to call instead of four. *CTA: Explore RW Realty*

### Glimpses (shared component)

*Source: `react/src/components/GlimpsesSection.jsx`*

- Eyebrow — GLIMPSES · Heading — A normal week. · Link — VIEW FULL PORTFOLIO →
- FIG 01 — Training session — Rajiv running a session at the whiteboard
- FIG 02 — Between calls — Rajiv working at his desk
- FIG 03 — Before the room — Rajiv preparing before a session
- FIG 04 — Hyderabad office — The RW Team

### Blogs (`#blogs`)

- Eyebrow — WRITING · Heading — Things worth writing down. · Note — CLICK ANY POST TO READ ↗
- Button — Load more

Live posts come from the blog API; the six entries below (`BLOGS` in `content.js`) are the
fallback shown if the feed fails. All currently link to
`linkedin.com/in/rajivwilliams/recent-activity/all/` and are still **placeholder posts** —
the titles were rewritten but no article stands behind them yet.

1. **SALES CRAFT** — The first ninety seconds decide the rest of the meeting — We treat the
   opening as small talk. The buyer is using it to work out whether you are worth an hour.
2. **BUYER PSYCHOLOGY** — When a buyer says it is expensive, they usually mean something else —
   Four things that hide behind a price objection, and how to find out which one you are
   dealing with.
3. **PROCESS** — Your pipeline is a list of names, and that is the problem — If there is no date
   and no next step against a buyer, they are not in your pipeline. They are a memory.
4. **TEAM BUILDING** — What to look for when you hire for a luxury sales floor — You can teach
   anyone the floor plans in a fortnight. You cannot teach someone to stay calm in front of a
   buyer worth crores.
5. **MARKET NOTES** — Where the west corridor is actually selling in 2026 — Some of the
   absorption everyone is quoting is real. Some of it is launch noise. A few ways to tell them
   apart.
6. **POSITIONING** — Posting every day is not a personal brand — What you want is your name
   coming up in a room you are not sitting in. That is built differently.

### Testimonials (`HOME_TESTIMONIALS`) — unchanged, real quotes

- Heading — People we've worked with
- "Rajiv negotiates like the asset is his own — his deep understanding of local market
  dynamics gave us a very good perspective on the opportunities in Hyderabad." — **SANDEEP KYLAS**
- "He always says, 'do it with your passion and heart or else don't do it.' Having a mentor
  like him makes you sharper on tasks, skills, focus and life." — **MALLAREDDY PUTLURI**
- "His expertise and guidance were instrumental in my professional growth — the best mentor I
  have come across." — **MOHAMMED SHIRAZ**

### Closing (`#apply`)

- Quote — Clarity. Confidence. Conversion. *(brand line, kept)*
- Attribution — — RAJIV WILLIAMS
- CTA — BOOK A STRATEGY CALL

---

## Coaching — `/coaching`

*Source: `react/src/pages/Coaching.jsx`, `ACHIEVE` / `COACHING_PROGRAMS` /
`COACHING_TESTIMONIALS` in `content.js`*

### Intro

- Eyebrow — PREMIUM SALES COACHING
- Headline — Your product is excellent. / *Learn to sell it that way.*
- Standfirst — Coaching for people who sell expensive homes.
- Body — A buyer at this level has done their reading, has an opinion on the market, and can
  tell within minutes whether you know more than they do. We work on the part of the job that
  decides those meetings: what you ask, how you answer, and when you say nothing at all.
- CTAs — BOOK A STRATEGY CALL · Explore coaching programs →
- Stats — 500+ PROFESSIONALS MENTORED · 4.9/5 CLIENT RATING

### What changes

- Eyebrow — WHAT CHANGES · Heading — Six things you should notice.
- Standfirst — Not immediately. But within a quarter, these are the differences teams tend to
  report back.

| # | Title | Body |
|---|-------|------|
| 01 | Close more of what you already have | Most teams do not have a lead problem. They have twenty warm buyers nobody has called back properly. |
| 02 | Stop paying for the deal with discount | Learn to hold your price by explaining what it buys, instead of shaving it every time a buyer pauses. |
| 03 | Get comfortable with bigger buyers | HNI clients are not harder to talk to. They just notice sooner when you are guessing. |
| 04 | Sound like the expert in the room | How you speak, what you ask, when you stay quiet. This is the part that separates two people selling the same flat. |
| 05 | Understand what is really being decided | At this ticket size the objection you hear is rarely the objection they have. Learn to find the real one. |
| 06 | Find where your deals die | Deals do not usually collapse. They go quiet at a specific stage, and that stage is fixable once you can see it. |

### The two programmes (`#premium-programs`)

- Eyebrow — THE TWO PROGRAMMES
- Heading — Pick the one that matches your market
- Standfirst — Both run for individual salespeople and for whole floors. If you are not sure
  which fits, tell us what you are selling and we will say.
- Card CTA — ENQUIRE NOW

**Luxury Sales Mastery** — (PROGRAMME 1 · PREMIUM & LUXURY RESIDENTIAL)
For people selling premium and luxury homes. The product is usually excellent. The selling is
usually where the project loses money.
- How HNI buyers actually decide, and who else is in that decision
- Advising instead of pitching
- Handling objections without touching the price
- Running a site visit that does more than show rooms
- Language, tone and presence
- Roleplay on real deals, not invented ones
- Live deal reviews and corrections on the floor
- Following up properly, and keeping a pipeline honest

**Uber Luxury Sales Mastery** — (PROGRAMME 2 · ULTRA-PREMIUM · UHNWI & NRI)
For teams working with UHNW buyers, NRI clients and branded residences. Fewer buyers, longer
conversations, and very little room to sound unprepared.
- Reading a UHNW buyer before the first meeting
- Negotiating when the other side negotiates for a living
- Selling the experience of the home, not the spec sheet
- Mapping a family decision, including the people who never visit
- Justifying the price without apologising for it
- Staying in touch over months without becoming a nuisance

### Testimonials — unchanged, real quotes

- "Working with Mr. Rajiv Williams is a constant learning experience. He always says, 'do it
  with your passion and heart or else don't do it.' Having a mentor like him makes you perfect
  in terms of tasks, learning, and focus." — **MALLAREDDY PUTLURI**
- "I had the pleasure of being mentored by Mr. Rajiv Williams in developing my interpersonal
  skills. He pushed me to expand my skills and always made time to offer support. By far the
  best mentor I have come across." — **MOHAMMED SHIRAZ**

### Closing

- Heading — Tell us what you sell, and we'll tell you where to start.
- CTA — BOOK A STRATEGY CALL

---

## Consulting — `/consulting`

*Source: `react/src/pages/Consulting.jsx`, `DEVELOPER_SHIFTS` / `ECOSYSTEM` /
`SUPPORT_SERVICES` in `content.js`*

### Intro

- Eyebrow — CONSULTING · FOR DEVELOPERS, SENIOR SALES LEADERSHIP & TOP CLOSERS.
- Headline — The building is ready. / *The sales operation is not.*
- Standfirst — Sales consulting for luxury real estate developers.
- Body — You spent four years and a great deal of money getting the product right. Then it goes
  to a sales team working off a spreadsheet, a CRM nobody updates, and whatever the last agency
  set up. We come in, find where the enquiries are being lost, and rebuild that part with your
  people.
- CTA — REQUEST A SALES CONSULTATION

### Why we do this

- Eyebrow — WHY WE DO THIS
- **01 What we are here to do** — Build sales operations that keep working after we leave, so a
  developer stops guessing what next quarter looks like.
- **02 Where we want this to go** — Luxury real estate in this city is sold far below the
  standard of what is being built. We would like to be part of closing that gap.

### The developer challenge (`#challenge`)

- Eyebrow — THE DEVELOPER CHALLENGE
- Heading — Four things we hear in almost every first meeting, *and what we do about them.*

| # | From | To | Note |
|---|------|----|------|
| 01 | A good month, then a bad one | A sales plan you can repeat | Nobody can tell you why March worked and April did not. |
| 02 | Closing by discount | Closing on the value | Every rupee off the price came out of your margin, not the buyer. |
| 03 | One person carrying the team | A team that all sell well | When your best closer takes leave, the month goes with them. |
| 04 | Nobody knows the real numbers | A pipeline you can actually read | The report says forty leads. It does not say which four will buy. |

### How an engagement runs (`#model`)

- Eyebrow — HOW AN ENGAGEMENT RUNS
- Heading — Four stages. We look, we build, we stay until *the team is running it without us.*

**Phase 1 · We look at what you have** — Two weeks of reading your numbers, sitting in on calls,
walking your site visit as a buyer would.
- How the sales process runs today, step by step
- What the CRM records, and what it quietly misses
- Who on the team is strong, and where the gaps are
- Whether the positioning matches who is actually buying
- The site visit, walked end to end

**Phase 2 · We build what is missing** — Then we write the sales process your project should be
running, in enough detail that a new joiner can follow it.
- A sales strategy for this project, not a generic one
- How HNI and UHNW enquiries get handled differently
- Where leads come from, and who calls them back by when
- A pipeline view that shows what is really going to close
- The whole thing written down as SOPs

**Phase 3 · We put it into practice** — A plan nobody follows is worth nothing, so we stay on
the floor until the team is actually working this way.
- CRM set up properly, with dashboards people use
- The routine work automated so it stops being forgotten
- The team trained on the new process, not just told about it
- Targets, reviews and performance tracking in place
- The site visit rehearsed until it runs the same every time

**Phase 4 · We tune it as the market answers** — Once real bookings start coming in, the plan
meets reality. That is when the useful adjustments get made.
- Monthly reviews against numbers that mean something
- Changes made on what the sales data is telling us
- Getting leadership and the sales floor saying the same thing
- Sharpening how the project is talked about in the market

### Other things we get asked for (`#support`)

- Eyebrow — & MORE · Heading — Other things we get asked for.
- Standfirst — None of this is part of the core engagement. Developers ask, we have people for
  it, so it is here.

| Service | Description |
|---------|-------------|
| Social Media & Brand Presence | Keeping the project visible between launches, so buyers have heard the name before they see the hoarding. |
| Performance Marketing | Paid campaigns run for enquiries worth calling, not for the impression count. |
| Media & PR Collaborations | Getting the project written and talked about, including through platforms like Happening Hyderabad. |
| Organic Video Marketing | Video that shows the property and the people behind it, rather than another walkthrough set to music. |
| Podcasts & Authority Building | Putting founders in conversations where buyers and brokers are listening. |
| Channel Partner Networking | Getting brokers who matter in Hyderabad to know your project and want to show it. |
| Vendor Management | Handling the people you would otherwise be chasing yourself. |
| Sales Hiring | Finding salespeople who can hold a conversation at this ticket size. |
| Workforce Structuring | Sorting out who reports to whom, and who owns which number. |
| Brand Positioning & Market Narratives | Deciding what the project stands for before the market decides for you. |

### Testimonial — unchanged, real quote

"I had the privilege of consulting with Rajiv for a real estate matter in Hyderabad, and I
couldn't have asked for a better advisor. I wholeheartedly recommend him to anyone seeking
expert real estate consultation." — **SANDEEP KYLAS**

### Closing (`#talk`)

- Heading — Start with the audit. You will know inside a fortnight whether we are useful.
- CTA — REQUEST A SALES CONSULTATION

---

## RW Realty — `/realty`

*Source: `react/src/pages/Realty.jsx`, `MANDATE_SCOPE` in `content.js`*

### Intro

- Eyebrow — RW REALTY · MANDATE MODEL
- Headline — We take ownership / *of the sale.*
- Standfirst — "You Build, We Sell." — RW Team
- Body — On a small number of projects we take the sale itself rather than advising on it. Our
  team sits at your site, runs the pricing and the negotiations, reports to you like an in-house
  sales head would, and answers for the number at the end of every month.
- CTA — DISCUSS A MANDATE

### What the mandate covers (`#scope`)

- Eyebrow — WHAT THE MANDATE COVERS · Heading — Eight things that stop being your problem.
- Standfirst — From pricing and site visits through to the closing call and the report that
  lands on your desk each morning.

1. The sales strategy, and answering for whether it works
2. Our own trained team sitting at your site
3. Every lead, from the first call to registration
4. Pricing, payment plans and how each deal is put together
5. Stepping into the big negotiations ourselves
6. Designing the site visit and fixing what loses buyers
7. CRM run properly, with a report on your desk daily
8. Building the name with HNI and NRI buyers

### Why it works (`#why`)

- Eyebrow — WHY IT WORKS
- Heading — One number to ask about, and one person to ask.
- Body — On most projects the sale is split between brokers, an in-house team and a marketing
  agency. Each is measured on something different, and when a month goes badly none of them is
  quite responsible. Under a mandate that ambiguity goes away. We carry it.
- Pull quote — We take on very few of these, and we turn down more than we accept. It only works
  where the developer means to see it through.

### Selected clients (`#clients`)

- Eyebrow — SELECTED CLIENTS · Heading — A few of the names. · Link — VIEW FULL PORTFOLIO →
- Logo marquee — Vamsiram · Zuari Infraworld · Landmark Group · IRA · Suchirindia ·
  Sri Aditya · The Trilight · Rohas Ventures

### Closing (`#apply`)

- Heading — We only run a few of these at a time. Come and talk early.
- CTA — DISCUSS A MANDATE

---

## Portfolio — `/realty/portfolio`

*Source: `react/src/pages/Portfolio.jsx`, `content.js`*

### Intro

- Eyebrow — PORTFOLIO
- Headline — Fifteen years of rooms *in this city.*
- Body — Training rooms, launches, association meetings, and a good number of site visits. This
  is where the work has taken him, and who it has been with.

### Track record

500+ PROFESSIONALS MENTORED · 30+ LUXURY PROJECTS REPRESENTED ·
15+ YEARS IN LUXURY REAL ESTATE · 4.9/5 CLIENT RATING

### The track — experience (`#experience`)

- Eyebrow — THE TRACK
- Heading — It started on a process floor at Dell.
- Body — From there into operations, then developer sales, and eventually running his own
  practice. The order matters: the process habits came first, and the selling was built on top
  of them.
- Note — ALL ROLES · HYDERABAD, INDIA

**The practice today** — *Mentoring, and running sales mandates*
- Rajiv Williams — Luxury Sales Mastery · Luxury Sales Mentor · Coach & Consultant **(CURRENT)**
- Dezign Shark · Business Owner

**Mentoring & advisory** — *Retained by eight developer and design businesses*
- Tejase Developers · Sales Mentor
- IRA Realty India · Sales & Marketing Mentor
- TAR Group · Organizational Mentor
- Suchirindia · Business Mentor
- Ornate Interiors · Strategic Partner
- Landmark Group India · Organizational Mentor
- Avani Projects · Strategic Partner
- Magnifiq Properties · Strategic Partner

**Developer sales leadership** — *Carrying the number himself, not advising on it*
- PVR Developers India · Director — Sales, Marketing & Business Development

**Enterprise foundations** — *Where the habits around process came from*
- Systel · Operations & Client Relations Manager
- Dell · Sr. Process Executive

### In their words (`#voices`) — all quotes unchanged

- Eyebrow — IN THEIR WORDS · Heading — What people have said.
- Counter — 11 VOICES · HYDERABAD'S LUXURY MARKET
- Button — SHOW ALL 11 VOICES / SHOW FEWER

**Lead quote** — "His 'Luxury Sales Mastery' framework is a game-changer — it shifts the focus
from chasing the lead to commanding the room, with psychological precision and consultative
grace. The result? A massive boost in my conversion rates."
— **AMARJEET JAT**, AGM Sales & Hospitality, Moonglade

- "Rajiv is exceptional in what he does and consistently goes above and beyond to deliver
  outstanding results and ensure the success of the projects. I wholeheartedly recommend him."
  — **SUMANTH REDDY**, Chairman, NAR India
- "I couldn't have asked for a better advisor. Rajiv's deep understanding of the local market
  dynamics gave us a very good perspective on the opportunities in Hyderabad."
  — **SANDEEP KYLAS**, VP, Fintech & Payments, Zenoti · Ex-Amazon
- "His ability to streamline systems, build effective strategies, and guide teams with clarity
  makes a significant impact on organizational success — especially in consultative selling and
  process-driven execution." — **ARUN KUMAR ADGAPURAM**, Head of Direct Sales, Zuari Infra
- "Rajiv's expertise in the luxury real estate market is unparalleled. His ability to connect
  with clients uniquely, tailoring his approach to their mindset, is truly remarkable."
  — **CHAKRAVARDHAN REDDY KESARI**, Data Engineering Lead
- "He taught us how to connect with each client uniquely, tailoring our approach based on their
  background, needs and mindset. His guidance helped us build trust and long-term relationships."
  — **SHRUTI SHARMA**, Legal Consultant · Real Estate & REIT Compliance
- "He always says, 'do it with your passion and heart or else don't do it.' His dedication
  inspires everyone to give our best. Having a mentor like him makes you perfect in tasks,
  learning and focus." — **MALLAREDDY PUTLURI**, Sr. Sales Manager, Raghava
- "Need market insights? He's got them. Have a real estate query at midnight? Don't be surprised
  if he replies in seconds. He simplifies things and always delivers with speed and clarity."
  — **ARUN K GATTU**, VP, Sales & Marketing
- "A professional with a deep understanding of the business and a continuous learner. Very good
  at relationship management, time and task management, and structured case analysis."
  — **PRASAD KLNV**, Business Consultant · 25+ Years in Sales & Operations
- "He has an exceptional ability to inspire and motivate. His insights in high-ticket real
  estate sales are invaluable, and his guidance helped me tackle complex challenges with
  confidence." — **SUMANA SOUJANYA UNDETI**, Assistant Manager, Sales
- "His expertise and guidance were instrumental in my professional growth — he pushed me to
  expand my skills and always made time to offer support. By far the best mentor I have come
  across." — **MOHAMMED SHIRAZ**, Sales & Strategic Management · 14 Years

### Organisations (`#organisations`)

- Eyebrow — ORGANISATIONS WE'VE WORKED WITH · Heading — Who we have worked with.

Vamsiram · Vamsiram Homes · The Cascades Neopolis · The Trilight · Sri Aditya ·
Blue Fin Realty · Tribhuja · Candeur Constructions · IRA · Manbhum · DPR Construction ·
Zuari Infraworld · Landmark Group · Suchirindia · Kolla · Nesta Developers ·
Tejase Developers · Haneesh Constructions · Vibrant Developers · Anantha Projects ·
Avani · Gangothri · Identity · Rohas Ventures · CSK Builders & Developers ·
Mirai Infracon · e-Infra

*(Only names with a supplied logo currently render; the rest are held in data.)*

### Credentials & memberships (`#credentials`)

- Eyebrow — CREDENTIALS & MEMBERSHIPS
- Chips — RERA Registered · Member — HRA · Member — NAR India · Concierge to Iconic Realty Brands
- Hyderabad Realtors Association — Active Member
- National Association of Realtors — India — Member

### Closing (`#apply`)

- Heading — Easiest way to find out if we can help is to call.
- CTA — BOOK A STRATEGY CALL

---

## Selected inventory — the territory map

*Source: `react/src/components/ProjectsSection.jsx` (rendered on both `/realty` and
`/realty/portfolio`), data in `content.js`*

- Eyebrow — SELECTED INVENTORY · Heading — The projects behind the numbers.
- Standfirst — Developments across Hyderabad that the team has sold, mentored on, or held the
  mandate for. Most of them sit in the west corridor, which is where this market has been for
  the last decade.
- Filters — All · Active · Under Construction · Mandate · Ready for Interiors
- Header row — `NN PROJECTS · 17 LOCALITIES` / `HYDERABAD · WEST CORRIDOR · SCHEMATIC`
- Hint — TAP A PROJECT TO VIEW ITS PAGE
- Status marks — A / UC / M / RFI

**Localities (17)** — Shankarpally · Mokila · Kollur · Neopolis · Gandipet · Kokapet ·
Manchirevula · Raidurgam · Narsingi · Financial District · Puppalaguda · HITEC City ·
Shaikpet · TGSPA Junction · APPA Junction · Tukkuguda · Mamidipally

**Projects (31)** — unchanged

| Project | Area | Status |
|---------|------|--------|
| Acasa | Kokapet | Active |
| Amaris | Financial District | Active |
| Promenade Villas | Kollur | Active |
| Aparna One | Shaikpet | Active |
| Niche | Shaikpet | Active |
| Palatium | APPA Junction | Ready for Interiors |
| Rainbow Waters | Raidurg — Gachibowli | Under Construction |
| Megaleio | TGSPA Junction | Under Construction |
| Villa Verde | Green Hills Road, HITEC City | Mandate |
| MSN One | Neopolis | Mandate |
| Skymarq | Narsingi, Financial District | Mandate |
| CINQ | Financial District | Mandate |
| Sylvanor | Mokila | Mandate |
| Iris | Raidurgam | Under Construction |
| Trilight | Golden Mile, Kokapet | Mandate |
| Skyline | Financial District | Under Construction |
| Songs of the Sun | Financial District | Under Construction |
| Rise With 9 | Neopolis | Under Construction |
| Bayleaf | Manchirevula | Under Construction |
| Yula Globus | Neopolis, Kokapet | Under Construction |
| Sage | Kollur | Mandate |
| Bridge Epsilon | Tukkuguda | Mandate |
| Allura | Kokapet | Mandate |
| Luxury Park II | Mamidipally | Mandate |
| ONE OAK | Manchirevula | Mandate |
| The Twins | Puppalaguda | Mandate |
| Ankura Homes | Shankarpally | Mandate |
| Som Boulevard | Mokila | Mandate |
| Cascades | Kokapet | Mandate |
| Bliss in the Woods | Kokapet | Mandate |
| Mirai Mist | Gandipet | Mandate |

*ONE OAK has no published detail page (no entry in `PROJECT_SLUGS`), so it renders as plain
text rather than a link. All other 30 projects link to `/projects/<slug>`.*

---

## Project detail — `/projects/:slug`

*Source: `react/src/pages/Project.jsx`*

This page carries **no authored copy**, so the rewrite did not touch it. Every heading,
paragraph, stat, gallery image, floor plan, amenity and connectivity entry is fetched at
runtime from `GET https://api.rajivwilliams.com/projects/:slug`, with images served from
`https://dprstorage.b-cdn.net`. The only fixed strings are chrome: the back-link "← RW REALTY"
and the field labels CONFIGURATION · SIZES · PRICE · UNITS · TOWERS.

**Worth flagging:** the copy on these pages is written by the DPR platform and still reads in
the old register. Rewriting it means editing it at the source, not in this repo.

---

## Data not currently rendered

Held in `content.js` as a record, but not shown on any page today.

### Event highlights (`HIGHLIGHTS`) — awaiting event photography

- **HYDERABAD · 2024 — Moderating at SETA** — A good panel to moderate. The ideas coming off
  that stage were sharper than most industry events manage.
- **SIDDIPET · 2024 — Design Thinking & Career Building, OU Postgraduate College** — A morning
  with postgraduate students on personal branding, communication and how to actually use
  LinkedIn. They asked better questions than some sales floors do.
- **KURNOOL · 2024 — Sales mentoring for Anantha Projects** — Two days with the villa sales team
  on how to open a conversation, and how to stop selling the moment the buyer starts thinking.
- **KUKATPALLY · 2025 — Honer Homes Experience Centre launch** — Three and a half acres that
  felt closer to a hotel lobby than a sales gallery. Most of Hyderabad realty was in the room.
- **HYDERABAD · APR 2025 — 11th AGM, HRA & NAR India** — The Hyderabad Realtors Association
  annual meeting, with NAR India leadership in attendance.
- **HYDERABAD — World Environment Day at Pragathi Green Meadows** — A day off the phones.
  Organic farms, and a long conversation about what we are all actually building on.

### Portfolio plates (`PORTFOLIO_PLATES`) — studio/office shoot captions

- **THE SESSION — At the whiteboard** — Working through a closing framework the way it gets
  taught. Pricing, power, wealth, money, one column at a time.
- **THE TEAM — The people behind the mandate** — The Hyderabad team who carry a project from
  launch through to the last registration.
- **THE PRACTITIONER — Between the conversations** — Fifteen years in, and it is still the same
  question before every meeting. What does this buyer need to hear from me today.
- **THE DESK — Where the follow-ups happen** — The unglamorous half of the job. Notes, the
  pipeline, and the calls nobody feels like making on a Thursday evening.
- **THE STUDY — Still a student** — Nobody improvises their way through a high-ticket
  conversation. You read for it, the way you would for anything else that is hard.
- **THE PRACTICE — Under his own name** — RERA registered, and a member of HRA and NAR India.
  If it goes wrong, there is one name to come to.

### Team (`TEAM`) — section commented out in `Portfolio.jsx`, headshots pending

Priyanka Panda · Sridevi Vinjimur · Asra Fathima · Soma Sekhar
(Subtitle fallback: "RW Team".)

### Résumé extras (`SKILLS`, `LANGUAGES`, `EDUCATION`) — unchanged

**Skills** — Consultative Selling · Luxury Market Expertise · SPIN Selling · NEAT Framework ·
Lead Qualification · Objection Handling · Sales Strategy · Mentoring & Coaching ·
Team Building · Behavioral Psychology · Brand Strategy · GTM Strategy · Process Refinement

**Languages** — English · Telugu · Hindi · Tamil

**Education**
- Lincoln University, Oakland CA — MBA — International Business — 2008–2010
- St. Joseph's Degree & PG College — Bachelor's — Mathematics, Economics & Commerce — 2003–2006
- Little Flower Junior College — Intermediate — 2001–2003

---

## A note on voice

The site now uses three voices, and they should stay in their lanes:

- **"I"** — only the Home About block, which sits beside the portrait and the signature. First
  person is the point there.
- **"We"** — everything else that speaks for the business: services, process, mandate terms.
- **"He"** — the Portfolio career track ("It started on a process floor at Dell"), which reads
  as a biography written about him rather than by him.

The Portfolio track is the one that could reasonably flip to "I" as well, if the whole site
should read as Rajiv speaking. Left in third person for now.

## Claims Rajiv should confirm

The rewrite made the copy more concrete, and a few lines now assert things the old abstract
version never quite did. Worth a check before this goes live:

- Consulting, phase 1 — "Two weeks of reading your numbers, sitting in on calls, walking your
  site visit." If the audit usually runs longer or shorter, change the number.
- Consulting, closing — "You will know inside a fortnight whether we are useful."
- RW Realty — "a handful of projects each year", "we turn down more than we accept",
  and the daily report to the developer's desk.
- Coaching — "within a quarter" as the window in which teams notice a difference.
- Home hero — "fifty-crore" and "fifty-lakh" as the two ends of the comparison.

## Known content gaps

- Instagram, YouTube, Facebook and X footer links point at `#` — real URLs not supplied.
- The six `BLOGS` entries are still placeholders. The titles now read like real posts, which
  makes it more important that they are replaced or written before launch.
- Team headshots are missing, and the team section is commented out on Portfolio.
- `HIGHLIGHTS` has no matching photography, so the gallery shows the studio shoot instead.
- Eight of the 27 organisations have no logo artwork and are therefore not rendered.
- The booking form has no endpoint (`BOOKING_ENDPOINT` is empty) — submissions are logged to
  the console and resolve as a stub. Nothing is delivered anywhere. The new success message
  promises a call within a working day, which nobody can keep until this is wired up.

# Broker templates — handoff checklist

Use this file when continuing the free forms work on www.rajivwilliams.com. Read it before creating pages, PDFs, or CDN uploads. Update the checkboxes in the same session as the work.

**Now:** professional blank forms for Hyderabad brokers, sales teams, and channel partners.  
**Later:** other packs stay visible on the page as coming soon. Do not build them until this pack is approved.

The public site is `rw_main_frontend`. The CDN already in use is `https://dprstorage.b-cdn.net`. Put files in a `templates/` folder. The page route is `/templates` (`www.rajivwilliams.com/templates`).

## What the user asked for

- A separate route that lists downloadable forms.
- The list uses the same card UI as open roles on `/careers` (`src/pages/Careers.jsx`): title, one line, one **Download** action.
- Download asks for a name and a phone or email, then the file downloads. That form is the download. Do not add a second download button.
- Save the name and contact on the API before the file is sent. Do not publish the raw CDN URL on the page, or the gate can be skipped.
- Each document is an A4 stationery sheet: fixed margins, aligned tables, the same header, black text, thin rules. It must not look like the website.
- Every page of every file carries this footer: **Provided by Rajiv Williams. For more forms, visit www.rajivwilliams.com/templates**
- Marketing sheets include a blank for the TGRERA project number. A Hyderabad project advertisement is expected to show it.
- Leave blanks for project name, developer, Hyderabad location, price, and dates.
- The agreement for sale and the sale deed stay with the developer’s advocate.
- TGRERA agent registration and project filings stay on the TGRERA portal. They are not free downloads.

## Build order

- [ ] Approve one sample PDF (project one-pager) before making the rest. Same master layout for every form after that.
- [ ] Create the 12 marketing PDFs below, with the footer on every page.
- [ ] Upload them to the CDN folder `templates/`.
- [x] Add `/templates` with the careers card list. Link it from `/partner`.
- [ ] Gate each download: name, and phone or email. Store that lead, then download. The gate is on the page. Saving the lead on the API waits until a file exists.
- [x] Show the sales pack and the channel-partner pack on the same page as coming soon. Do not upload those files yet.
- [x] Add the route to `src/data/seo-config.js` and `public/sitemap.xml` when the page is real.

## Pack 1 — Marketing (build now)

- [ ] Project one-pager
- [ ] WhatsApp project brief
- [ ] Price sheet
- [ ] Availability sheet
- [ ] Payment-plan sheet
- [ ] Floor-plan cover
- [ ] Location and landmark sheet
- [ ] Amenity and USP sheet
- [ ] Nearby-project comparison sheet
- [ ] Site-visit invitation
- [ ] Launch or offer flyer
- [ ] Marketing proposal, for pitching a mandate to a developer

## Pack 2 — Sales on the floor (coming soon)

- [ ] Buyer requirement sheet
- [ ] Lead registration form
- [ ] Site-visit confirmation
- [ ] Site-visit feedback
- [ ] Meeting notes
- [ ] Cost sheet
- [ ] Offer letter
- [ ] Booking form
- [ ] Token receipt
- [ ] Buyer KYC checklist: PAN, Aadhaar, address proof
- [ ] Home-loan document checklist
- [ ] Booking welcome note
- [ ] Payment reminder
- [ ] Cancellation request

## Pack 3 — Channel partner and brokerage (coming soon)

- [ ] Channel-partner registration form
- [ ] Introduction letter to a developer
- [ ] Commission slab sheet
- [ ] Lead-protection form
- [ ] Monthly deal log
- [ ] Commission claim sheet

## Do not create

- Agreement for sale
- Sale deed
- TGRERA portal filings or agent-registration forms
- Any legal entity, address, phone, or statistic that is not already on the site

## Progress log

Add the newest entry at the top.

### 2026-10-07 — Route hidden

- Completed: `/templates` is off the site. The page, the form list, and this checklist stay in the repo. Menu, footer, partner page, and sitemap no longer link to it. Visiting `/templates` returns home.
- Next item: put the route back when the template work resumes.

### 2026-10-07 — Deal-lifecycle forms

- Completed: Filters and cards now follow the five stages from RW: lead intake, builder relations, inventory and mandates, deal closing, and compliance. Seventeen sheets, each filled on the page. PAN, Aadhaar, and GSTIN are not collected in the form.
- Files: `src/data/templates.js`, `src/pages/Templates.jsx`, `src/data/seo-config.js`.

### 2026-10-07 — Brokerage filter

- Completed: `/templates` has a Brokerage filter. Six brokerage sheets (confirmation, client registration, commission claim, receipt, co-brokerage, appointment) open a fill form. A completed sheet is sent as a lead. Marketing stays a download request. Sales and channel partners stay coming soon.
- Files: `src/data/templates.js`, `src/pages/Templates.jsx`, `src/data/booking.js`.

### 2026-10-07 — Templates page

- Completed: `/templates` lists all 32 forms in the careers card layout, with pack filters and load more. Marketing cards open a name and phone-or-email gate. Sales and channel-partner cards say coming soon. Apply and Load more on careers no longer shift under the pointer, and the chat launcher is hidden on careers and templates so it does not cover those buttons.
- Files: `src/pages/Templates.jsx`, `src/data/templates.js`, `src/App.jsx`, `src/pages/Partner.jsx`, `src/global.css`, `src/data/seo-config.js`, `public/sitemap.xml`.
- Next item: design and review the project one-pager PDF, then repeat that layout for the other 11 marketing forms.

### 2026-10-07 — Checklist written

- Completed: Scope agreed. No PDFs and no `/templates` route exist yet. Broker marketing forms are first. Sales and channel-partner packs show as coming soon.
- Files: this checklist only.
- Next item: design and review the project one-pager PDF, then repeat that layout for the other 11 marketing forms.

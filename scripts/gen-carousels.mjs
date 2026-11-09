/** One-shot generator: writes src/data/carousels.js from the Drive listing snapshot. */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

const months = [
  {
    id: '2026-10',
    label: 'October 2026',
    folderId: '16dI1Eiai2_-d6fijRB_tljvbavJnwtw7',
    folderUrl: 'https://drive.google.com/drive/folders/16dI1Eiai2_-d6fijRB_tljvbavJnwtw7',
  },
  {
    id: '2026-11',
    label: 'November 2026',
    folderId: '1zszZmu5L-9Wwo0lvGaUu_sddmGagnXYJ',
    folderUrl: 'https://drive.google.com/drive/folders/1zszZmu5L-9Wwo0lvGaUu_sddmGagnXYJ',
  },
  {
    id: '2026-12',
    label: 'December 2026',
    folderId: '1dMP8xGcYvep0Cap0I6_i7XHMWqbvGOrq',
    folderUrl: 'https://drive.google.com/drive/folders/1dMP8xGcYvep0Cap0I6_i7XHMWqbvGOrq',
  },
  {
    id: '2027-01',
    label: 'January 2027',
    folderId: '1W1ATx4XWyl9m2ITV41UQ6I6YFLkIHdrN',
    folderUrl: 'https://drive.google.com/drive/folders/1W1ATx4XWyl9m2ITV41UQ6I6YFLkIHdrN',
  },
]

/** Live month PDFs only (not old-covers drafts). [id, name, size] */
const files = {
  '2026-10': [
    ['1dUQWEClpf5HJnQpb08v2IejLtH7tcW7A', '2026-10-10 - 48 Laws of Power Sales Edition.pdf', 1136224],
    ['1B2kbMLSIGbgOsBVCZeVmT5fYsves7GM1', '2026-10-11 - The Biggest Site Visit Mistake.pdf', 681117],
    ['1biEWAI7kYX5_0xhY1iZ7G2TmguXBYHFa', '2026-10-12 - Price Is Rarely the Real Objection.pdf', 605328],
    ['1GZBdlqqlikWsq-zOnypxvw8KjJ9MSQFH', '2026-10-13 - Why Developers Lose Deals to Brokers.pdf', 729549],
    ['1ApmIP6_alqwSwhPgHXxN7yqKhijAJ3bR', '2026-10-14 - Stop Chasing More Leads.pdf', 670807],
    ['1t3hZqjmYFOvYwZPGR7n3PCRhb6qFafNP', "2026-10-15 - Amenities Don't Close Luxury Deals.pdf", 689266],
    ['1eimQjFxcYtrOUOo-cTLpHcd2FXvKWB0t', '2026-10-16 - Why Buyers Delay Decisions.pdf', 717678],
    ['1JYbcLqZT86IfO07Wbx6avz14_0edR-2A', '2026-10-17 - What Makes a Salesperson Truly Credible.pdf', 684904],
    ['1MmFf2HUpMwUto5AczKaazNoskQxliQBE', '2026-10-18 - The Buyer Psychology Blueprint.pdf', 886426],
    ['1FM4fwZ1IHmYyPx7p9rHKp93EpQCU_QFF', '2026-10-19 - 35 Buying Triggers Behind Every Purchase Decision.pdf', 895379],
    ['1bGjioEt-GIzC03tBfcfWnlE2YtJTtknp', '2026-10-20 - 5 Objections That Kill High Ticket Sales.pdf', 926278],
    ['165Bt0vD1w8iH5x64zif1J59hX1F0tH5L', '2026-10-21 - 7 Laws of Sales Teams.pdf', 825411],
    ['1GstoJ51UmTqky3BiYaVbckem1OwMSVjd', '2026-10-22 - 4 Sales Scaling Mistakes Costing You Deals.pdf', 682540],
    ['1hbtJJWt3XflxjjNTv9UDomlNeImvHz4Y', '2026-10-23 - They Say Launch Budget. They Mean Launch Readiness..pdf', 667396],
    ['1meId8_c0LTx9Akg39xWy5HB6-0YvEgzH', '2026-10-24 - Tip Followers vs Data Readers Who Wins.pdf', 674059],
    ['1wJDcAcPCaK4aDRtWZDwCFjqLVbwmUoWC', '2026-10-25 - Still Giving Answers Start Asking Questions..pdf', 637827],
    ['1qgVYumzJ9EcTe9W_OdLRKNpAeTJgZVuT', '2026-10-26 - 4 Channel Partner Myths, Busted.pdf', 622409],
    ['183Tkords4e-qZrzvFQVZXMWsgu4Cpqrn', '2026-10-27 - Real Talk Why Your New Hires Quit Early.pdf', 634203],
    ['1pxjmFix2p8gBSxKUHJqa90GPhoFMbIPA', '2026-10-28 - What Makes a Mandate Partner Truly Fearless.pdf', 619748],
    ['1VhBmpH88bPFOHbS5gCG9CGxipcy1jdLF', '2026-10-29 - Sales Consulting The 5 Stage Blueprint.pdf', 647636],
    ['1KxdptYVJyZ78-EOy1SFnze8-ni1V9amu', "2026-10-30 - Closing 9 Laws You Can't Skip.pdf", 752302],
    ['1Xjahf_L_YuHorVDcs2ujj2WVQJIMdVmW', '2026-10-31 - Your Objection Handling Mistake Is Showing.pdf', 646571],
  ],
  '2026-11': [
    ['16K1V77woR7D3kg3F3bp4Uf4PLhkFwArR', '2026-11-01 - Blaming Team Check Leader Habits First.pdf', 642984],
    ['1jXbUuvPgjNw-2zyy2MmGoCBt_cFPbc18', '2026-11-02 - Motivated Reps Lose. Disciplined Reps Close..pdf', 615762],
    ['1wttPIe_v10P1a53MgR9zAkbEZMX-lEc2', '2026-11-03 - Impressing Is Out. Understanding Is In..pdf', 626821],
    ['1HKlvMEUk3yaBcaJYfy8Y2Ovex78528Qg', '2026-11-04 - 5 Site Visit Myths to Unlearn Today.pdf', 732661],
    ['12QzjSNsY_quPwZNDht6YGOs2R91UNRzY', "2026-11-05 - The Real Reason Discounts Don't Close Deals.pdf", 548743],
    ['1qxQp3JVT7MdzWydED4-xGS567u5gt6Sy', '2026-11-06 - The Respected Sales Ops Lead Checklist.pdf', 611405],
    ['1oXdFCbglvKv97lVonmAnxL5nuDJHNVEL', '2026-11-07 - The Sales Team Blueprint.pdf', 619870],
    ['1xJ6aL5IXboZprDBRWvMMHD60Tp5x4xCv', '2026-11-08 - The 9 Laws of Sales Scaling Nobody Teaches.pdf', 706060],
    ['1M_uWwBAo-MTcNt6vlpX8PMfRKeitc41b', '2026-11-09 - This Project Launch Mistake Is Killing Deals.pdf', 600932],
    ['1cNTulArmrfyfNZdanYnIw4_OS9NnKtew', "2026-11-10 - Price Isn't the Issue. Location Logic Is..pdf", 606663],
    ['1vO3lQcic7Gbj4jNOrkEUQyfVZMrnIPAI', '2026-11-11 - Why Coaches Always Win Over Managers.pdf', 570319],
    ['1snXywzbtz_KXXf2Ybr75J5wIxVnCX_lw', '2026-11-12 - Swap Delaying Payouts for Paying on Time.pdf', 638782],
    ['13xj8zZOUMRU0ifB_04LXLOC2gIQCry2Z', '2026-11-13 - Stop Believing These Sales Hiring Myths.pdf', 617620],
    ['1VfcYSPvzh015QZW3NHt5W1xO7BvvVnym', '2026-11-14 - Why Developers Switch Mandate Partners.pdf', 598521],
    ['1x41Bmo5oTSZcgmz0DIU1WsASDJjsjupF', '2026-11-15 - 5 Signs of a Sharp Sales Consultant.pdf', 663366],
    ['15EgTU-VFnUEABu99FMb72RNyYDtAQaKB', '2026-11-16 - 6 Stages of Closing That Convert.pdf', 678633],
    ['1PZpjPPHSnVphElXEh_aN-YjF6zP9j5LJ', '2026-11-17 - 10 Unbreakable Objection Handling Laws.pdf', 784893],
    ['14HKUu3fzluSB8lTRU6PW2_-OEsYVgLRx', '2026-11-18 - The Leadership Habit Mistake Everyone Makes.pdf', 644376],
    ['1Nf1tYtYY_jFLSkD6nw942MsWTHOsvYXu', "2026-11-19 - The Real Objection Isn't Motivation.pdf", 619013],
    ['1M477COczyU4xA7WtlUsbuR9FdbDG0mOZ', '2026-11-20 - The Gap Between Impressers & Listeners.pdf', 631201],
    ['19EBKdH5e7H8M6538J7KNKF776vTfSLC7', '2026-11-21 - Stop Touring Amenities. Start Painting Lifestyle..pdf', 640773],
    ['1IdigZ9kI7ALHbujQc4JSZpoTl1Pn_8ql', '2026-11-22 - Pricing Myths That Need to Go.pdf', 594172],
    ['1AXE2u4TEeG0anuQJZmhd0x3JZKh0bs5P', "2026-11-23 - Nobody Updates the CRM Here's Why..pdf", 510953],
    ['1ZbMXu4KUE46RiG2lxtV8RreaD-v5nxq0', '2026-11-24 - 6 Signs of a Credible Sales Manager.pdf', 737487],
    ['1qlllTje_GAnjCzC-w_e8P4uX2nHguISy', '2026-11-25 - Your Sales Scaling Blueprint, Step by Step.pdf', 613965],
    ['1w6yOgb8m8RL4D9gDolOZ--oQFNV0wFIN', "2026-11-26 - Project Launches 10 Laws You Can't Skip.pdf", 719182],
    ['1DwrlE9qIOtCNpTBjNqG8wWEFefEvemDi', '2026-11-27 - Your Property Investment Mistake Is Showing.pdf', 574201],
    ['1dc4JXGKyUACTyF-iSY89ZeCYrdIGJXVb', '2026-11-28 - Blaming Motivation Check Skill First.pdf', 603903],
    ['1rM9zXOLRKouSOyx6ax5_pxTelYREdcT4', '2026-11-29 - In House Teams Lose. Trusted Brokers Close..pdf', 574455],
    ['1wuliUGCqFZGDrUGGP1diCasCgTPFFta9', '2026-11-30 - Hiring Resumes Is Out. Hiring Attitude Is In..pdf', 633117],
  ],
  '2026-12': [
    ['1l-_dC6rlmHUE2FSspsXvaL6i-Ft8529F', '2026-12-01 - 6 Sales Mandate Myths to Unlearn Today.pdf', 850021],
    ['1ZlYqst7i8Q0eoy9IR2iFdLVhcAZ3lz3K', '2026-12-02 - The Real Reason Most Consulting Fails to Stick.pdf', 571947],
    ['1QtHF5Mie7p-PXsyo0G-VOBBXplrAgQnQ', '2026-12-03 - The Consistent Closer Checklist.pdf', 675839],
    ['1pjMF9hW1GTWRddK2_8rzb2r4eqa06Fla', '2026-12-04 - Your Objection Handling Blueprint, Step by Step.pdf', 716640],
    ['1JD6hNOcXIpibDOfgHA3mhFetJl0_z8rq', '2026-12-05 - 12 Power Laws for Leadership Habits.pdf', 626515],
    ['1fyjvhEOefENyJTwlJ4aPRK2CAAf4J0CW', '2026-12-06 - Sales Mindset Mistakes That Lowkey Cost You.pdf', 716542],
    ['16QmEWgiO25cBogKA0wXPap20E3YDaxKw', '2026-12-07 - Look Past Product. Find Trust..pdf', 644990],
    ['1knkiXMWwJphmcz_EBpeC2vg2PWxAAX2M', '2026-12-08 - Why Tour Guides Lose to Consultants.pdf', 606756],
    ['1xmuY-xPZ7bO4owo2Qcj6ARQJ7aDB40AA', '2026-12-09 - Quit Dropping Price. Try Adding Value..pdf', 653259],
    ['1Z8QSBXoa2fKAkTFDal8PZu3dNi-brWP1', '2026-12-10 - Myth vs Fact CRM.pdf', 694606],
    ['1ES0TdRUG1kbnQZ-sF9JTZFrl_EDOpWpj', '2026-12-11 - Why Good Salespeople Quit.pdf', 566933],
    ['1TQlJvihH87aVD0cl4c3u5XEtkEHdPiK3', '2026-12-12 - 6 Signs of a Trusted Sales Head.pdf', 640592],
    ['1kvyv4M3qRkCzSExLr3DSjhBSGLDtIy89', '2026-12-13 - 7 Stages of Project Launches That Convert.pdf', 774324],
    ['1vYM2qf9vKMeH4iMcMvwaXsybyiKWHDQZ', '2026-12-14 - 12 Unbreakable Property Investment Laws.pdf', 623278],
    ['1O3I4fahc0nnJyS8aRPbR648XaiF1z4HU', '2026-12-15 - The Sales Coaching Mistake Everyone Makes.pdf', 723546],
    ['1s_bRdle_7kAbYWwZli5FvfRHpLEGdVX2', '2026-12-16 - Look Past Commission. Find Respect..pdf', 644383],
    ['1wvAzPZFh8IXyrJbJottRufRhC-xW9Utl', '2026-12-17 - The Gap Between Resume Hires & Attitude Hires.pdf', 615586],
    ['1I97xRtz-G2BIfv277USnblEqUmNiI5PQ', '2026-12-18 - Stop Promising Volume. Start Proving Process..pdf', 625555],
    ['1bQEVmKOA--5HpHDu-z7GzObhFgDAsToR', '2026-12-19 - Sales Consulting Myths That Need to Go.pdf', 729869],
    ['1CKLr1dtpjhPCxpBxVpPeECbUenILldWG', "2026-12-20 - Hot Leads Go Cold Here's Why..pdf", 568924],
    ['1PiwW9G7z3wuTmWheJlFr7l_hAU8PuexK', '2026-12-21 - 5 Traits Every Unstoppable Objection Handler Has.pdf', 621480],
    ['1VDnycStAAZEkZI1_0U0imvrylLJq5NAA', '2026-12-22 - The 8 Step Leadership Habit Framework.pdf', 757823],
    ['1Ylq0gWcKUDqH-R4rFU28LiGb7oUOhHoT', '2026-12-23 - Break These 7 Sales Mindset Laws, Lose Deals.pdf', 627279],
    ['1sGxJaY8du_uCNciYa7Fa1KgI6HCLcrPB', '2026-12-24 - Stop Making This Client Trust Mistake.pdf', 621743],
    ['1TYaGu6fHos4mnoOspDvh_DrsqJ_aLnEV', '2026-12-25 - Floor Plan Is Rarely the Real Problem.pdf', 625496],
    ['1uMBGUHnbmA3j18bs_SXiHFzq51bgvYxF', "2026-12-26 - Anchorers Beat Discounters. Here's Why..pdf", 612673],
    ['17ppZxGyM_VbuOv8b7cMj4jdZEgwgsw0r', '2026-12-27 - Using a CRM Beats Using Spreadsheets. Every Time..pdf', 610031],
    ['1U7dvue138AntpklMvZoOkTrv76B2Z732', '2026-12-28 - Sales Team Myths That Need to Go.pdf', 698513],
    ['1kr2QqM0zG-v6IRSLMsFURGU0RgxnTaWm', '2026-12-29 - The Real Reason More Leads Mean Fewer Sales.pdf', 587560],
    ['1yCKp3BEYYPRNrcjXRjTRN8qg8ZiABIWa', '2026-12-30 - The Elite Launch Manager Checklist.pdf', 640391],
    ['1_5VRWQseIAFht9qAo8gn20QG7_0QPy-w', '2026-12-31 - Your Property Investment Blueprint, Step by Step.pdf', 700557],
  ],
  '2027-01': [
    ['1tAap6NTSh9LFO6AjSEKddOwqfTFgiM4Q', '2027-01-01 - 7 Power Laws for Sales Coaching.pdf', 613883],
    ['1nA2PyBb-UDgNcpV3OHnmPnOHkgNAYy8-', '2027-01-02 - Channel Partner Mistakes That Lowkey Cost You.pdf', 730314],
    ['1CKtBA51WfwYEY6Rx7q4xNv4kFAzx8kEP', '2027-01-03 - Look Past Salary. Find Growth Path..pdf', 621993],
    ['1tAoWQmP7xUuZR2DBtjr_xqp5I1TXnIiQ', '2027-01-04 - Why Brokers Lose to Mandate Partners.pdf', 600104],
    ['1F8gHpiW2ans5pYt4xVSKdTDfAEGqBLvT', '2027-01-05 - Quit Presenting. Try Consulting..pdf', 625167],
    ['1UtPySezj4lhFmY2M5yk_aEBKwa1Fnx-J', '2027-01-06 - Myth vs Fact Closing.pdf', 697286],
    ['1shZFGxEGYUg2BccP1tW5bxNlo-Zq4LTu', "2027-01-07 - Here's Why Buyers Say Let Me Think.pdf", 566757],
    ['1cRk3S-CcTVnwkSEH-F62efCrubI15j8K', '2027-01-08 - How Reliable Leaders Actually Think.pdf', 625135],
  ],
}

function parseName(name) {
  const bare = name.replace(/\.pdf$/i, '')
  const m = bare.match(/^(\d{4}-\d{2}-\d{2})\s*-\s*(.+)$/)
  if (!m) return { date: '', title: bare }
  return { date: m[1], title: m[2].trim() }
}

function formatSize(bytes) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const carousels = []
for (const month of months) {
  for (const [id, name, size] of files[month.id]) {
    const { date, title } = parseName(name)
    carousels.push({
      id,
      month: month.id,
      date,
      title,
      name,
      size,
      sizeLabel: formatSize(size),
    })
  }
}

const out = `/**
 * Team RW carousels catalog (Drive folder 1kwHhQYJy6kpoS3GkfnP7CBHPSF6sjwgx).
 * Live month PDFs only — October "old covers" are draft PDF revisions, not images.
 * Previews use Google Drive thumbnails of the first PDF page (public share).
 * Regenerate via: node scripts/gen-carousels.mjs
 */

export const DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1kwHhQYJy6kpoS3GkfnP7CBHPSF6sjwgx?usp=sharing'

export const CAROUSEL_MONTHS = ${JSON.stringify(months, null, 2)}

export const CAROUSELS = ${JSON.stringify(carousels, null, 2)}

export function driveViewUrl(id) {
  return \`https://drive.google.com/file/d/\${id}/view\`
}

export function driveDownloadUrl(id) {
  return \`https://drive.google.com/uc?export=download&id=\${id}\`
}

/** First-page preview for publicly shared Drive files (PDF pages included). */
export function driveThumbUrl(id, width = 600) {
  return \`https://drive.google.com/thumbnail?id=\${id}&sz=w\${width}\`
}
`

writeFileSync(join(root, '..', 'src', 'data', 'carousels.js'), out)
console.log('Wrote', carousels.length, 'carousels')

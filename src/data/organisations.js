import anantha from '../assets/site/LOGOS/anantha.svg'
import blueFin from '../assets/site/LOGOS/blue-fin.svg'
import cascadesNeopolis from '../assets/site/LOGOS/cascades-neopolis.svg'
import celestial from '../assets/site/LOGOS/celestial.svg'
import eInfra from '../assets/site/LOGOS/e-infra.svg'
import gangothri from '../assets/site/LOGOS/gangothri.svg'
import haneesh from '../assets/site/LOGOS/haneesh.svg'
import ira from '../assets/site/LOGOS/ira.svg'
import kolla from '../assets/site/LOGOS/kolla.svg'
import landmark from '../assets/site/LOGOS/landmark.svg'
import navanaami from '../assets/site/LOGOS/navanaami.svg'
import promenadeVillas from '../assets/site/LOGOS/promenade-villas.svg'
import radhaSpaces from '../assets/site/LOGOS/radha-spaces.svg'
import skyMarq from '../assets/site/LOGOS/skyamarqdsr.png'
import skyline from '../assets/site/LOGOS/skyline.png'
import skyven from '../assets/site/LOGOS/skyven.png'
import theTwins from '../assets/site/LOGOS/thetwinsdsr.png'
import trumpTower from '../assets/site/LOGOS/trumptower.png'
import vantage from '../assets/site/LOGOS/vantage.png'
import rohas from '../assets/site/LOGOS/rohas.svg'
import sriAditya from '../assets/site/LOGOS/sri-aditya.svg'
import suchirindia from '../assets/site/LOGOS/suchirindia.svg'
import trilight from '../assets/site/LOGOS/trilight.svg'
import vamsiram from '../assets/site/LOGOS/vamsiram.svg'
import vamsiramHomes from '../assets/site/LOGOS/vamsiram-homes.svg'
import vibrant from '../assets/site/LOGOS/vibrant.svg'
import zuari from '../assets/site/LOGOS/zuari.svg'
import { ORGANISATIONS_WORKED } from './content'

/** Client logos keyed by name; names absent here wait for artwork. */
export const ORG_LOGOS = {
  'Vamsiram': vamsiram,
  'Vamsiram Homes': vamsiramHomes,
  'The Cascades Neopolis': cascadesNeopolis,
  'The Trilight': trilight,
  'Sri Aditya': sriAditya,
  'Blue Fin Realty': blueFin,
  'IRA': ira,
  'Zuari Infraworld': zuari,
  'Landmark Group': landmark,
  'Suchirindia': suchirindia,
  'Kolla': kolla,
  'Haneesh Constructions': haneesh,
  'Vibrant Developers': vibrant,
  'Anantha Projects': anantha,
  'Gangothri': gangothri,
  'Rohas Ventures': rohas,
  'e-Infra': eInfra,
  'Celestial': celestial,
  'Navanaami': navanaami,
  'Promenade Villas': promenadeVillas,
  'Radha Spaces': radhaSpaces,
  'SkyMarq by DSR': skyMarq,
  'Skyline by Candeur': skyline,
  'Skyven': skyven,
  'The Twins by DSR': theTwins,
  'Trump Tower': trumpTower,
  'Vantage': vantage,
}

/** White-on-transparent artwork needs a dark tile. */
export const LOGO_NEEDS_DARK = new Set(Object.keys(ORG_LOGOS))

export const LOGO_SCALE = {}
export const LOGO_MAX_W = 82
export const LOGO_MAX_H = 62

export const ORGS_WITH_LOGO = ORGANISATIONS_WORKED.filter((org) => ORG_LOGOS[org])

/** LogoLoop items for home / realty-style marquees. */
export function orgLogoLoopItems() {
  return ORGS_WITH_LOGO.map((name) => ({
    src: ORG_LOGOS[name],
    alt: name,
    scale: LOGO_SCALE[name] || 1,
    dark: LOGO_NEEDS_DARK.has(name),
  }))
}

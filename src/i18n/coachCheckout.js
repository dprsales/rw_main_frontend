/** Display helpers for coaching result / purchase. Stored module ids stay numeric English. */

const GROUP_KEYS = {
  'Presentation & Practical Selling': 'cmod.group.presentation',
  'Communication & Rapport': 'cmod.group.communication',
  'Foundation & Mindset': 'cmod.group.foundation',
  'Lead Handling & Conversion': 'cmod.group.leads',
  'Objection Handling & Client Management': 'cmod.group.objections',
  'Process & Pipeline Management': 'cmod.group.process',
}

const PKG_KEYS = {
  single: 'single',
  five: 'five',
  ten: 'ten',
  complete: 'complete',
}

export function moduleTitle(t, mod) {
  return t(`cmod.${mod.id}.title`)
}

export function moduleFocus(t, mod) {
  return t(`cmod.${mod.id}.focus`)
}

export function moduleGroup(t, group) {
  const key = GROUP_KEYS[group]
  return key ? t(key) : group
}

export function labelForCountT(t, count) {
  return count === 1 ? t('cpur.count.one') : t('cpur.count.many', { n: count })
}

export function packageLabel(t, pkg) {
  const slug = PKG_KEYS[pkg.id]
  return slug ? t(`cpur.pkg.${slug}.label`) : pkg.label
}

export function packageBlurb(t, pkg) {
  const slug = PKG_KEYS[pkg.id]
  return slug ? t(`cpur.pkg.${slug}.blurb`) : pkg.blurb
}

export function recommendationCopyT(t, type) {
  return type === 'complete_curriculum' ? t('cresult.rec.complete') : t('cresult.rec.targeted')
}

export function scenarioBandTitle(t, scenarioKey, fallback) {
  const key = `cresult.band.${scenarioKey === 'default' ? 'default' : scenarioKey}`
  const hit = t(key)
  return hit === key ? fallback : hit
}

export function scenarioArea(t, scenarioKey, index, fallback) {
  const key = `cresult.area.${scenarioKey === 'default' ? 'default' : scenarioKey}.${index}`
  const hit = t(key)
  return hit === key ? fallback : hit
}

// Run with: node --test src/data/guidance.test.mjs
// Guards the recommendation table: every reachable answer combination resolves
// to exactly one real outcome, and nothing reachable hits the fallback.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { OUTCOMES, RULES, reachableCombinations, recommend, needsGoal, goalOptions, labelFor } from './guidance.js'

const combos = reachableCombinations()

test('there is a meaningful number of reachable combinations', () => {
  assert.ok(combos.length >= 20, `only ${combos.length} combinations`)
})

test('every reachable combination has a rule (no fallback)', () => {
  const misses = combos.filter((c) => recommend(c).rule === 'fallback')
  assert.deepEqual(misses, [])
})

test('every rule points at a real outcome with a reason', () => {
  for (const r of RULES) {
    assert.ok(OUTCOMES[r.outcome], `${r.id}: unknown outcome ${r.outcome}`)
    assert.ok(r.reason && r.reason.length > 10, `${r.id}: missing reason`)
  }
})

test('each service outcome gives its detail form a context-specific action', () => {
  assert.deepEqual(
    ['coaching', 'consulting', 'realty'].map((key) => ({
      key,
      formTrack: OUTCOMES[key].formTrack,
      formCta: OUTCOMES[key].formCta,
    })),
    [
      { key: 'coaching', formTrack: 'coaching', formCta: 'SHARE YOUR COACHING DETAILS' },
      { key: 'consulting', formTrack: 'consulting', formCta: 'SHARE YOUR BUSINESS DETAILS' },
      { key: 'realty', formTrack: 'realty', formCta: 'SHARE YOUR PROJECT DETAILS' },
    ],
  )
  assert.equal(OUTCOMES.realty_portfolio.formTrack, null)
  assert.equal(OUTCOMES.strategy_call.formTrack, null)
})

test('rule ids are unique', () => {
  const ids = RULES.map((r) => r.id)
  assert.equal(new Set(ids).size, ids.length)
})

test('"not sure" never dead-ends', () => {
  assert.equal(recommend({ who: 'unsure' }).outcome.key, 'strategy_call')
  assert.equal(recommend({ who: 'developer', challenge: 'slow_sales', goal: 'unsure' }).outcome.key, 'strategy_call')
  assert.equal(recommend({ who: 'sales_leader', challenge: 'team_performance', goal: 'unsure' }).outcome.key, 'strategy_call')
})

test('the ambiguous cases are decided by the visitor at Q3, not by the site', () => {
  for (const who of ['developer', 'sales_leader']) {
    assert.ok(needsGoal(who, 'team_performance'), `${who} + team_performance must ask Q3`)
  }
  assert.equal(recommend({ who: 'developer', challenge: 'team_performance', goal: 'train_team' }).outcome.key, 'coaching')
  assert.equal(recommend({ who: 'developer', challenge: 'team_performance', goal: 'fix_process' }).outcome.key, 'consulting')
  assert.equal(recommend({ who: 'developer', challenge: 'unsold_inventory', goal: 'hand_over' }).outcome.key, 'realty')
})

test('developer with no sales team is not offered "train the team"', () => {
  const keys = goalOptions('developer', 'no_sales_setup').map((g) => g.key)
  assert.ok(!keys.includes('train_team'))
  assert.ok(keys.includes('hand_over'))
})

test('hand_over is developer-only', () => {
  assert.ok(!goalOptions('sales_leader', 'team_performance').some((g) => g.key === 'hand_over'))
})

test('shared challenge keys keep the wording selected by each persona', () => {
  assert.equal(labelFor('challenge', 'low_closing', 'sales_leader'), "Leads don't convert")
  assert.equal(labelFor('challenge', 'low_closing', 'sales_pro'), "I don't close enough")
})

test('garbage input falls back safely', () => {
  assert.equal(recommend({}).outcome.key, 'strategy_call')
  assert.equal(recommend({ who: 'martian' }).rule, 'fallback')
  assert.equal(recommend({ who: 'developer', challenge: 'nope', goal: 'nope' }).rule, 'fallback')
})

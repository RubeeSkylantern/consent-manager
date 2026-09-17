/**
 * Tests du ConsentManager — Node nu + assert, sans framework ni DOM.
 * Lancer : node test/consent-manager.test.js
 *
 * Le seam testé est `_setUI` : le cœur décide, l'UI est injectée. Aucun DOM requis.
 */
import assert from 'node:assert';

// localStorage doit exister AVANT l'évaluation de src/core/storage.js → import dynamique.
function installStorage (initial = null) {
  const map = new Map();
  if (initial !== null) { map.set('__cm_consent', initial); }
  globalThis.localStorage = {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k)
  };
  return map;
}

/** UI factice qui journalise les appels reçus du cœur. */
function fakeUI () {
  const calls = [];
  return {
    calls,
    showBanner () { calls.push('showBanner'); },
    hideBanner () { calls.push('hideBanner'); },
    showReopener () { calls.push('showReopener'); },
    showModal () { calls.push('showModal'); }
  };
}

const consentement = (categories, ageMs = 0) =>
  JSON.stringify({ v: 1, t: Date.now() - ageMs, c: categories })

const JOUR = 24 * 3600 * 1000

const tests = []
const test = (name, fn) => tests.push({ name, fn })

test('visiteur revenant : le bouton de réouverture est révélé, la bannière n est jamais affichée', async () => {
  installStorage(consentement({ necessary: true, analytics: true }))
  const { ConsentManager } = await import('../src/core/consent-manager.js')
  const cm = new ConsentManager({})
  const ui = fakeUI()
  const evenements = []
  cm.on('banner:hide', () => evenements.push('banner:hide'))
  cm._setUI(ui)
  cm.init()

  assert.ok(ui.calls.includes('showReopener'), 'le bouton de réouverture reste masqué : le visiteur ne peut plus retirer son consentement (RGPD)')
  assert.ok(!ui.calls.includes('showBanner'), 'bannière affichée alors qu un consentement valide existe')
  assert.deepStrictEqual(evenements, [], 'un événement banner:hide parasite est émis alors que la bannière n a jamais été montrée')
  assert.strictEqual(cm.hasConsent('analytics'), true)
})

test('nouveau visiteur : la bannière est affichée, le bouton de réouverture reste masqué', async () => {
  installStorage()
  const { ConsentManager } = await import('../src/core/consent-manager.js')
  const cm = new ConsentManager({})
  const ui = fakeUI()
  cm._setUI(ui)
  cm.init()

  assert.ok(ui.calls.includes('showBanner'))
  assert.ok(!ui.calls.includes('showReopener'), 'réouverture révélée avant tout choix')
})

test('consentement expiré : la bannière est réaffichée', async () => {
  installStorage(consentement({ necessary: true, analytics: true }, 400 * JOUR))
  const { ConsentManager } = await import('../src/core/consent-manager.js')
  const cm = new ConsentManager({})
  const ui = fakeUI()
  cm._setUI(ui)
  cm.init()

  assert.ok(ui.calls.includes('showBanner'), 'un consentement de plus de 13 mois doit être redemandé')
  assert.ok(!ui.calls.includes('showReopener'))
  assert.strictEqual(cm.hasConsent('analytics'), false, 'un consentement expiré ne doit pas être appliqué')
})

test('UI attachée APRÈS init : l état initial est quand même appliqué', async () => {
  installStorage(consentement({ necessary: true, analytics: true }))
  const { ConsentManager } = await import('../src/core/consent-manager.js')
  const cm = new ConsentManager({})
  cm.init()
  const ui = fakeUI()
  cm._setUI(ui)

  assert.ok(ui.calls.includes('showReopener'), 'l état du bouton de réouverture dépend de l ordre des appels — c est ce couplage qui a produit cm-bug-001')
})

test('après un refus, le bouton de réouverture est révélé', async () => {
  installStorage()
  const { ConsentManager } = await import('../src/core/consent-manager.js')
  const cm = new ConsentManager({})
  const ui = fakeUI()
  cm._setUI(ui)
  cm.init()
  cm.rejectAll()

  assert.ok(ui.calls.includes('hideBanner'), 'la bannière doit être masquée après un choix')
  assert.strictEqual(cm.hasConsent('analytics'), false)
})

let ok = 0
for (const t of tests) {
  try {
    await t.fn()
    console.log('ok   -', t.name)
    ok++
  } catch (e) {
    console.log('FAIL -', t.name)
    console.log('       ', e.message)
  }
}
console.log(`\n${ok}/${tests.length} tests passés`)
process.exit(ok === tests.length ? 0 : 1)

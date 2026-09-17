/**
 * Tests du module UI — Node nu + assert, avec un DOM minimal simulé.
 * Lancer : node test/ui-manager.test.js
 *
 * Ces tests valent plus que ceux du cœur : ils vérifient que la classe `cm-hidden` est
 * réellement retirée du bouton de réouverture. Un test contre une UI factice passe même
 * quand le vrai module n'expose pas le hook — c'est le piège de cm-bug-001.
 */
import assert from 'node:assert';

/** DOM minimal : classList, appendChild, getElementById, createElement, dataset d'attributs. */
function installDOM () {
  const parEl = new Map();

  function creerElement (tag) {
    const classes = new Set();
    const el = {
      tagName: String(tag).toUpperCase(),
      children: [],
      attributes: {},
      style: { setProperty () {} },
      _id: null,
      get id () { return this._id; },
      set id (v) { this._id = v; parEl.set(v, this); },
      textContent: '',
      classList: {
        add: (...c) => c.forEach(x => classes.add(x)),
        remove: (...c) => c.forEach(x => classes.delete(x)),
        contains: c => classes.has(c),
        toString: () => [...classes].join(' ')
      },
      get className () { return [...classes].join(' '); },
      set className (v) { classes.clear(); String(v).split(/\s+/).filter(Boolean).forEach(x => classes.add(x)); },
      setAttribute (k, v) { this.attributes[k] = v; },
      getAttribute (k) { return this.attributes[k]; },
      appendChild (c) { this.children.push(c); return c; },
      addEventListener () {},
      querySelector: () => null,
      querySelectorAll: () => [],
      focus () {}
    };
    return el;
  }

  const head = creerElement('head');
  const body = creerElement('body');
  globalThis.document = {
    documentElement: creerElement('html'),
    head,
    body,
    createElement: creerElement,
    createTextNode: t => ({ textContent: t }),
    getElementById: id => parEl.get(id) || null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener () {},
    get cookie () { return ''; },
    set cookie (_v) {}
  };
  globalThis.window = { dataLayer: [], gtag () {}, addEventListener () {} };
  globalThis.location = { protocol: 'https:' };
  return { body };
}

function installStorage (initial = null) {
  const map = new Map();
  if (initial !== null) { map.set('__cm_consent', initial); }
  globalThis.localStorage = {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k)
  };
}

const trouverReopener = body => body.children.find(el => el.classList.contains('cm-reopener'))
const consentement = c => JSON.stringify({ v: 1, t: Date.now(), c })

const tests = []
const test = (name, fn) => tests.push({ name, fn })

test('visiteur revenant : cm-hidden est retirée du bouton de réouverture dans le DOM', async () => {
  const { body } = installDOM()
  installStorage(consentement({ necessary: true, analytics: true }))
  const { ConsentManager } = await import('../src/core/consent-manager.js')
  const { initUI } = await import('../src/ui/ui-manager.js')

  const cm = new ConsentManager({})
  initUI(cm, {})
  cm.init()

  const reopener = trouverReopener(body)
  assert.ok(reopener, 'bouton de réouverture absent du DOM')
  assert.strictEqual(reopener.classList.contains('cm-hidden'), false,
    'cm-hidden toujours présente : le bouton est invisible, le visiteur ne peut pas retirer son consentement')
})

test('nouveau visiteur : le bouton de réouverture reste masqué, la bannière est visible', async () => {
  const { body } = installDOM()
  installStorage()
  const { ConsentManager } = await import('../src/core/consent-manager.js')
  const { initUI } = await import('../src/ui/ui-manager.js')

  const cm = new ConsentManager({})
  initUI(cm, {})
  cm.init()

  const reopener = trouverReopener(body)
  assert.strictEqual(reopener.classList.contains('cm-hidden'), true, 'réouverture visible avant tout choix')
  const banner = body.children.find(el => el.classList.contains('cm-banner'))
  assert.ok(banner, 'bannière absente du DOM')
  assert.strictEqual(banner.classList.contains('cm-hidden'), false, 'bannière masquée pour un nouveau visiteur')
})

test('reopener désactivé par config : aucun bouton, et le démarrage ne plante pas', async () => {
  const { body } = installDOM()
  installStorage(consentement({ necessary: true, analytics: true }))
  const { ConsentManager } = await import('../src/core/consent-manager.js')
  const { initUI } = await import('../src/ui/ui-manager.js')

  const cm = new ConsentManager({})
  initUI(cm, { reopener: false })
  cm.init()

  assert.strictEqual(trouverReopener(body), undefined, 'bouton créé malgré reopener: false')
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

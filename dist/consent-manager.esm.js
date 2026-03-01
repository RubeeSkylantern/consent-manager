var g="__cm_consent";function E(){try{let t=localStorage.getItem(g);if(!t)return null;let e=JSON.parse(t);if(e&&e.v===1&&e.c)return e}catch{}return null}function z(t){let e={v:1,t:Date.now(),c:{...t}},o=JSON.stringify(e);try{localStorage.setItem(g,o)}catch{}try{let r=[`${g}=${encodeURIComponent(o)}`,"max-age=33696000","path=/","SameSite=Lax"];location.protocol==="https:"&&r.push("Secure"),document.cookie=r.join("; ")}catch{}return e}function O(){try{localStorage.removeItem(g)}catch{}try{document.cookie=`${g}=; max-age=0; path=/; SameSite=Lax`}catch{}}function I(t){if(!t||!t.t)return!0;let e=33696e3*1e3;return Date.now()-t.t>e}var d={necessary:{id:"necessary",required:!0,defaultValue:!0},analytics:{id:"analytics",required:!1,defaultValue:!1},marketing:{id:"marketing",required:!1,defaultValue:!1},personalization:{id:"personalization",required:!1,defaultValue:!1}},m=Object.keys(d);function u(){let t={};for(let[e,o]of Object.entries(d))t[e]=o.defaultValue;return t}function D(){return"(function(){var d={ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',personalization_storage:'denied',functionality_storage:'granted',security_storage:'granted'};try{var c=JSON.parse(localStorage.getItem('__cm_consent'));if(c&&c.c){if(c.c.analytics)d.analytics_storage='granted';if(c.c.marketing){d.ad_storage='granted';d.ad_user_data='granted';d.ad_personalization='granted'}if(c.c.personalization)d.personalization_storage='granted'}}catch(e){}window.dataLayer=window.dataLayer||[];function g(){window.dataLayer.push(arguments)}window.gtag=g;g('consent','default',d);g('set','url_passthrough',true);g('set','ads_data_redaction',d.ad_storage==='denied')})();"}function F(t){return{analytics_storage:t.analytics?"granted":"denied",ad_storage:t.marketing?"granted":"denied",ad_user_data:t.marketing?"granted":"denied",ad_personalization:t.marketing?"granted":"denied",personalization_storage:t.personalization?"granted":"denied",functionality_storage:"granted",security_storage:"granted"}}function C(t){if(typeof window>"u")return;let e=F(t);window.dataLayer=window.dataLayer||[],window.gtag||(window.gtag=function(){window.dataLayer.push(arguments)}),window.gtag("consent","update",e),window.gtag("set","ads_data_redaction",e.ad_storage==="denied")}var L="__cm_proof";function V(){let t=new Uint8Array(4);return crypto.getRandomValues(t),Array.from(t,e=>e.toString(16).padStart(2,"0")).join("")}async function U(t){try{let o=new TextEncoder().encode(t),r=await crypto.subtle.digest("SHA-256",o);return"sha256-"+Array.from(new Uint8Array(r)).map(a=>a.toString(16).padStart(2,"0")).join("")}catch{return null}}function H(){try{let t=localStorage.getItem(L);if(!t)return[];let e=JSON.parse(t);return Array.isArray(e.proofs)?e.proofs:[]}catch{return[]}}function K(t){try{localStorage.setItem(L,JSON.stringify({proofs:t}))}catch{}}async function $(t,e){let o={id:V(),timestamp:new Date().toISOString(),version:1,action:t,categories:{...e}},r=JSON.stringify({id:o.id,timestamp:o.timestamp,action:o.action,categories:o.categories});o.hash=await U(r);let n=H();for(n.push(o);n.length>5;)n.shift();return K(n),o}function R(){try{localStorage.removeItem(L)}catch{}}function M(){let t={};return{on(e,o){(t[e]||(t[e]=[])).push(o)},off(e,o){let r=t[e];r&&(t[e]=r.filter(n=>n!==o))},emit(e,o){let r=t[e];r&&r.forEach(n=>n(o))}}}var p=class{constructor(e={}){this.config=e,this.emitter=M(),this.categories=u(),this._initialized=!1,this._pendingCallbacks=[],this._ui=null}init(){if(this._initialized)return;this._initialized=!0;let e=E();e&&!I(e)?(this.categories={...u(),...e.c},this._flushPendingCallbacks()):(this.categories=u(),this.showBanner())}acceptAll(){for(let e of m)this.categories[e]=!0;this._save("accept_all"),this.emitter.emit("consent:accept-all",this.categories),this.hideBanner()}rejectAll(){for(let e of m)this.categories[e]=d[e].required;this._save("reject_all"),this.emitter.emit("consent:reject-all",this.categories),this.hideBanner()}acceptCategories(e){for(let o of m)d[o].required?this.categories[o]=!0:this.categories[o]=e.includes(o);this._save("accept_custom"),this.hideBanner()}hasConsent(e){return!!this.categories[e]}onConsent(e,o){this.hasConsent(e)?o():this._pendingCallbacks.push({category:e,callback:o})}showBanner(){this._ui&&(this._ui.showBanner(),this.emitter.emit("banner:show"))}hideBanner(){this._ui&&(this._ui.hideBanner(),this.emitter.emit("banner:hide"))}showModal(){this._ui&&this._ui.showModal(this.categories)}reset(){O(),R(),this.categories=u(),C(this.categories),this._pendingCallbacks=[],this.showBanner()}getCategories(){return{...this.categories}}on(e,o){this.emitter.on(e,o)}off(e,o){this.emitter.off(e,o)}_setUI(e){this._ui=e}_save(e){z(this.categories),C(this.categories),$(e,this.categories),this.emitter.emit("consent:update",this.categories),this._flushPendingCallbacks()}_flushPendingCallbacks(){let e=[];for(let o of this._pendingCallbacks)this.hasConsent(o.category)?o.callback():e.push(o);this._pendingCallbacks=e}};function j(t){let e=t.texts||{},o=document.createElement("div");return o.className="cm-banner",o.setAttribute("role","dialog"),o.setAttribute("aria-label",e.bannerAriaLabel||"Gestion des cookies"),o.innerHTML=`
    <div class="cm-banner-text">
      ${e.bannerText||"Nous utilisons des cookies pour am\xE9liorer votre exp\xE9rience. Vous pouvez personnaliser vos pr\xE9f\xE9rences."}
      ${e.privacyLink?` <a href="${e.privacyLink}">${e.privacyLinkText||"Politique de confidentialit\xE9"}</a>`:""}
    </div>
    <div class="cm-banner-actions">
      <button class="cm-btn cm-btn-secondary" data-cm-action="reject">
        ${e.rejectAll||"Tout refuser"}
      </button>
      <button class="cm-btn cm-btn-link" data-cm-action="customize">
        ${e.customize||"Personnaliser"}
      </button>
      <button class="cm-btn cm-btn-primary" data-cm-action="accept">
        ${e.acceptAll||"Tout accepter"}
      </button>
    </div>
  `,o.addEventListener("click",r=>{let n=r.target.closest("[data-cm-action]");if(!n)return;let a=n.dataset.cmAction;a==="accept"&&t.onAcceptAll&&t.onAcceptAll(),a==="reject"&&t.onRejectAll&&t.onRejectAll(),a==="customize"&&t.onCustomize&&t.onCustomize()}),o}var P='button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';function q(t){let e=null;function o(r){if(r.key==="Tab"){let n=t.querySelectorAll(P);if(n.length===0)return;let a=n[0],c=n[n.length-1];r.shiftKey?document.activeElement===a&&(r.preventDefault(),c.focus()):document.activeElement===c&&(r.preventDefault(),a.focus())}}return{activate(){e=document.activeElement,t.addEventListener("keydown",o);let r=t.querySelector(P);r&&r.focus()},deactivate(){t.removeEventListener("keydown",o),e&&e.focus&&e.focus()}}}function B(t){let e=t.texts||{},o=e.categories||{},r=null,n=document.createElement("div");n.className="cm-overlay cm-hidden",n.setAttribute("role","presentation");let a=document.createElement("div");a.className="cm-modal",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.setAttribute("aria-label",e.modalTitle||"Param\xE8tres des cookies"),n.appendChild(a);function c(i){a.innerHTML=`
      <h2 class="cm-modal-title">${e.modalTitle||"Param\xE8tres des cookies"}</h2>
      <p class="cm-modal-desc">${e.modalDesc||"Choisissez les cat\xE9gories de cookies que vous souhaitez autoriser."}</p>
      <div class="cm-categories">
        ${m.map(s=>w(s,i[s],o[s])).join("")}
      </div>
      <div class="cm-modal-footer">
        <button class="cm-btn cm-btn-secondary" data-cm-action="confirm">
          ${e.confirm||"Confirmer mes choix"}
        </button>
        <button class="cm-btn cm-btn-primary" data-cm-action="accept-all">
          ${e.acceptAll||"Tout accepter"}
        </button>
      </div>
    `}function w(i,s,l){let v=d[i],T=l?.label||i,A=l?.description||"",S=l?.cookies||[];return`
      <div class="cm-category">
        <div class="cm-category-header">
          <div>
            <span class="cm-category-name">${T}</span>
            ${v.required?'<span class="cm-category-required">(obligatoire)</span>':""}
          </div>
          <label class="cm-toggle">
            <input type="checkbox"
              data-cm-category="${i}"
              ${s?"checked":""}
              ${v.required?"disabled":""}
              aria-label="${T}"
            >
            <span class="cm-toggle-track"></span>
          </label>
        </div>
        ${A||S.length?`
          <details class="cm-category-details">
            <summary>${e.moreInfo||"En savoir plus"}</summary>
            ${A?`<p>${A}</p>`:""}
            ${S.length?`
              <ul class="cm-cookie-list">
                ${S.map(k=>`<li><strong>${k.name}</strong> \u2014 ${k.description}${k.duration?` (${k.duration})`:""}</li>`).join("")}
              </ul>
            `:""}
          </details>
        `:""}
      </div>
    `}n.addEventListener("click",i=>{if(i.target===n){f();return}let s=i.target.closest("[data-cm-action]");if(!s)return;let l=s.dataset.cmAction;if(l==="accept-all"&&t.onAcceptAll&&(t.onAcceptAll(),f()),l==="confirm"){let v=b();t.onConfirm&&t.onConfirm(v),f()}}),n.addEventListener("keydown",i=>{i.key==="Escape"&&f()});function b(){let i=a.querySelectorAll("[data-cm-category]"),s=[];return i.forEach(l=>{l.checked&&s.push(l.dataset.cmCategory)}),s}function _(i){c(i),n.classList.remove("cm-hidden"),r=q(a),r.activate()}function f(){n.classList.add("cm-hidden"),r&&(r.deactivate(),r=null),t.onClose&&t.onClose()}return{overlay:n,show:_,hide:f}}function G(t){let e=document.createElement("button");return e.className="cm-reopener cm-hidden",e.setAttribute("aria-label",t.ariaLabel||"Modifier mes pr\xE9f\xE9rences cookies"),e.setAttribute("title",t.title||"Cookies"),e.textContent="\u{1F36A}",e.addEventListener("click",()=>{t.onClick&&t.onClick()}),e}var N=`/* ==============================================
   Consent Manager \u2014 Styles de base
   Variables CSS pour theming par site
   Budget : <3KB non gzipp\xE9
   ============================================== */

:root {
  --cm-primary: #2563eb;
  --cm-primary-hover: #1d4ed8;
  --cm-bg: #ffffff;
  --cm-text: #1f2937;
  --cm-text-secondary: #6b7280;
  --cm-border: #e5e7eb;
  --cm-overlay: rgba(0, 0, 0, 0.4);
  --cm-radius: 12px;
  --cm-font: system-ui, -apple-system, sans-serif;
  --cm-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  --cm-z-banner: 999998;
  --cm-z-modal: 999999;
  --cm-z-reopener: 999997;
}

/* Banner */
.cm-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--cm-z-banner);
  background: var(--cm-bg);
  color: var(--cm-text);
  font-family: var(--cm-font);
  box-shadow: var(--cm-shadow);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  line-height: 1.5;
  animation: cm-slide-up 0.3s ease-out;
}

.cm-banner.cm-hidden {
  display: none;
}

.cm-banner-text {
  flex: 1;
  min-width: 0;
}

.cm-banner-text a {
  color: var(--cm-primary);
  text-decoration: underline;
}

.cm-banner-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* Buttons */
.cm-btn {
  font-family: var(--cm-font);
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s, opacity 0.15s;
}

.cm-btn:focus-visible {
  outline: 2px solid var(--cm-primary);
  outline-offset: 2px;
}

.cm-btn-primary {
  background: var(--cm-primary);
  color: #fff;
}

.cm-btn-primary:hover {
  background: var(--cm-primary-hover);
}

.cm-btn-secondary {
  background: transparent;
  color: var(--cm-text);
  border: 1.5px solid var(--cm-border);
}

.cm-btn-secondary:hover {
  background: var(--cm-border);
}

.cm-btn-link {
  background: transparent;
  color: var(--cm-text-secondary);
  padding: 10px 12px;
  text-decoration: underline;
}

.cm-btn-link:hover {
  color: var(--cm-text);
}

/* Modal overlay */
.cm-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--cm-z-modal);
  background: var(--cm-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: cm-fade-in 0.2s ease-out;
}

.cm-overlay.cm-hidden {
  display: none;
}

/* Modal */
.cm-modal {
  background: var(--cm-bg);
  color: var(--cm-text);
  font-family: var(--cm-font);
  border-radius: var(--cm-radius);
  max-width: 560px;
  width: calc(100% - 32px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 28px;
  font-size: 14px;
  line-height: 1.5;
  animation: cm-scale-in 0.2s ease-out;
}

.cm-modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
}

.cm-modal-desc {
  color: var(--cm-text-secondary);
  margin: 0 0 20px;
}

/* Category item */
.cm-category {
  border: 1px solid var(--cm-border);
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
}

.cm-category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
}

.cm-category-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.cm-category-name {
  font-weight: 600;
}

.cm-category-required {
  font-size: 12px;
  color: var(--cm-text-secondary);
  margin-left: 8px;
}

/* Toggle switch */
.cm-toggle {
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.cm-toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.cm-toggle-track {
  position: absolute;
  inset: 0;
  background: var(--cm-border);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.cm-toggle input:checked + .cm-toggle-track {
  background: var(--cm-primary);
}

.cm-toggle input:disabled + .cm-toggle-track {
  opacity: 0.5;
  cursor: not-allowed;
}

.cm-toggle-track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.cm-toggle input:checked + .cm-toggle-track::after {
  transform: translateX(20px);
}

.cm-toggle input:focus-visible + .cm-toggle-track {
  outline: 2px solid var(--cm-primary);
  outline-offset: 2px;
}

/* Category details (expandable) */
.cm-category-details {
  padding: 0 16px 14px;
  font-size: 13px;
  color: var(--cm-text-secondary);
}

.cm-category-details[open] summary {
  margin-bottom: 8px;
}

.cm-category-details summary {
  cursor: pointer;
  font-size: 12px;
  color: var(--cm-primary);
}

.cm-cookie-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cm-cookie-list li {
  padding: 4px 0;
  border-bottom: 1px solid var(--cm-border);
}

.cm-cookie-list li:last-child {
  border-bottom: none;
}

/* Modal footer */
.cm-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--cm-border);
}

/* Reopener button */
.cm-reopener {
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: var(--cm-z-reopener);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--cm-bg);
  color: var(--cm-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.cm-reopener:hover {
  transform: scale(1.1);
}

.cm-reopener:focus-visible {
  outline: 2px solid var(--cm-primary);
  outline-offset: 2px;
}

.cm-reopener.cm-hidden {
  display: none;
}

/* Animations */
@keyframes cm-slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes cm-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes cm-scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .cm-banner {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 14px;
  }

  .cm-banner-actions {
    flex-direction: column;
  }

  .cm-btn {
    width: 100%;
    text-align: center;
  }

  .cm-modal {
    padding: 20px;
    max-height: calc(100vh - 20px);
  }
}
`;function J(){if(document.getElementById("cm-styles"))return;let t=document.createElement("style");t.id="cm-styles",t.textContent=N,document.head.appendChild(t)}function h(t,e={}){if(J(),e.theme){let c=document.documentElement,w={primaryColor:"--cm-primary",primaryHoverColor:"--cm-primary-hover",backgroundColor:"--cm-bg",textColor:"--cm-text",textSecondaryColor:"--cm-text-secondary",borderColor:"--cm-border",fontFamily:"--cm-font",borderRadius:"--cm-radius"};for(let[b,_]of Object.entries(w))e.theme[b]&&c.style.setProperty(_,e.theme[b])}let o=j({texts:e.texts||{},onAcceptAll:()=>t.acceptAll(),onRejectAll:()=>t.rejectAll(),onCustomize:()=>r.show(t.getCategories())}),r=B({texts:e.texts||{},onAcceptAll:()=>t.acceptAll(),onConfirm:c=>t.acceptCategories(c),onClose:()=>{}}),a=e.reopener!==!1?G({ariaLabel:e.texts?.reopenerAriaLabel,title:e.texts?.reopenerTitle,onClick:()=>r.show(t.getCategories())}):null;document.body.appendChild(o),document.body.appendChild(r.overlay),a&&document.body.appendChild(a),t._setUI({showBanner(){o.classList.remove("cm-hidden"),a&&a.classList.add("cm-hidden")},hideBanner(){o.classList.add("cm-hidden"),a&&a.classList.remove("cm-hidden")},showModal(c){r.show(c)}})}var x={reopener:!0,theme:{primaryColor:"#2563eb",primaryHoverColor:"#1d4ed8",backgroundColor:"#ffffff",textColor:"#1f2937",textSecondaryColor:"#6b7280",borderColor:"#e5e7eb",fontFamily:"system-ui, -apple-system, sans-serif",borderRadius:"12px"},texts:{bannerText:"Nous utilisons des cookies pour am\xE9liorer votre exp\xE9rience, analyser le trafic et personnaliser le contenu. Vous pouvez choisir les cookies que vous acceptez.",bannerAriaLabel:"Gestion des cookies",acceptAll:"Tout accepter",rejectAll:"Tout refuser",customize:"Personnaliser",modalTitle:"Param\xE8tres des cookies",modalDesc:"Choisissez les cat\xE9gories de cookies que vous souhaitez autoriser. Les cookies n\xE9cessaires sont indispensables au fonctionnement du site.",confirm:"Confirmer mes choix",moreInfo:"En savoir plus",privacyLink:"",privacyLinkText:"Politique de confidentialit\xE9",reopenerAriaLabel:"Modifier mes pr\xE9f\xE9rences cookies",reopenerTitle:"Cookies",categories:{necessary:{label:"N\xE9cessaires",description:"Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas \xEAtre d\xE9sactiv\xE9s.",cookies:[]},analytics:{label:"Analytiques",description:"Ces cookies nous permettent de mesurer le trafic et d'analyser votre utilisation du site pour en am\xE9liorer les performances.",cookies:[{name:"Google Analytics",description:"Mesure d'audience et statistiques de navigation",duration:"13 mois"}]},marketing:{label:"Marketing",description:"Ces cookies sont utilis\xE9s pour le suivi publicitaire et le remarketing.",cookies:[{name:"Google Ads",description:"Suivi des conversions et remarketing",duration:"13 mois"}]},personalization:{label:"Personnalisation",description:"Ces cookies permettent de personnaliser votre exp\xE9rience sur le site.",cookies:[]}}}};function y(t={}){return{reopener:t.reopener??x.reopener,theme:{...x.theme,...t.theme},texts:{...x.texts,...t.texts,categories:X(x.texts.categories,t.texts?.categories)}}}function X(t,e){if(!e)return{...t};let o={...t};for(let[r,n]of Object.entries(e))o[r]={...t[r],...n};return o}function Q(t={}){let e=y(t),o=new p(e);return h(o,e),o.init(),o}function W(t={}){return function(o,r){let n=y(t),a=new p(n);h(a,n),r("consent",a),a.init()}}export{d as CATEGORIES,m as CATEGORY_IDS,p as ConsentManager,O as clearConsent,W as createConsentPlugin,x as defaultConfig,u as getDefaultConsent,D as getHeadSnippet,Q as initConsent,h as initUI,y as mergeConfig,E as readConsent,C as updateGoogleConsent,z as writeConsent};

// ── Ad tracking config ────────────────────────────────────────────
// Fill these in when the ad accounts are ready. Leave blank to disable.
export const META_PIXEL_ID = ''      // e.g. '123456789012345'
export const TIKTOK_PIXEL_ID = ''    // e.g. 'C1A2B3C4D5E6F7G8H9'

let metaReady = false
let tiktokReady = false

function loadMetaPixel(id){
  if(metaReady || !id) return
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */
  window.fbq('init', id)
  window.fbq('track', 'PageView')
  metaReady = true
}

function loadTikTokPixel(id){
  if(tiktokReady || !id) return
  /* eslint-disable */
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
    ttq.load(id);ttq.page();
  }(window, document, 'ttq')
  /* eslint-enable */
  tiktokReady = true
}

export function initPixels(){
  if(typeof window === 'undefined') return
  loadMetaPixel(META_PIXEL_ID)
  loadTikTokPixel(TIKTOK_PIXEL_ID)
}

// Fire a standard ecommerce event to whichever pixels are configured.
// type: 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase'
export function trackEvent(type, data = {}){
  if(typeof window === 'undefined') return
  const value = data.value || 0
  const currency = data.currency || 'AED'
  const contents = data.contents || []
  if(window.fbq){
    window.fbq('track', type, {
      value,
      currency,
      content_type: 'product',
      content_ids: contents.map(c => c.id),
      contents: contents.map(c => ({ id: c.id, quantity: c.quantity || 1 })),
    })
  }
  if(window.ttq){
    const ttMap = { ViewContent:'ViewContent', AddToCart:'AddToCart', InitiateCheckout:'InitiateCheckout', Purchase:'CompletePayment' }
    window.ttq.track(ttMap[type] || type, {
      value,
      currency,
      contents: contents.map(c => ({ content_id: c.id, quantity: c.quantity || 1, price: c.price })),
    })
  }
}

import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Banknote, CheckCircle2, CreditCard, Heart, Minus, Plus, Search, Share2, ShoppingBag, Trash2, Truck, User, X } from 'lucide-react'
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { assets, blackProductGallery, collections, products, FLAVORS } from './data'
import { initPixels, trackEvent } from './analytics'

const CartContext = createContext(null)
const LanguageContext = createContext(null)
const FREE_DELIVERY_AT = 200
const UAE_DELIVERY_FEE = 0
const INSTAGRAM_URL = 'https://www.instagram.com/lamssa_ae/'
const WHATSAPP_URL = 'https://wa.me/971567277289'

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lamssa-cart') || '[]') } catch { return [] }
  })
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => localStorage.setItem('lamssa-cart', JSON.stringify(cart)), [cart])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.priceAed * item.qty, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : UAE_DELIVERY_FEE
  const total = subtotal + shipping

  function addToCart(line) {
    const item = {
      id: line.id,
      name: line.name,
      image: line.image || line.img,
      priceAed: line.priceAed || 350,
      length: line.length || '54',
      size: line.size || 'Free Size',
      buttons: line.buttons || 'No',
      color: line.color || line.colorName || 'Black',
      urgent: Boolean(line.urgent),
      qty: line.qty || 1,
    }
    item.key = [item.id, item.color, item.length, item.size, item.buttons, item.urgent ? 'urgent' : 'standard'].join('|')
    setCart(prev => {
      const found = prev.find(x => x.key === item.key)
      if (found) return prev.map(x => x.key === item.key ? { ...x, qty: x.qty + item.qty } : x)
      return [...prev, item]
    })
    trackEvent('AddToCart', { value: item.priceAed * item.qty, currency: 'AED', contents: [{ id: item.id, quantity: item.qty, price: item.priceAed }] })
    setCartOpen(true)
  }

  function updateQty(key, qty) {
    setCart(prev => prev.map(x => x.key === key ? { ...x, qty: Math.max(1, qty) } : x))
  }
  function removeItem(key) { setCart(prev => prev.filter(x => x.key !== key)) }
  function clearCart() { setCart([]) }

  return <CartContext.Provider value={{ cart, cartCount, subtotal, shipping, total, cartOpen, setCartOpen, addToCart, updateQty, removeItem, clearCart }}>{children}</CartContext.Provider>
}
function useCart(){ return useContext(CartContext) }

const copy = {
  en: {
    promo:'LAMSSA · TASTE THAT TOUCHES THE SENSES · UAE', shop:'Shop', new:'New', collections:'Collections', lace:'Bestsellers', contact:'Contact', search:'Search', account:'Account', cart:'Open cart', language:'Arabic', footerLang:'English', addToCart:'Add to cart', salePrice:'Sale price', viewAll:'View all', checkout:'Checkout', continueShopping:'Continue shopping', home:'Home', abayas:'Products', shopNow:'Shop now', openCollection:'Open collection', pieces:'Products', price:'Price', color:'Color', length:'Size', buttons:'Type', size:'Size', sizeChart:'Size guide', no:'No', yes:'Yes', freeSize:'One Size', custom:'Custom', buyNow:'Buy now', relatedProducts:'Related Products', inStock:'Available', premiumAbaya:'Lamssa', uaecustomers:'Ships from UAE', taxDelivery:'Price shown in AED', paymentLine:'Pay by card, Tabby, Tamara or COD in UAE.', freeDeliveryOver:'Delivery details', intlShipping:'Contact us for delivery details'
  },
  ar: {
    promo:'لمسة · ذوق يلامس الإحساس · الإمارات', shop:'تسوق', new:'جديد', collections:'المجموعات', lace:'الأكثر مبيعاً', contact:'تواصل', search:'بحث', account:'الحساب', cart:'افتح السلة', language:'الإنجليزية', footerLang:'العربية', addToCart:'أضف للسلة', salePrice:'السعر', viewAll:'عرض الكل', checkout:'إتمام الطلب', continueShopping:'متابعة التسوق', home:'الرئيسية', abayas:'المنتجات', shopNow:'تسوق الآن', openCollection:'افتح المجموعة', pieces:'منتجات', price:'السعر', color:'اللون', length:'الحجم', buttons:'النوع', size:'المقاس', sizeChart:'دليل المقاسات', no:'لا', yes:'نعم', freeSize:'مقاس واحد', custom:'حسب الطلب', buyNow:'اشترِ الآن', relatedProducts:'منتجات مشابهة', inStock:'متوفر', premiumAbaya:'لمسة', uaecustomers:'شحن من الإمارات', taxDelivery:'السعر بالدرهم الإماراتي', paymentLine:'ادفع بالبطاقة أو تابي أو تمارا أو الدفع عند الاستلام داخل الإمارات.', freeDeliveryOver:'تفاصيل التوصيل', intlShipping:'تواصل معنا لتفاصيل التوصيل'
  }
}
const arCollections = {
  'NEW ARRIVALS':'وصل حديثاً',
  'EDIBLE BIKINI':'بكيني قابل للأكل', 'BODY CARE':'العناية بالجسم',
  'Edible Bikini':'بكيني قابل للأكل', 'Body Care':'العناية بالجسم', 'Related Products':'منتجات مشابهة', 'Our products':'منتجاتنا',
  'LAMSSA New Arrivals':'وصل حديثاً من لمسة', 'Lamssa new arrivals':'وصل حديثاً من لمسة'
}
const productName = (p, lang='en') => lang === 'ar' ? (p.arName || 'منتج لمسة') : p.name
const productDesc = (p, lang='en') => lang === 'ar' ? (p.arDesc || p.desc) : p.desc
const collectionText = (text, lang='en') => lang === 'ar' ? (arCollections[text] || text) : text
function LanguageProvider({ children }){
  const [lang,setLang] = useState(() => {
    try { return localStorage.getItem('lamssa-lang') || 'ar' } catch { return 'ar' }
  })
  useEffect(() => {
    try { localStorage.setItem('lamssa-lang', lang) } catch { /* Storage can be blocked in private mode. */ }
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en'
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = lang === 'ar' ? 'لمسة | ذوق يلامس الإحساس' : 'Lamssa | Taste That Touches The Senses'
  }, [lang])
  const value = useMemo(() => ({ lang, isAr: lang === 'ar', t:(key)=>copy[lang]?.[key] || copy.en[key] || key, toggleLang:()=>setLang(x=>x==='ar'?'en':'ar') }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
function useLang(){ return useContext(LanguageContext) }

const currencies = [
  { code:'AED', symbol:'Dhs.', arSymbol:'د.إ', rate:1, label:'AED - UAE Dirham', arLabel:'الدرهم الإماراتي' },
  { code:'USD', symbol:'$', arSymbol:'د.أ', rate:0.272, label:'USD - US Dollar', arLabel:'الدولار الأمريكي' },
  { code:'EUR', symbol:'€', arSymbol:'يورو', rate:0.251, label:'EUR - Euro', arLabel:'اليورو' },
  { code:'SAR', symbol:'SAR', arSymbol:'ر.س', rate:1.022, label:'SAR - Saudi Riyal', arLabel:'الريال السعودي' },
  { code:'KWD', symbol:'KD', arSymbol:'د.ك', rate:0.084, label:'KWD - Kuwaiti Dinar', arLabel:'الدينار الكويتي' },
]
const CurrencyContext = createContext(null)
function CurrencyProvider({ children }){
  const { isAr } = useLang()
  const [currency,setCurrency] = useState(() => {
    try { const c = localStorage.getItem('lamssa-currency'); return currencies.find(x=>x.code===c) || currencies[0] } catch { return currencies[0] }
  })
  useEffect(() => {
    try { localStorage.setItem('lamssa-currency', currency.code) } catch { /* Storage can be blocked in private mode. */ }
  }, [currency])
  const fmt = useMemo(() => (aed) => {
    const converted = (aed || 0) * currency.rate
    const decimals = currency.code === 'KWD' ? 3 : 2
    const amount = converted.toLocaleString(isAr?'ar-AE':'en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})
    return `${isAr?currency.arSymbol:currency.symbol} ${amount}`
  }, [currency,isAr])
  const value = useMemo(() => ({ currency, currencies, setCurrency, fmt }), [currency, fmt])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
function useCurrency(){ return useContext(CurrencyContext) }

function BrandLogo({ small=false, light=false }){
  const { isAr } = useLang()
  return <div className={`brand-lockup ${small ? 'brand-lockup-small' : ''} ${light ? 'brand-lockup-light text-white' : 'text-[#181818]'}`}>
    <span className={`brand-main ${isAr?'brand-main-ar':''}`}>{isAr?'لمسة':'LAMSSA'}</span>
    <span className={`brand-sub ${isAr?'brand-sub-ar':''}`}>{isAr?'ذوق يلامس الإحساس':'TASTE THAT TOUCHES'}</span>
  </div>
}

function InstagramIcon({ className = 'w-5 h-5' }){
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5.1" />
    <circle cx="12" cy="12" r="4.05" />
    <circle cx="17.35" cy="6.65" r=".9" fill="currentColor" stroke="none" />
  </svg>
}

function WhatsAppIcon({ className = 'w-5 h-5' }){
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M12.04 2C6.57 2 2.12 6.42 2.12 11.86c0 1.74.46 3.44 1.33 4.94L2 22l5.35-1.4a9.96 9.96 0 0 0 4.69 1.18h.01c5.47 0 9.92-4.42 9.92-9.86A9.78 9.78 0 0 0 19.06 4.9 9.9 9.9 0 0 0 12.04 2Zm0 18.1h-.01a8.25 8.25 0 0 1-4.2-1.15l-.3-.18-3.18.83.85-3.08-.2-.32a8.14 8.14 0 0 1-1.25-4.34c0-4.5 3.72-8.17 8.29-8.17a8.3 8.3 0 0 1 5.86 2.42 8.08 8.08 0 0 1 2.43 5.8c0 4.51-3.72 8.18-8.29 8.18Zm4.55-6.12c-.25-.12-1.48-.73-1.7-.81-.23-.08-.4-.12-.57.12-.17.25-.65.8-.8.96-.15.17-.3.19-.55.07-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.01-.38.11-.5.12-.12.25-.3.38-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.07-.12-.57-1.36-.78-1.86-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.23.9 2.42 1.03 2.58.12.17 1.77 2.69 4.3 3.77.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.2-.58.2-1.08.14-1.18-.06-.1-.23-.17-.48-.29Z" />
  </svg>
}

function Header(){
  const { cartCount, setCartOpen } = useCart()
  const { lang, isAr, t, toggleLang } = useLang()
  const iconClass = 'w-[18px] h-[18px] md:w-[19px] md:h-[19px]'
  const iconButton = 'grid place-items-center w-9 h-9 rounded-full border border-[#dedbd5] bg-white/55 hover:bg-[#d4567a] hover:text-white hover:border-[#1a1a1a] transition'
  return <>
    <div className="w-full max-w-full overflow-hidden h-[30px] bg-[#fff0f3] flex items-center justify-center text-center text-[9px] md:text-[11px] tracking-[.18em] uppercase px-3 text-[#b8435f] border-b border-[#f0d4dc]">{t('promo')}</div>
    <header className="w-full max-w-full overflow-hidden h-[76px] md:h-[104px] border-b border-[#dedbd5] bg-[#ffffff]/95 relative z-10 shadow-[0_12px_35px_rgba(17,17,17,0.045)]">
      <div className="container-basic h-full grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8 min-w-0">
        <nav className="desktop-nav flex items-center gap-8 text-[11px] tracking-[.16em] uppercase text-[#202020]"><Link className="nav-luxe" to="/">{t('shop')}</Link><Link className="nav-luxe" to="/collection/new-arrivals">{t('new')}</Link><Link className="nav-luxe" to="/#collections">{t('collections')}</Link><Link className="nav-luxe" to="/collection/edible-bikini">{isAr?'بكيني':'Bikini'}</Link></nav>
        <Link to="/" className="justify-self-start md:justify-self-center shrink-0 px-2" aria-label={isAr?'الصفحة الرئيسية للمسة':'Lamssa home'}><BrandLogo /></Link>
        <div className="flex items-center justify-end gap-1.5 md:gap-2.5 text-[11px] shrink-0 min-w-0">
          <Link to="/" className="desktop-nav mr-2 uppercase tracking-[.16em] text-[#202020] nav-luxe">{t('contact')}</Link>
          <CurrencySwitcher/>
          <button type="button" onClick={toggleLang} aria-label={isAr?'التبديل إلى الإنجليزية':'Switch to Arabic'} className="h-9 px-3 rounded-full border border-[#dedbd5] bg-white/70 inline-flex items-center justify-center text-[10px] md:text-[11px] font-semibold uppercase tracking-[.08em] hover:bg-[#d4567a] hover:text-white hover:border-[#1a1a1a] transition">{lang === 'ar' ? 'إنجليزي' : 'عربي'}</button>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label={isAr?'إنستغرام لمسة':'Lamssa Instagram'} className={iconButton}><InstagramIcon className={iconClass}/></a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label={isAr?'واتساب لمسة':'Lamssa WhatsApp'} className={iconButton}><WhatsAppIcon className={iconClass}/></a>
          <button className={`${iconButton} hidden md:grid`} aria-label={t('search')}><Search className={iconClass}/></button>
          <button className={`${iconButton} hidden md:grid`} aria-label={t('account')}><User className={iconClass}/></button>
          <button onClick={()=>setCartOpen(true)} className={`${iconButton} relative`} aria-label={t('cart')}><ShoppingBag className={iconClass}/>{cartCount>0 && <span className="absolute -right-1.5 -top-1.5 bg-[#d4567a] text-white rounded-full min-w-[18px] h-[18px] px-1 grid place-items-center text-[10px] leading-none border border-[#f7f6f2]">{cartCount}</span>}</button>
        </div>
      </div>
    </header>
  </>
}
function CartDrawer(){
  const { cart, cartOpen, setCartOpen, subtotal, total, updateQty, removeItem, addToCart } = useCart()
  const { t, lang, isAr } = useLang()
  const { fmt } = useCurrency()
  const remaining = Math.max(0, FREE_DELIVERY_AT - subtotal)
  const pct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_AT) * 100))
  const bundle = products.find(p => p.id === 'femininity-care-package') || products.find(p => !cart.some(c => c.id === p.id)) || products[0]
  const bundleInCart = cart.some(c => c.id === bundle?.id)
  return <AnimatePresence>
    {cartOpen && <>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-[#d4567a]/45 backdrop-blur-[2px] z-50" onClick={()=>setCartOpen(false)} />
      <motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring', damping:32, stiffness:300}} className="fixed right-0 top-0 h-full w-full max-w-[470px] bg-[#ffffff] z-50 shadow-[0_0_70px_rgba(0,0,0,0.28)] flex flex-col overflow-hidden">
        <div className="border-b border-[#dedbd5] bg-[#ffffff] px-5 py-5 md:px-7">
          <div className="flex items-center justify-between gap-4">
            <div><p className="mb-1 text-[10px] uppercase tracking-[.24em] text-[#55514d]">{isAr?'لمسة':'LAMSSA'}</p><h2 className="text-[16px] font-semibold uppercase tracking-[.18em]">{isAr?'سلة التسوق':'Your Cart'}</h2></div>
            <button onClick={()=>setCartOpen(false)} aria-label={isAr?'إغلاق السلة':'Close cart'} className="grid h-11 w-11 place-items-center rounded-full border border-[#dedbd5] bg-white hover:bg-[#d4567a] hover:text-white transition"><X size={20}/></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7">
          {cart.length === 0 ? <div className="h-full grid place-items-center text-center"><div className="rounded-[30px] border border-[#dedbd5] bg-white p-9 shadow-[0_22px_60px_rgba(17,17,17,0.06)]"><ShoppingBag className="mx-auto mb-4" size={42}/><p className="mb-2 uppercase tracking-[.16em]">{isAr?'السلة فارغة':'Your cart is empty'}</p><p className="mb-6 text-sm leading-6 text-[#706c67]">{isAr?'أضف منتج من لمسة لبدء الطلب.':'Add a Lamssa product to begin your order.'}</p><Link to="/collection/new-arrivals" onClick={()=>setCartOpen(false)} className="btn btn-black">{isAr?'تسوقي الجديد':'Shop new arrivals'}</Link></div></div> : <>
            <div className="mb-5 rounded-[20px] border border-[#f0d4dc] bg-[#fff0f3] p-4">
              <div className="mb-2.5 flex items-center gap-2 text-[12px] font-medium leading-5 text-[#3d2b30]"><Truck size={16} className="shrink-0 text-[#d4567a]"/>{remaining > 0 ? <span>{isAr?<>أضف بـ <b className="text-[#d4567a]">{fmt(remaining)}</b> واحصل على توصيل مجاني 🚚</>:<>Add <b className="text-[#d4567a]">{fmt(remaining)}</b> more to get free delivery 🚚</>}</span> : <span className="font-semibold text-[#1a9e4b]">{isAr?'🎉 توصيلك مجاني!':'🎉 You got free delivery!'}</span>}</div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gradient-to-r from-[#f2a5b5] to-[#d4567a] transition-all duration-500" style={{width:`${pct}%`}}/></div>
            </div>
            <div className="space-y-4">
              {cart.map(item => <div key={item.key} className="rounded-[26px] border border-[#dedbd5] bg-white p-3.5 shadow-[0_16px_42px_rgba(17,17,17,0.055)]">
                <div className="grid grid-cols-[96px_1fr] gap-4">
                  <img src={item.image} className="h-[144px] w-[96px] rounded-[20px] bg-[#efede9] object-cover"/>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3"><h3 className="pr-1 text-[12px] font-semibold uppercase tracking-[.07em] leading-5">{productName(item, lang)}</h3><button onClick={()=>removeItem(item.key)} aria-label={isAr?'إزالة القطعة':'Remove item'} className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#e6e3de] text-[#706c67] hover:bg-[#d4567a] hover:text-white hover:border-[#1a1a1a] transition"><Trash2 size={15}/></button></div>
                    <p className="mt-2 text-[11px] leading-5 text-[#706c67]">{isAr?'اللون':'Color'}: {productColorName(item.color || item.colorName, isAr)}</p>
                    <p className="mt-3 text-[15px] font-semibold">{fmt(item.priceAed)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e8e6e1] pt-3">
                  <div className="flex h-10 w-[118px] overflow-hidden rounded-full border border-[#dedbd5] bg-[#ffffff]"><button onClick={()=>updateQty(item.key, item.qty - 1)} className="flex-1 hover:bg-[#efede9]"><Minus size={14} className="mx-auto"/></button><span className="grid flex-1 place-items-center text-sm">{item.qty}</span><button onClick={()=>updateQty(item.key, item.qty + 1)} className="flex-1 hover:bg-[#efede9]"><Plus size={14} className="mx-auto"/></button></div>
                  <p className="text-[14px] font-semibold">{fmt(item.priceAed * item.qty)}</p>
                </div>
              </div>)}
            </div>
            {bundle && !bundleInCart && <div className="mt-5 rounded-[22px] border border-dashed border-[#d4567a]/40 bg-[#fff7f9] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.18em] text-[#d4567a]">{isAr?'أضيفي لطلبك 💗':'Complete your order 💗'}</p>
              <div className="flex items-center gap-3">
                <img src={bundle.img} className="h-[60px] w-[60px] shrink-0 rounded-[14px] border border-[#f0d4dc] bg-white object-contain"/>
                <div className="min-w-0 flex-1"><p className="text-[12px] font-semibold leading-4">{productName(bundle, lang)}</p><p className="mt-1 text-[13px] font-semibold text-[#d4567a]">{fmt(bundle.priceAed)}</p></div>
                <button onClick={()=>addToCart({...bundle, image:bundle.img, priceAed:bundle.priceAed, color:bundle.colorName, qty:1})} className="shrink-0 rounded-full bg-[#d4567a] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[.1em] text-white transition hover:bg-[#b8435f]">{isAr?'أضف':'Add'}</button>
              </div>
            </div>}
          </>}
        </div>

        {cart.length > 0 && <div className="border-t border-[#dedbd5] bg-white px-5 py-5 md:px-7">
          <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-[#706c67]">{isAr?'المجموع الفرعي':'Subtotal'}</span><span>{fmt(subtotal)}</span></div><div className="flex justify-between border-t border-[#e2dfda] pt-4 text-xl font-semibold"><span>{isAr?'الإجمالي':'Total'}</span><span>{fmt(total)}</span></div></div>
          <Link to="/checkout" onClick={()=>setCartOpen(false)} className="mt-5 flex h-[54px] w-full items-center justify-center rounded-full bg-[#d4567a] text-[13px] font-semibold uppercase tracking-[.16em] text-white hover:bg-[#d4567a] transition" style={{color:'#fff'}}>{t('checkout')} · {fmt(total)}</Link>
          <button onClick={()=>setCartOpen(false)} className="mt-3 flex h-[50px] w-full items-center justify-center rounded-full border border-[#1a1a1a] bg-white text-[12px] font-semibold uppercase tracking-[.14em]">{t('continueShopping')}</button>
        </div>}
      </motion.aside>
    </>}
  </AnimatePresence>
}

function CurrencySwitcher(){
  const { currency, currencies, setCurrency } = useCurrency()
  const { isAr } = useLang()
  const [open,setOpen] = useState(false)
  const btnRef = useRef(null)
  const [pos,setPos] = useState({right:20,top:80})
  useEffect(() => {
    if(open && btnRef.current){
      const r = btnRef.current.getBoundingClientRect()
      setPos({right:window.innerWidth - r.right - 4, top:r.bottom + 8})
    }
  }, [open])
  return <div className="relative">
    <button ref={btnRef} type="button" onClick={()=>setOpen(!open)} className="desktop-nav px-3 h-9 rounded-full border border-[#dedbd5] bg-white/70 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[.08em] hover:bg-[#d4567a] hover:text-white hover:border-[#1a1a1a] transition">{isAr?currency.arSymbol:currency.code}<svg width="8" height="6" viewBox="0 0 8 6" fill="none" className={`transition ${open?'rotate-180':''}`}><path d="M1 1.5L4 4.5L7 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></button>
    {open && <>
      <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}/>
      <div className="fixed z-50 min-w-[200px] rounded-[20px] border border-[#dedbd5] bg-white p-2 shadow-[0_25px_60px_rgba(0,0,0,0.15)]" style={{right:pos.right+'px', top:pos.top+'px'}}>
        {currencies.map(c=><button key={c.code} onClick={()=>{setCurrency(c); setOpen(false)}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] ${isAr?'text-right':'text-left'} text-[12px] transition ${currency.code===c.code?'bg-[#d4567a] text-white':'hover:bg-[#efede9]'}`}><span className="min-w-[48px] text-sm font-semibold">{isAr?c.arSymbol:c.symbol}</span><span className="opacity-70">{isAr?c.arLabel:c.label}</span></button>)}
      </div>
    </>}
  </div>
}
function Footer(){
  const { t, isAr } = useLang()
  const shop=isAr?['وصل حديثاً','نكهات قابلة للأكل','لانجري مميز','العناية بالجسم','جميع المنتجات']:['New Arrivals','Edible Flavors','Novelty Lingerie','Body Care','All Products'];
  const quick=isAr?['عن لمسة','تواصل','التوصيل والاسترجاع','الخصوصية','الشروط','العروض']:['About','Contact','Delivery & Returns','Privacy','Terms','Offers'];
  return <footer className="footer-bg mt-16 md:mt-20">
    <div className="mx-auto max-w-[1440px] md:px-8 md:py-10">
      <div className="overflow-hidden border-y border-[#f0d4dc] bg-[#fff0f3] text-[#6b545a] shadow-[0_28px_80px_rgba(212,86,122,0.12)] md:rounded-[34px] md:border">
        <div className="px-6 py-12 md:px-10 md:py-12 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr_1.1fr] lg:gap-14">
            <div className={isAr?'text-right':'text-left'}>
              <div className="mb-5 flex justify-start"><BrandLogo /></div>
              <p className="max-w-[340px] text-[14px] leading-7 text-[#6b545a]">{isAr?'ذوق يلامس الإحساس 💗 توصيل الإمارات خلال 24 ساعة والخليج خلال 3-4 أيام.':'Taste that touches the senses 💗 UAE delivery within 24 hours, Gulf within 3-4 days.'}</p>
              <div className="mt-6 flex flex-wrap gap-3"><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex h-11 items-center gap-2 rounded-full border border-[#f0d4dc] bg-white px-5 text-[13px] text-[#b8435f] transition hover:bg-[#d4567a] hover:text-white"><InstagramIcon className="h-4 w-4"/> {isAr?'إنستغرام':'Instagram'}</a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex h-11 items-center gap-2 rounded-full border border-[#f0d4dc] bg-white px-5 text-[13px] text-[#b8435f] transition hover:bg-[#d4567a] hover:text-white"><WhatsAppIcon className="h-4 w-4"/> {isAr?'واتساب':'WhatsApp'}</a></div>
            </div>
            <div className="grid grid-cols-2 gap-8 border-t border-[#f0d4dc] pt-8 text-[13px] text-[#6b545a] lg:border-t-0 lg:pt-0">
              <div><h4 className="mb-5 text-[12px] font-semibold text-[#b8435f]">{isAr?'تسوقي':'Shop'}</h4><div className="grid gap-3">{shop.map(x=><Link key={x} to="/" className="transition hover:text-[#d4567a]">{x}</Link>)}</div></div>
              <div><h4 className="mb-5 text-[12px] font-semibold text-[#b8435f]">{isAr?'الدعم':'Support'}</h4><div className="grid gap-3">{quick.map(x=><Link key={x} to="/" className="transition hover:text-[#d4567a]">{x}</Link>)}</div></div>
            </div>
            <div className="border-t border-[#f0d4dc] pt-8 lg:border-t-0 lg:pt-0">
              <h4 className="text-[16px] font-medium text-[#b8435f]">{isAr?'كوني أول من يعرف':'Be first to know'}</h4>
              <p className="mt-2 max-w-sm text-[12px] leading-6 text-[#6b545a]">{isAr?'وصل حديثاً وعروض لمسة، مباشرة إلى بريدك.':'New arrivals and Lamssa offers, sent directly to your inbox.'}</p>
              <div className="mt-5 flex h-12 max-w-md overflow-hidden rounded-full border border-[#f0d4dc] bg-white focus-within:border-[#d4567a]"><input className="min-w-0 flex-1 bg-transparent px-5 text-[12px] text-[#3d2b30] outline-none placeholder:text-[#b89ba2]" placeholder={isAr?'بريدك الإلكتروني':'Your email'}/><button className="shrink-0 bg-[#d4567a] px-6 text-[11px] font-semibold text-white transition hover:bg-[#b8435f]">{isAr?'انضمي':'Join'}</button></div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-[#f0d4dc] pt-6 text-[11px] text-[#8c6b74] md:flex-row md:items-center md:justify-between"><span>{t('footerLang')} ⌄</span><span>{isAr?'© ٢٠٢٦ لمسة':'© 2026 LAMSSA'}</span><span>{isAr?'أبل باي، تابي، تمارا، الدفع عند الاستلام':'Apple Pay, Tabby, Tamara, COD'}</span></div>
        </div>
      </div>
    </div>
  </footer>
}
function ProductCard({p, i=0}){
  const { t, lang, isAr } = useLang()
  const { fmt } = useCurrency()
  return <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:i*0.06,ease:'easeOut'}} className="product-card text-center relative group"><div className="relative"><Link to={`/product/${p.id}`} className="block relative bg-white overflow-hidden aspect-square rounded-[20px] border border-[#f0d4dc]">{p.badge && <span className="absolute left-3 top-3 z-10 rounded-full bg-[#d4567a] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.06em] text-white shadow-sm">{isAr?p.badge.ar:p.badge.en}</span>}<img src={p.img} className="absolute inset-0 w-3/4 h-3/4 m-auto object-contain transition duration-300"/><img src={p.hover} className="hover-img absolute inset-0 w-3/4 h-3/4 m-auto object-contain transition duration-300"/></Link></div><h3 className="mt-5 mb-2 text-[13px] tracking-[.045em] font-medium uppercase leading-5"><Link to={`/product/${p.id}`}>{productName(p, lang)}</Link></h3><p className="text-[11px] uppercase text-[#666]">{t('salePrice')}</p><p className="text-[13px] font-medium flex items-center justify-center gap-2">{p.compareAtAed && <span className="text-[#b89ba2] line-through font-normal">{fmt(p.compareAtAed)}</span>}<span className={p.compareAtAed?'text-[#d4567a] font-semibold':''}>{fmt(p.priceAed)}</span></p></motion.div>
}
function ProductGrid({title, list=products, actionPath}){ const { t, lang } = useLang(); return <section className="border-t border-[#f0d4dc] py-20"><div className="container-basic"><h2 className="section-title mb-14">{collectionText(title, lang)}</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8">{list.map((p,i)=><ProductCard p={p} key={p.id} i={i}/>)}</div>{actionPath && <div className="text-center mt-14"><Link to={actionPath} className="btn btn-black">{t('viewAll')}</Link></div>}</div></section> }
const collectionPages = {
  'new-arrivals': { title:'LAMSSA New Arrivals', eyebrow:'Latest products', desc:'Explore the complete Lamssa product selection.', arEyebrow:'وصل حديثاً', arDesc:'اكتشف تشكيلة لمسة الحالية.', list:products },
  'edible-bikini': { title:'Edible Bikini', eyebrow:'Edible flavors', desc:'Sweet edible candy bikinis in six delicious flavors, for married couples.', arEyebrow:'بكيني قابل للأكل', arDesc:'بكيني حلوى قابل للأكل بست نكهات لذيذة، للمتزوجين.', list:products.filter(p => p.id.startsWith('edible-bikini')) },
  'body-care': { title:'Body Care', eyebrow:'Intimate care', desc:'Premium care products for sensitive areas.', arEyebrow:'العناية بالجسم', arDesc:'منتجات عناية فاخرة للمناطق الحساسة.', list:products.filter(p => p.id.includes('care')) },
}
const collectionSlug = (name) => name.toLowerCase().replaceAll(' ','-')
function Home(){
  const { t, lang, isAr } = useLang()
  const { fmt } = useCurrency()
  const storyDetails = isAr ? [
    ['الإمارات','شحن من الإمارات لجميع دول الخليج.'],
    ['الجودة','منتجات حميمية فاخرة للمتزوجين.'],
    ['التوصيل','توصيل الإمارات خلال ٢٤ ساعة والخليج ٣-٤ أيام.'],
  ] : [
    ['UAE','Ships from UAE to all Gulf countries.'],
    ['Quality','Premium intimate products for married couples.'],
    ['Delivery','UAE 24h delivery, Gulf 3-4 days.'],
  ]
  return <main className="w-full max-w-full overflow-x-hidden bg-[#ffffff] text-[#181818]">
    <section className="relative min-h-[680px] overflow-hidden bg-[#d4567a] text-[#f6f2e8] sm:min-h-[720px] md:min-h-[760px]">
      <img src={assets.hero} alt={isAr?'منتجات لمسة':'Lamssa products'} className="absolute inset-0 h-full w-full object-cover object-[50%_center] md:object-[center_18%]"/>
      <div className="absolute inset-0 bg-[#090909]/10"/>
      <div className="absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-[#101010]/95 via-[#181818]/58 to-transparent md:hidden"/>
      <div className={`absolute inset-0 hidden md:block ${isAr?'bg-gradient-to-l from-[#101010]/92 via-[#181818]/48 to-transparent':'bg-gradient-to-r from-[#101010]/92 via-[#181818]/48 to-transparent'}`}/>
      <div className="container-basic relative z-10 flex min-h-[680px] items-end sm:min-h-[720px] md:min-h-[760px] md:items-center">
        <div className={`w-full max-w-2xl pb-16 pt-20 text-left md:py-24 ${isAr?'md:ml-auto':'md:mr-auto'}`}>
          <p className="mb-4 text-[10px] font-semibold tracking-[.18em] text-[#d8e2dc] md:mb-6 md:text-[11px]">{isAr?'لمسة':'LAMSSA'}</p>
          <h1 className={`font-display font-medium text-white drop-shadow-[0_8px_30px_rgba(0,0,0,.18)] ${isAr?'max-w-[9ch] text-[50px] leading-[1.08] tracking-normal md:text-[82px] lg:text-[92px]':'max-w-[8ch] text-[58px] leading-[.92] tracking-[-.03em] md:text-[82px] lg:text-[96px]'}`}>{isAr?'ذوق يلامس الإحساس':'Taste That Touches The Senses'}</h1>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/20"/>
    </section>

    <section id="collections" className="py-16 md:py-24">
      <div className="container-basic">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="font-display text-[36px] font-medium leading-none md:text-[52px]">{isAr?'تسوق حسب الفئة':'Shop by category'}</h2>
          <p className="mt-4 mx-auto max-w-lg text-sm leading-7 text-[#6f6b66]">{isAr?'منتجات مميزة للمتزوجين بتوصيل سريع للإمارات والخليج.':'Premium products for married couples with fast UAE & Gulf delivery.'}</p>
        </div>
        <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 justify-start md:justify-center snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{collections.map(([name,src])=><Link key={name} to={`/collection/${collectionSlug(name)}`} className="group flex shrink-0 snap-center flex-col items-center gap-3.5"><div className="relative h-[130px] w-[130px] md:h-[168px] md:w-[168px] overflow-hidden rounded-full border-[3px] border-[#f0d4dc] bg-white p-2 shadow-[0_12px_30px_rgba(212,86,122,0.12)] transition group-hover:border-[#d4567a] group-hover:shadow-[0_16px_40px_rgba(212,86,122,0.22)]"><img src={src} alt={collectionText(name, lang)} className="h-full w-full rounded-full object-cover transition duration-500 group-hover:scale-[1.06]"/></div><span className="text-[13px] md:text-[15px] font-semibold uppercase tracking-[.08em] text-[#3d2b30] group-hover:text-[#d4567a]">{collectionText(name, lang)}</span></Link>)}</div>
      </div>
    </section>

    <ProductGrid title={isAr?'منتجاتنا':'Our products'} list={products} />

    <section className="overflow-hidden bg-[#fff0f3] text-[#3d2b30]">
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/5] min-h-[440px] w-full overflow-hidden lg:aspect-auto lg:min-h-[720px]"><img src={assets.brandPackaging} alt={isAr?'منتجات لمسة':'Lamssa products'} className="absolute inset-0 h-full w-full object-cover"/></div>
        <div className="flex items-center px-[18px] py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 xl:px-24">
          <div className="w-full max-w-[680px]">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[.3em] text-[#d4567a]">{isAr?'لمسة':'LAMSSA'}</p>
          <h2 className="max-w-[12ch] font-display text-[48px] font-medium leading-[.94] md:text-[68px] text-[#b8435f]">{isAr?'للمتزوجين فقط':'For married couples only'}</h2>
          <p className={`mt-7 max-w-[280px] text-sm leading-8 text-[#6b545a] md:max-w-xl ${isAr?'ml-auto md:ml-0':'mr-auto'}`}>{isAr?'منتجات حميمية مختارة بعناية لإضافة لمسة مميزة لحياتكم.':'Carefully curated intimate products to add a special touch to your life together.'}</p>
          <div className="mt-10 grid gap-7 border-t border-[#f0d4dc] pt-8 sm:grid-cols-3 sm:gap-5">{storyDetails.map(([title,body])=><div key={title}><h3 className="font-display text-2xl text-[#b8435f]">{title}</h3><p className="mt-2 text-xs leading-6 text-[#6b545a]">{body}</p></div>)}</div>
          </div>
        </div>
      </div>
    </section>
    <CustomerMoments/>
  </main>
}
function CollectionPage(){ const { slug } = useParams(); const { lang, isAr, t } = useLang(); const collection = collectionPages[slug] || collectionPages['new-arrivals']; return <main className="bg-[#ffffff]"><section className="border-b border-[#dedbd5] py-14 md:py-20"><div className="container-basic text-center"><div className="mb-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[.18em] text-[#706c67]"><Link to="/" className="hover:text-[#181818]">{t('home')}</Link><span>/</span><span className="text-[#181818]">{collectionText(collection.title, lang)}</span></div><p className="mb-4 text-[11px] uppercase tracking-[.28em] text-[#55514d]">{isAr?collection.arEyebrow:collection.eyebrow}</p><h1 className="text-[30px] md:text-[48px] font-medium uppercase tracking-[.1em]">{collectionText(collection.title, lang)}</h1><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#706c67]">{isAr?collection.arDesc:collection.desc}</p></div></section><ProductGrid title={`${collection.list.length} ${t('pieces')}`} list={collection.list}/></main> }
const CUSTOMER_REVIEWS = [
  { name:'أم راشد', city:'دبي', stars:5, text:'والله شي يجنن 😍 وصلني بسرعة نفس اليوم وكله ديسكريت بالتوصيل، ما أحد درى شو الطلب. بطلب باقي النكهات!' },
  { name:'موزة', city:'أبوظبي', stars:5, text:'خذيته هدية لزوجي وصراحة كسر الروتين 🔥 الجودة حلوة والريحة طيبة. أنصح فيه بقوة حبيباتي.' },
  { name:'Shaikha', city:'Sharjah', stars:5, text:'Ordered before 9pm and got it next day 🙌 super discreet packaging, exactly like the pics. 10/10 will reorder.' },
  { name:'أم خليفة', city:'العين', stars:5, text:'بصراحة كنت مترددة بس طلعت أحلى من توقعي 💕 التوصيل سريع والتعامل رهيب عبر الواتساب.' },
  { name:'Noora', city:'Dubai', stars:5, text:'The strawberry one is the best 🍓 fast delivery and no one knew what was inside. Highly recommend for couples!' },
  { name:'حصة', city:'رأس الخيمة', stars:5, text:'شي وايد حلو وسعره مناسب 😋 وصل بيومين للرأس، والتغليف محترم ومحد يعرف شو فيه. مشكورين لمسة.' },
  { name:'أم سلطان', city:'عجمان', stars:5, text:'زوجي انبسط وايد 😂❤️ الطلب سهل والدفع عند الاستلام ريحني. بطلب النكهة الجديدة أكيد.' },
  { name:'Latifa', city:'Abu Dhabi', stars:5, text:'جربت الشوكولاته وايد لذيذة 🍫 خدمة راقية وردهم سريع عالواتساب. تسلم إيدكم.' },
]
function Stars({ n=5 }){
  return <div className="flex gap-0.5 text-[#f4b400]">{Array.from({length:5}).map((_,i)=><svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill={i<n?'currentColor':'#e8ddd0'}><path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.8 1-5.8L1.5 7.7l5.9-.9z"/></svg>)}</div>
}
function CustomerMoments(){
  const { isAr } = useLang()
  const marqueeRef = useRef(null)
  const trackRef = useRef(null)
  useEffect(()=>{
    const viewport = marqueeRef.current
    const track = trackRef.current
    if(!viewport || !track) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame
    let lastFrame = performance.now()
    let lastInteraction = -Infinity
    let autoPosition = 0
    let autoActive = true
    let drag = null

    const noteInteraction = ()=>{
      lastInteraction = performance.now()
      autoPosition = viewport.scrollLeft
      autoActive = false
    }
    const onPointerDown = event=>{
      noteInteraction()
      if(event.pointerType!=='mouse' || event.button!==0) return
      drag = { id:event.pointerId, x:event.clientX, left:viewport.scrollLeft }
      viewport.setPointerCapture(event.pointerId)
      viewport.style.cursor = 'grabbing'
      viewport.style.userSelect = 'none'
    }
    const onPointerMove = event=>{
      if(!drag || drag.id!==event.pointerId){
        if(event.pointerType!=='mouse' && event.buttons) noteInteraction()
        return
      }
      noteInteraction()
      viewport.scrollLeft = drag.left - (event.clientX-drag.x)
      event.preventDefault()
    }
    const endDrag = event=>{
      noteInteraction()
      if(!drag || drag.id!==event.pointerId) return
      drag = null
      viewport.style.cursor = ''
      viewport.style.userSelect = ''
    }
    const onIntent = ()=>noteInteraction()
    const groupWidth = ()=>track.scrollWidth/2
    if(isAr) viewport.scrollLeft = groupWidth()
    autoPosition = viewport.scrollLeft
    const move = now=>{
      const elapsed = Math.min(now-lastFrame,50)
      lastFrame = now
      const width = groupWidth()
      const bounds = viewport.getBoundingClientRect()
      const visible = bounds.bottom>0 && bounds.top<window.innerHeight
      if(!reduceMotion && visible && now-lastInteraction>1800 && width>0){
        if(!autoActive){
          autoPosition = viewport.scrollLeft
          autoActive = true
        }
        autoPosition += (isAr?-1:1)*elapsed*.06
        while(autoPosition>=width) autoPosition-=width
        while(autoPosition<0) autoPosition+=width
        viewport.scrollLeft = autoPosition
      }
      animationFrame = requestAnimationFrame(move)
    }

    viewport.addEventListener('pointerdown',onPointerDown)
    viewport.addEventListener('pointermove',onPointerMove)
    viewport.addEventListener('pointerup',endDrag)
    viewport.addEventListener('pointercancel',endDrag)
    viewport.addEventListener('wheel',onIntent,{passive:true})
    viewport.addEventListener('touchstart',onIntent,{passive:true})
    viewport.addEventListener('keydown',onIntent)
    animationFrame = requestAnimationFrame(move)
    return ()=>{
      cancelAnimationFrame(animationFrame)
      viewport.removeEventListener('pointerdown',onPointerDown)
      viewport.removeEventListener('pointermove',onPointerMove)
      viewport.removeEventListener('pointerup',endDrag)
      viewport.removeEventListener('pointercancel',endDrag)
      viewport.removeEventListener('wheel',onIntent)
      viewport.removeEventListener('touchstart',onIntent)
      viewport.removeEventListener('keydown',onIntent)
    }
  },[isAr])
  const group = (duplicate=false) => <div aria-hidden={duplicate || undefined} className="flex shrink-0 gap-5 pr-5">{CUSTOMER_REVIEWS.map((review,index)=><article key={`${review.name}-${index}`} dir="rtl" className="flex w-[280px] shrink-0 flex-col justify-between rounded-[28px] border border-[#f0d4dc] bg-white p-6 shadow-[0_16px_40px_rgba(212,86,122,0.06)] md:w-[320px]">
    <div>
      <div className="mb-4 flex items-center justify-between"><Stars n={review.stars}/><span className="text-[20px]">💗</span></div>
      <p className="text-[15px] leading-8 text-[#3d2b30]">{review.text}</p>
    </div>
    <div className="mt-6 flex items-center gap-3 border-t border-[#f7e3e9] pt-4">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f3] text-[15px] font-semibold text-[#d4567a]">{review.name.charAt(0)}</div>
      <div><p className="text-[13px] font-semibold text-[#181818]">{review.name}</p><p className="text-[11px] text-[#8c6b74]">{review.city}</p></div>
      <span className="mr-auto rounded-full bg-[#e9f9ee] px-2.5 py-1 text-[9px] font-semibold text-[#1a9e4b]">{isAr?'موثّق ✓':'Verified ✓'}</span>
    </div>
  </article>)}</div>
  return <section className="overflow-hidden border-t border-[#f0d4dc] bg-[#fff7f9] py-20 md:py-28">
    <div className="mb-10 text-center md:mb-14"><div className="container-basic"><h2 className="font-display text-[40px] font-medium leading-[1.12] text-[#181818] md:text-[58px]">{isAr?'وش يقولون عملائنا':'What our customers say'}</h2><p className="mx-auto mt-4 max-w-xl text-[14px] leading-7 text-[#5f5b57] md:text-[15px]">{isAr?'تقييمات حقيقية من عملاء لمسة في الإمارات والخليج 💗':'Real reviews from Lamssa customers across the UAE & Gulf 💗'}</p></div></div>
    <div ref={marqueeRef} className="customer-marquee-mask" tabIndex="0" aria-label={isAr?'اسحب لاستعراض التقييمات':'Drag or swipe to browse customer reviews'}><div ref={trackRef} className="customer-marquee-track flex w-max">{group()}{group(true)}</div></div>
  </section>
}

const PRODUCT_COLORS = [
  { name:'Pink', hex:'#f2a5b5', ar:'وردي' },
  { name:'Red', hex:'#d94f5c', ar:'أحمر' },
  { name:'Black', hex:'#1a1a1a', ar:'أسود' },
  { name:'Brown', hex:'#8b5e3c', ar:'بني' },
  { name:'White', hex:'#f7f7f2', ar:'أبيض' },
]
const productColorName = (color='Black', isAr=false) => {
  const option = PRODUCT_COLORS.find(item => item.name.toLowerCase() === String(color).toLowerCase())
  return isAr ? (option?.ar || 'اللون المحدد') : (option?.name || color)
}
function ProductPage(){
  const { id } = useParams()
  const product = products.find(p => p.id === id) || products[0]
  const gallery = product.gallery?.length ? product.gallery : (product.id === products[0].id ? blackProductGallery : [product.img, product.hover])
  const [main,setMain]=useState(gallery[0])
  const [qty,setQty]=useState(1)
  const [selectedFlavor,setSelectedFlavor]=useState(FLAVORS[0])
  const { addToCart } = useCart()
  const { t, lang, isAr } = useLang()
  const { fmt } = useCurrency()
  const pname = productName(product, lang)
  const galleryRef = useRef(null)
  const firstGalleryImage = gallery[0]
  useEffect(()=>{
    const frame = requestAnimationFrame(() => {
      setMain(firstGalleryImage)
      setSelectedFlavor(FLAVORS[0])
      galleryRef.current?.scrollTo({left:0})
    })
    return () => cancelAnimationFrame(frame)
  }, [product.id, firstGalleryImage])
  useEffect(()=>{ trackEvent('ViewContent', { value: product.priceAed, currency:'AED', contents:[{ id: product.id, quantity:1, price: product.priceAed }] }) }, [product.id, product.priceAed])
  const linePrice = product.priceAed
  const optionLabel = 'mb-3 block text-[11px] font-semibold uppercase tracking-[.18em] text-[#6f6b66]'
  const addLine = () => addToCart({...product, image:product.img, priceAed:linePrice, color:product.colorName, qty})
  // Smart cross-sell: on a single flavor → offer the All-6 bundle; on bundle/care → offer the other one.
  const bundleProduct = products.find(p => p.id === 'edible-bikini-bundle')
  const careProduct = products.find(p => p.id === 'femininity-care-package')
  const isSingleFlavor = product.id.startsWith('edible-bikini-') && product.id !== 'edible-bikini-bundle'
  const crossSell = isSingleFlavor ? bundleProduct : (product.id === 'edible-bikini-bundle' ? careProduct : bundleProduct)
  const pairTotal = crossSell ? linePrice + crossSell.priceAed : 0
  const addBoth = () => { addLine(); if(crossSell) addToCart({...crossSell, image:crossSell.img, priceAed:crossSell.priceAed, color:crossSell.colorName, qty:1}) }
  const goToImage = (src, index) => {
    setMain(src)
    const carousel = galleryRef.current
    carousel?.scrollTo({left:carousel.clientWidth * index, behavior:'smooth'})
  }
  const handleGalleryScroll = () => {
    const carousel = galleryRef.current
    if (!carousel?.clientWidth) return
    const index = Math.min(gallery.length - 1, Math.max(0, Math.round(carousel.scrollLeft / carousel.clientWidth)))
    if (gallery[index] && gallery[index] !== main) setMain(gallery[index])
  }
  const thumbs = gallery.map((src,index)=><button type="button" aria-label={isAr?`عرض الصورة ${index + 1} من ${gallery.length}`:`View image ${index + 1} of ${gallery.length}`} onClick={()=>goToImage(src,index)} key={src} className={`shrink-0 overflow-hidden rounded-[18px] border bg-white p-1 transition ${main===src?'border-[#1a1a1a] shadow-[0_12px_30px_rgba(0,0,0,0.12)]':'border-[#e2dfda] hover:border-[#55514d]'}`}><img src={src} className="h-[92px] w-[64px] md:h-[116px] md:w-[78px] rounded-[14px] object-cover"/></button>)

  return <main className="bg-[#ffffff]">
    <section className="container-basic py-2 md:py-10">
      <div className="mb-3 md:mb-6 text-[11px] uppercase tracking-[.16em] text-[#706c67]"><Link to="/" className="hover:text-[#181818] transition">{t('home')}</Link><span className="mx-2.5 text-[#bfb7ae]">/</span><span>{t('abayas')}</span></div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,.92fr)] lg:gap-12 xl:gap-16">
        <div className="min-w-0">
          <div className="relative overflow-hidden md:rounded-[28px]">
            <div className="absolute left-4 top-4 z-10 flex gap-2"><span className="rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.18em] shadow-sm">{isAr?'لمسة':'LAMSSA'}</span><span className="rounded-full bg-[#d4567a] px-4 py-2 text-[10px] font-semibold uppercase tracking-[.18em] text-white shadow-sm">{t('new')}</span></div>
            <button aria-label={isAr?'أضيفي إلى المفضلة':'Add to wishlist'} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-sm"><Heart size={19}/></button>
            <div className="relative md:hidden">
              <div ref={galleryRef} data-gallery-carousel onScroll={handleGalleryScroll} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {gallery.map((src,index)=><div key={src} className="w-full shrink-0 snap-center snap-always"><img src={src} alt={`${pname} - ${index + 1}`} draggable="false" className="w-full aspect-square select-none object-contain bg-white"/></div>)}
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {gallery.map((src,index)=><button type="button" aria-label={isAr?`عرض الصورة ${index + 1} من ${gallery.length}`:`View image ${index + 1} of ${gallery.length}`} aria-current={main===src?'true':undefined} key={src} onClick={()=>goToImage(src,index)} className={`h-2 w-2 rounded-full transition ${main===src?'bg-[#d4567a]':'bg-[#d4567a]/20'}`}/>)}
              </div>
            </div>
            <img src={main} className="hidden w-full rounded-[28px] md:block md:aspect-square md:object-contain bg-white"/>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto overscroll-x-contain pb-2 max-w-full md:mt-5">{thumbs}</div>
        </div>
        <aside className="min-w-0 lg:sticky lg:top-6 self-start">
          <div className="rounded-[34px] border border-[#dedbd5] bg-white p-5 md:p-7 shadow-[0_28px_80px_rgba(17,17,17,0.075)]">
            <div className="mb-5 flex items-start justify-between gap-4"><div><p className="mb-3 text-[11px] uppercase tracking-[.26em] text-[#55514d]">{t('premiumAbaya')}</p><h2 className="text-[22px] md:text-[28px] leading-[1.18] tracking-[.055em] uppercase font-medium">{pname}</h2></div><button className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#dedbd5]"><Share2 size={18}/></button></div>
            <div className="mb-6 flex flex-wrap items-center gap-3"><BadgeCheck size={17} className="text-[#55514d]"/><span className="text-xs text-[#706c67]">{t('uaecustomers')}</span><span className="rounded-full bg-[#efede9] px-3 py-1 text-[11px] text-[#66635f]">{t('inStock')}</span></div>
            <div className="mb-5 border-y border-[#dedbd5] py-4">
              <div className="flex items-end justify-between gap-4">
                <div><p className="text-[10px] uppercase tracking-[.18em] text-[#706c67]">{t('price')}</p><p className="mt-1 whitespace-nowrap text-[26px] font-semibold tracking-wide">{fmt(linePrice)}</p></div>
              </div>
              <p className="mt-3 border-t border-[#e6e3de] pt-3 text-[11px] leading-5 text-[#6f6b66]">{t('paymentLine')}</p>
            </div>

            <div className="space-y-6">
              {product.hasFlavors && <div>
                <span className={optionLabel}>{isAr?'النكهة':'Flavor'}: <b className="text-[#181818]">{isAr ? selectedFlavor.arName : selectedFlavor.name}</b></span>
                <div className="flex flex-wrap gap-2.5">{FLAVORS.map(flavor=><button key={flavor.id} type="button" onClick={()=>{setSelectedFlavor(flavor); const idx = FLAVORS.findIndex(f=>f.id===flavor.id); goToImage(flavor.img, idx)}} aria-label={isAr?flavor.arName:flavor.name} className={`h-11 w-11 rounded-full border-2 transition ${selectedFlavor.id===flavor.id?'border-[#181818] ring-2 ring-[#181818] ring-offset-2':'border-[#e8e6e1] hover:border-[#999]'}`} style={{backgroundColor:flavor.hex}} />)}</div>
              </div>}
              <p className="text-sm leading-7 text-[#5f5b57]">{productDesc(product, lang)}</p>
            </div>

            <div className="mt-6 rounded-[16px] bg-gradient-to-r from-[#fff0f3] to-[#fdf7f8] border border-[#f0d4dc] p-3.5 flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d4567a]/10"><Truck size={16} className="text-[#d4567a]"/></div>
              <p className="text-[12.5px] leading-5 text-[#3d2b30]">{isAr?<>اطلب خلال <b className="text-[#d4567a]">{(() => { const now = new Date(); const cutoff = new Date(); cutoff.setHours(21,0,0,0); const diff = cutoff - now; if(diff <= 0) return 'الآن'; const h = Math.floor(diff/3600000); const m = Math.floor((diff%3600000)/60000); return `${h} ساعة و ${m} دقيقة`; })()}</b> لتوصيل بكرة</>:<>Order within <b className="text-[#d4567a]">{(() => { const now = new Date(); const cutoff = new Date(); cutoff.setHours(21,0,0,0); const diff = cutoff - now; if(diff <= 0) return 'now'; const h = Math.floor(diff/3600000); const m = Math.floor((diff%3600000)/60000); return `${h}h ${m}m`; })()}</b> to receive tomorrow</>}</p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[124px_1fr]"><div className="flex h-[52px] overflow-hidden rounded-full border border-[#dedbd5]"><button onClick={()=>setQty(Math.max(1,qty-1))} className="flex-1"><Minus size={15} className="mx-auto"/></button><span className="grid flex-1 place-items-center text-sm">{qty}</span><button onClick={()=>setQty(qty+1)} className="flex-1"><Plus size={15} className="mx-auto"/></button></div><button onClick={addLine} className="h-[52px] rounded-full bg-[#d4567a] px-6 text-[13px] font-semibold uppercase tracking-[.14em] text-white">{t('addToCart')} · {fmt(linePrice * qty)}</button></div>
            <Link to="/checkout" onClick={addLine} className="mt-3 flex h-[52px] items-center justify-center rounded-full border border-[#1a1a1a] bg-white text-[13px] font-semibold uppercase tracking-[.14em]">{t('buyNow')}</Link>
            {crossSell && <div className="mt-6 rounded-[20px] border border-[#f0d4dc] bg-[#fff7f9] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.18em] text-[#d4567a]">{isAr?'يُشترى معه عادةً 💗':'Frequently bought together 💗'}</p>
              <div className="flex items-center gap-2">
                <div className="grid h-[64px] w-[64px] shrink-0 place-items-center rounded-[14px] border border-[#f0d4dc] bg-white"><img src={product.img} className="h-[52px] w-[52px] object-contain"/></div>
                <Plus size={16} className="shrink-0 text-[#b89ba2]"/>
                <Link to={`/product/${crossSell.id}`} className="grid h-[64px] w-[64px] shrink-0 place-items-center rounded-[14px] border border-[#f0d4dc] bg-white"><img src={crossSell.img} className="h-[52px] w-[52px] object-contain"/></Link>
                <div className="min-w-0 flex-1 ps-1"><p className="text-[11px] leading-4 text-[#6b545a]">{isAr?'أضف':'Add'} <Link to={`/product/${crossSell.id}`} className="font-semibold text-[#3d2b30] underline decoration-[#f0d4dc]">{productName(crossSell, lang)}</Link></p><p className="mt-1 text-[13px] font-semibold text-[#181818]">{isAr?'المجموع':'Total'}: {fmt(pairTotal)}</p></div>
              </div>
              <button onClick={addBoth} className="mt-3 flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#d4567a] text-[12px] font-semibold uppercase tracking-[.12em] text-white transition hover:bg-[#b8435f]"><Plus size={15}/> {isAr?'أضف الاثنين للسلة':'Add both to cart'}</button>
            </div>}
          </div>
        </aside>
      </div>
    </section>
    <section className="container-basic pb-5 md:pb-8">
      <Accordions product={product}/>
    </section>
    <ProductGrid title={t('relatedProducts')} list={products.filter(p => p.id !== product.id).slice(0,4)} />
  </main>
}

function Accordions({ product }){
  const { lang, isAr } = useLang()
  const rows=isAr?[
    ['الوصف', productDesc(product, lang)],
    ['الطلب','تواصلي معنا عبر واتساب لتأكيد تفاصيل الطلب والتوصيل.'],
    ['لمسة','متجر إلكتروني مرخص في الإمارات متخصص بمنتجات المتزوجين.']
  ]:[
    ['Description', product.desc],
    ['Ordering','Contact us on WhatsApp to confirm order and delivery details.'],
    ['Lamssa','A licensed UAE-based online store specializing in intimate products for married couples.']
  ]
  return <div className="mt-8 rounded-[28px] border border-[#dedbd5] bg-white/80 p-2 shadow-[0_18px_50px_rgba(17,17,17,0.045)]">{rows.map(([title,body],i)=><details key={title} className="group border-[#e8e6e1] open:bg-[#ffffff] rounded-[22px]" open={i===0}><summary className="flex cursor-pointer list-none items-center justify-between px-5 py-5 text-[12px] font-semibold uppercase tracking-[.16em]">{title}<Plus size={18} className="transition group-open:rotate-45"/></summary><p className="px-5 pb-5 text-sm leading-7 text-[#5f554c]">{body}</p></details>)}</div>
}
const PAYMENT_ASSET_BASE = '/images/lamssa/payment-methods'
function PaymentMethodMark({ id, isAr }){
  const alt = {
    visa:isAr?'فيزا':'Visa', mastercard:isAr?'ماستركارد':'Mastercard', applePay:isAr?'أبل باي':'Apple Pay',
    tabby:isAr?'تابي':'Tabby', tamara:isAr?'تمارا':'Tamara',
  }
  if(id==='card') return <div className="flex h-8 items-center gap-1.5 rounded-[10px] bg-white px-2.5"><img src={`${PAYMENT_ASSET_BASE}/visa.svg`} alt={alt.visa} className="h-[13px] w-auto"/><img src={`${PAYMENT_ASSET_BASE}/mastercard.svg`} alt={alt.mastercard} className="h-[15px] w-auto"/><img src={`${PAYMENT_ASSET_BASE}/apple-pay.svg`} alt={alt.applePay} className="h-[16px] w-auto"/></div>
  if(id==='tabby') return <div className="grid h-8 min-w-[64px] place-items-center rounded-[10px] bg-white px-2"><img src={`${PAYMENT_ASSET_BASE}/tabby.svg`} alt={alt.tabby} className="h-[21px] w-auto"/></div>
  if(id==='tamara') return <div className="grid h-8 min-w-[78px] place-items-center rounded-[10px] bg-white px-2"><img src={`${PAYMENT_ASSET_BASE}/tamara.svg`} alt={alt.tamara} className="h-[15px] w-auto"/></div>
  return <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-white text-[#1a1a1a]"><Banknote size={18} strokeWidth={1.6}/></div>
}

function Checkout(){
  const { cart, subtotal, total, clearCart } = useCart()
  const { lang, isAr, t } = useLang()
  const { fmt } = useCurrency()
  const [payment,setPayment]=useState('cod')
  const [done,setDone]=useState(null)
  const [form,setForm]=useState({ name:'', phone:'', country:isAr?'الإمارات العربية المتحدة':'United Arab Emirates', emirate:isAr?'دبي':'Dubai', address:'', area:'', notes:'' })
  const codFee = 0
  const grand = total + codFee
  useEffect(()=>{ if(cart.length){ trackEvent('InitiateCheckout', { value: grand, currency:'AED', contents: cart.map(i=>({ id:i.id, quantity:i.qty, price:i.priceAed })) }) } }, [])
  const set = (k) => (e) => setForm(f => ({...f, [k]:e.target.value}))
  const field = 'h-[54px] w-full rounded-[16px] border border-[#f0d4dc] bg-white/85 px-4 text-[13px] outline-none transition focus:border-[#d4567a] focus:ring-4 focus:ring-[#fbe4ea] placeholder:text-[#b89ba2]'
  const label = 'mb-2 block text-[10px] font-semibold uppercase tracking-[.18em] text-[#8c6b74]'
  const card = 'rounded-[28px] border border-[#f0d4dc] bg-[#ffffff] p-5 md:p-7 shadow-[0_20px_55px_rgba(212,86,122,0.06)]'
  const paymentMethods = isAr ? [
    ['cod','الدفع عند الاستلام','ادفع نقداً عند وصول الطلب'],
    ['whatsapp','الدفع عبر واتساب','نؤكد الطلب والتحويل عبر واتساب'],
  ] : [
    ['cod','Cash on Delivery','Pay in cash when your order arrives'],
    ['whatsapp','Pay via WhatsApp','We confirm order and transfer on WhatsApp'],
  ]
  const countries = isAr ? ['الإمارات العربية المتحدة','السعودية','الكويت','قطر','البحرين','عُمان'] : ['United Arab Emirates','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman']
  const emirates = isAr ? ['دبي','أبوظبي','الشارقة','عجمان','رأس الخيمة','الفجيرة','أم القيوين'] : ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain']
  function buildWhatsAppMessage(ref){
    const lines = []
    lines.push(isAr?'🛍️ طلب جديد من لمسة':'🛍️ New Lamssa order')
    lines.push(`${isAr?'رقم الطلب':'Ref'}: ${ref}`)
    lines.push('')
    lines.push(isAr?'📦 المنتجات:':'📦 Products:')
    cart.forEach(item => {
      lines.push(`• ${productName(item, lang)} × ${item.qty} — ${fmt(item.priceAed * item.qty)}`)
    })
    lines.push('')
    lines.push(`${isAr?'الإجمالي':'Total'}: ${fmt(grand)}`)
    lines.push(`${isAr?'الدفع':'Payment'}: ${payment==='cod'?(isAr?'الدفع عند الاستلام':'Cash on Delivery'):(isAr?'واتساب':'WhatsApp')}`)
    lines.push('')
    lines.push(isAr?'👤 بيانات التوصيل:':'👤 Delivery details:')
    lines.push(`${isAr?'الاسم':'Name'}: ${form.name}`)
    lines.push(`${isAr?'الهاتف':'Phone'}: ${form.phone}`)
    lines.push(`${isAr?'الدولة':'Country'}: ${form.country}`)
    lines.push(`${isAr?'الإمارة/المدينة':'Emirate/City'}: ${form.emirate}`)
    lines.push(`${isAr?'العنوان':'Address'}: ${form.address}`)
    if(form.area) lines.push(`${isAr?'المنطقة/معلم':'Area/Landmark'}: ${form.area}`)
    if(form.notes) lines.push(`${isAr?'ملاحظات':'Notes'}: ${form.notes}`)
    return encodeURIComponent(lines.join('\n'))
  }
  function submit(e){
    e.preventDefault()
    const ref = `LAMSSA-${Date.now().toString().slice(-6)}`
    const msg = buildWhatsAppMessage(ref)
    const waNumber = '971567277289'
    window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank')
    trackEvent('Purchase', { value: grand, currency:'AED', contents: cart.map(i=>({ id:i.id, quantity:i.qty, price:i.priceAed })) })
    setDone({ ref, total:grand, payment })
    clearCart()
  }
  if(done) return <main className="bg-[#ffffff] py-16 md:py-24"><div className="container-basic"><div className="max-w-2xl mx-auto rounded-[34px] border border-[#f0d4dc] bg-white p-8 md:p-12 text-center shadow-[0_30px_90px_rgba(212,86,122,0.1)]"><div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#25D366] text-white"><WhatsAppIcon className="h-8 w-8"/></div><p className="mb-3 text-[11px] uppercase tracking-[.24em] text-[#8c6b74]">{isAr?'تم إرسال الطلب':'Order sent'}</p><h1 className="section-title mb-5">{isAr?'شكراً لك':'Thank you'}</h1><p className="text-lg mb-2">{isAr?'رقم الطلب':'Reference'}: <b>{done.ref}</b></p><p className="mb-7 text-[#6f6b66]">{isAr?'الإجمالي':'Total'}: <b className="text-[#181818]">{fmt(done.total)}</b></p><div className="rounded-[22px] bg-[#fff0f3] p-5 text-sm leading-7 text-[#6b545a]">{isAr?'تم فتح واتساب بتفاصيل طلبك. أرسل الرسالة لنا لتأكيد الطلب والتوصيل. إذا لم يفتح واتساب تلقائياً، تواصل معنا مباشرة.':'WhatsApp opened with your order details. Send us the message to confirm your order and delivery. If WhatsApp did not open automatically, contact us directly.'}</div><a href={`https://wa.me/971567277289`} target="_blank" rel="noreferrer" className="mt-6 inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 text-[13px] font-semibold uppercase tracking-[.14em] text-white"><WhatsAppIcon className="h-5 w-5"/> {isAr?'فتح واتساب':'Open WhatsApp'}</a><div className="mt-4"><Link to="/" className="btn btn-black">{t('continueShopping')}</Link></div></div></div></main>
  if(cart.length===0) return <main className="bg-[#ffffff] py-20 md:py-28"><div className="container-basic text-center"><div className="mx-auto max-w-lg rounded-[30px] border border-[#f0d4dc] bg-white p-10 shadow-[0_25px_70px_rgba(212,86,122,0.08)]"><ShoppingBag size={48} className="mx-auto mb-5"/><h1 className="section-title mb-5">{isAr?'السلة فارغة':'Your cart is empty'}</h1><p className="mb-7 text-sm text-[#706c67]">{isAr?'أضف منتجاً لبدء الطلب.':'Add a product to start your order.'}</p><Link to="/" className="btn btn-black">{t('shopNow')}</Link></div></div></main>
  return <main className="bg-[#ffffff] py-10 md:py-16"><div className="container-basic">
    <div className="mb-8 md:mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="mb-3 text-[11px] uppercase tracking-[.26em] text-[#8c6b74]">{isAr?'إتمام الطلب عبر واتساب':'Checkout via WhatsApp'}</p><h1 className="text-[30px] md:text-[44px] font-medium uppercase tracking-[.08em]">{t('checkout')}</h1><p className="mt-3 max-w-xl text-sm leading-7 text-[#706c67]">{isAr?'املأ بياناتك وسنكمل الطلب عبر واتساب. الدفع عند الاستلام متاح داخل الإمارات.':'Fill in your details and we complete the order on WhatsApp. Cash on delivery available in the UAE.'}</p></div></div>
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start"><div className="space-y-6">
      <section className={card}><div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[.22em] text-[#8c6b74]">{isAr?'٠١':'01'}</p><h2 className="text-lg font-semibold uppercase tracking-[.14em]">{isAr?'بيانات التوصيل':'Delivery details'}</h2></div><Truck size={24} className="text-[#d4567a]"/></div><div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><label className={label}>{isAr?'الاسم الكامل':'Full name'}</label><input required value={form.name} onChange={set('name')} placeholder={isAr?'الاسم الكامل':'Full name'} className={field}/></div><div className="md:col-span-2"><label className={label}>{isAr?'رقم الهاتف / واتساب':'Phone / WhatsApp number'}</label><input required value={form.phone} onChange={set('phone')} placeholder={isAr?'+٩٧١ ٥٠ ١٢٣ ٤٥٦٧':'+971 XX XXX XXXX'} className={field}/></div><div><label className={label}>{isAr?'الدولة':'Country'}</label><select value={form.country} onChange={set('country')} className={field}>{countries.map(x=><option key={x}>{x}</option>)}</select></div><div><label className={label}>{isAr?'الإمارة / المدينة':'Emirate / City'}</label><select value={form.emirate} onChange={set('emirate')} className={field}>{emirates.map(x=><option key={x}>{x}</option>)}</select></div><div className="md:col-span-2"><label className={label}>{isAr?'العنوان الكامل':'Full address'}</label><input required value={form.address} onChange={set('address')} placeholder={isAr?'فيلا / شقة / شارع':'Villa / Apartment / Street'} className={field}/></div><div className="md:col-span-2"><label className={label}>{isAr?'المنطقة أو أقرب معلم':'Area or landmark'}</label><input value={form.area} onChange={set('area')} placeholder={isAr?'المنطقة، المبنى، أقرب معلم':'Area, building, nearest landmark'} className={field}/></div><div className="md:col-span-2"><label className={label}>{isAr?'ملاحظات (اختياري)':'Notes (optional)'}</label><input value={form.notes} onChange={set('notes')} placeholder={isAr?'أي ملاحظات على الطلب':'Any notes for your order'} className={field}/></div></div></section>
      <section className={card}><div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[.22em] text-[#8c6b74]">{isAr?'٠٢':'02'}</p><h2 className="text-lg font-semibold uppercase tracking-[.14em]">{isAr?'طريقة الدفع':'Payment method'}</h2></div><Banknote size={24} className="text-[#d4567a]"/></div><div className="grid gap-2.5 md:grid-cols-2">{paymentMethods.map(([id,title,desc])=>{ const selected=payment===id; return <button type="button" aria-pressed={selected} onClick={()=>setPayment(id)} key={id} className={`min-h-[80px] rounded-[18px] border p-3.5 text-left transition ${selected?'border-[#d4567a] bg-[#d4567a] text-white shadow-[0_10px_28px_rgba(212,86,122,0.22)]':'border-[#f0d4dc] bg-white hover:border-[#d4567a]'}`}><div className="flex items-center gap-3"><div className="min-w-0 flex-1"><b className="text-[13px] leading-5">{title}</b><p className={`mt-1 text-[11px] leading-5 ${selected?'text-white/80':'text-[#706c67]'}`}>{desc}</p></div><span className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border ${selected?'border-white bg-white':'border-[#d4a9b5] bg-white'}`}>{selected&&<span className="h-1.5 w-1.5 rounded-full bg-[#d4567a]"/>}</span></div></button>})}</div></section>
    </div>
    <aside className="rounded-[32px] border border-[#f0d4dc] bg-white p-5 md:p-6 shadow-[0_28px_80px_rgba(212,86,122,0.08)] lg:sticky lg:top-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-semibold uppercase tracking-[.18em]">{isAr?'ملخص الطلب':'Order summary'}</h2><span className="rounded-full bg-[#fff0f3] px-3 py-1 text-[11px] text-[#b8435f]">{cart.length} {isAr?'منتج':`item${cart.length>1?'s':''}`}</span></div><div className="max-h-[360px] space-y-4 overflow-auto pr-1">{cart.map(item=><div key={item.key} className="grid grid-cols-[82px_1fr] gap-4 rounded-[22px] border border-[#f0d4dc] bg-[#ffffff] p-3"><img src={item.image} className="h-[82px] w-[82px] rounded-[16px] bg-white object-contain border border-[#f7f7f7]"/><div className="min-w-0"><p className="text-[12px] font-medium uppercase leading-5 tracking-[.05em]">{productName(item, lang)}</p><p className="mt-2 text-[11px] leading-5 text-[#706c67]">{isAr?'الكمية':'Qty'} {item.qty}</p><p className="mt-3 font-semibold">{fmt(item.priceAed * item.qty)}</p></div></div>)}</div><div className="my-5 rounded-[22px] bg-[#fff0f3] p-4 text-xs leading-6 text-[#6b545a]"><div className="flex items-center gap-2 font-semibold text-[#b8435f]"><BadgeCheck size={16}/> {isAr?'طلب آمن':'Secure order'}</div><p className="mt-1">{isAr?'نؤكد التوصيل عبر واتساب.':'We confirm delivery on WhatsApp.'}</p></div><div className="space-y-3 border-t border-[#f0d4dc] pt-5 text-sm"><div className="flex justify-between"><span>{isAr?'المجموع الفرعي':'Subtotal'}</span><span>{fmt(subtotal)}</span></div><div className="flex justify-between"><span>{isAr?'الشحن':'Shipping'}</span><span className="text-[#d4567a] font-semibold">{isAr?'مجاني':'Free'}</span></div><div className="flex justify-between border-t border-[#f0d4dc] pt-4 text-lg font-semibold"><span>{isAr?'الإجمالي':'Total'}</span><span>{fmt(grand)}</span></div></div><button type="submit" className="mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-[13px] font-semibold uppercase tracking-[.14em] text-white transition hover:brightness-105"><WhatsAppIcon className="h-5 w-5"/> {isAr?'إتمام الطلب عبر واتساب':'Complete order on WhatsApp'}</button><p className="mt-3 text-center text-[11px] leading-5 text-[#8c6b74]">{isAr?'سيتم فتح واتساب بتفاصيل طلبك.':'WhatsApp will open with your order details.'}</p></aside>
    </form></div></main>
}
function FloatingWhatsApp(){
  const { isAr } = useLang()
  return <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label={isAr?'تواصل مع لمسة عبر واتساب':'Chat with Lamssa on WhatsApp'} className={`fixed bottom-4 z-40 grid h-[56px] w-[56px] place-items-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105 md:bottom-5 md:h-[62px] md:w-[62px] ${isAr?'left-4 md:left-5':'right-4 md:right-5'}`}><WhatsAppIcon className="h-[30px] w-[30px] md:h-[34px] md:w-[34px]"/></a>
}
function ScrollReset(){
  useLayoutEffect(()=>{
    window.scrollTo({ top:0, left:0, behavior:'instant' })
  },[])
  return null
}
function Shell(){ const {pathname}=useLocation(); return <><Header/><CartDrawer/><AnimatePresence><motion.div key={pathname} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.28,ease:'easeOut'}}><ScrollReset/><Routes location={pathname}><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductPage/>}/><Route path="/collection/:slug" element={<CollectionPage/>}/><Route path="/checkout" element={<Checkout/>}/></Routes></motion.div></AnimatePresence><Footer/><FloatingWhatsApp/></> }
function App(){ useEffect(()=>{ initPixels() },[]); return <LanguageProvider><CurrencyProvider><CartProvider><Shell/></CartProvider></CurrencyProvider></LanguageProvider> }
export default App

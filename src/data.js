export const img = (url, width = 900) => `${url}${url.includes('?') ? '&' : '?'}width=${width}`
export const moneyAED = (amount) => `Dhs. ${Number(amount).toFixed(2)}`

export const assets = {
  logo: '/images/lamssa/hero.jpg',
  headerLogo: '/images/lamssa/hero.jpg',
  hero: '/images/lamssa/hero.jpg',
  brandPackaging: '/images/lamssa/brand-story.jpg',
}

export const collections = [
  ['NEW ARRIVALS','/images/lamssa/collections/new-arrivals.jpg'],
  ['EDIBLE FLAVORS','/images/lamssa/collections/edible-flavors.jpg'],
  ['NOVELTY LINGERIE','/images/lamssa/collections/novelty-lingerie.jpg'],
  ['BODY CARE','/images/lamssa/collections/body-care.jpg'],
]

export const products = [
  { id:'edible-body-flavor-strawberry', name:'EDIBLE BODY FLAVOR – STRAWBERRY', arName:'نكهة جسم قابلة للأكل – فراولة', price:'AED 89', aed:'DHS. 89.00', priceAed:89, img:'/images/lamssa/products/1/01.jpg', hover:'/images/lamssa/products/1/02.jpg', colorName:'Pink', desc:'A strawberry-flavored edible body gel for couples. Sensual and sweet.', arDesc:'جل جسم بنكهة الفراولة قابل للأكل للمتزوجين. حسي وناعم.', gallery:['/images/lamssa/products/1/01.jpg','/images/lamssa/products/1/02.jpg'] },
  { id:'edible-body-flavor-chocolate', name:'EDIBLE BODY FLAVOR – CHOCOLATE', arName:'نكهة جسم قابلة للأكل – شوكولاتة', price:'AED 89', aed:'DHS. 89.00', priceAed:89, img:'/images/lamssa/products/2/01.jpg', hover:'/images/lamssa/products/2/02.jpg', colorName:'Brown', desc:'A rich chocolate-flavored edible body gel for couples.', arDesc:'جل جسم بنكهة الشوكولاتة الغنية قابل للأكل للمتزوجين.', gallery:['/images/lamssa/products/2/01.jpg','/images/lamssa/products/2/02.jpg'] },
  { id:'edible-bikini-candy-red', name:'EDIBLE CANDY BIKINI – RED', arName:'بكيني حلوى قابل للأكل – أحمر', price:'AED 65', aed:'DHS. 65.00', priceAed:65, img:'/images/lamssa/products/3/01.jpg', hover:'/images/lamssa/products/3/02.jpg', colorName:'Red', desc:'A playful candy bikini in red, edible and fun for married couples.', arDesc:'بكيني حلوى أحمر قابل للأكل، مرح وممتع للمتزوجين.', gallery:['/images/lamssa/products/3/01.jpg','/images/lamssa/products/3/02.jpg'] },
  { id:'edible-bikini-candy-pink', name:'EDIBLE CANDY BIKINI – PINK', arName:'بكيني حلوى قابل للأكل – وردي', price:'AED 65', aed:'DHS. 65.00', priceAed:65, img:'/images/lamssa/products/4/01.jpg', hover:'/images/lamssa/products/4/02.jpg', colorName:'Pink', desc:'A sweet candy bikini in pink, edible and playful.', arDesc:'بكيني حلوى وردي قابل للأكل، حلو ومرح.', gallery:['/images/lamssa/products/4/01.jpg','/images/lamssa/products/4/02.jpg'] },
  { id:'bunny-lingerie-set-black', name:'BUNNY LINGERIE SET – BLACK', arName:'طقم لانجري أرنوب – أسود', price:'AED 120', aed:'DHS. 120.00', priceAed:120, img:'/images/lamssa/products/5/01.jpg', hover:'/images/lamssa/products/5/02.jpg', colorName:'Black', desc:'A flirty bunny-themed lingerie set in black for special evenings.', arDesc:'طقم لانجري أرنوب أسود لأمسيات مميزة.', gallery:['/images/lamssa/products/5/01.jpg','/images/lamssa/products/5/02.jpg'] },
  { id:'bunny-lingerie-set-red', name:'BUNNY LINGERIE SET – RED', arName:'طقم لانجري أرنوب – أحمر', price:'AED 120', aed:'DHS. 120.00', priceAed:120, img:'/images/lamssa/products/6/01.jpg', hover:'/images/lamssa/products/6/02.jpg', colorName:'Red', desc:'A flirty bunny-themed lingerie set in red.', arDesc:'طقم لانجري أرنوب أحمر مثير.', gallery:['/images/lamssa/products/6/01.jpg','/images/lamssa/products/6/02.jpg'] },
  { id:'bikini-area-care-kit', name:'BIKINI AREA CARE KIT', arName:'بكج العناية بمنطقة البكيني', price:'AED 149', aed:'DHS. 149.00', priceAed:149, img:'/images/lamssa/products/7/01.jpg', hover:'/images/lamssa/products/7/02.jpg', colorName:'White', desc:'Complete bikini area care package — lightening, scent, and smoothness.', arDesc:'بكج كامل للعناية بمنطقة البكيني — تفتيح وعطر ونعومة.', gallery:['/images/lamssa/products/7/01.jpg','/images/lamssa/products/7/02.jpg'] },
  { id:'flavored-lip-tint', name:'FLAVORED LIP TINT', arName:'منكه شفاه قابل للتذوق', price:'AED 45', aed:'DHS. 45.00', priceAed:45, img:'/images/lamssa/products/8/01.jpg', hover:'/images/lamssa/products/8/02.jpg', colorName:'Pink', desc:'A tasteable flavored lip product for intimate moments.', arDesc:'منكه شفاه بطعم لذيذ للحظات الحميمة.', gallery:['/images/lamssa/products/8/01.jpg','/images/lamssa/products/8/02.jpg'] },
]

export const blackProductGallery = products[0].gallery

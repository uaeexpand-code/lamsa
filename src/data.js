export const img = (url, width = 900) => `${url}${url.includes('?') ? '&' : '?'}width=${width}`
export const moneyAED = (amount) => `Dhs. ${Number(amount).toFixed(2)}`

export const assets = {
  logo: '/images/lamssa/products/edible-bikini/strawberry.png',
  headerLogo: '/images/lamssa/products/edible-bikini/strawberry.png',
  hero: '/images/lamssa/products/edible-bikini/strawberry.png',
  brandPackaging: '/images/lamssa/products/edible-bikini/chocolate.png',
}

export const collections = [
  ['EDIBLE BIKINI','/images/lamssa/products/edible-bikini/strawberry.png'],
  ['BODY CARE','/images/lamssa/products/bikini-care/01.png'],
]

export const FLAVORS = [
  { id:'strawberry', name:'Strawberry', arName:'فراولة', hex:'#e63946', img:'/images/lamssa/products/edible-bikini/strawberry.png' },
  { id:'cherry', name:'Cherry', arName:'كرز', hex:'#c1121f', img:'/images/lamssa/products/edible-bikini/cherry.png' },
  { id:'mango', name:'Mango', arName:'مانجو', hex:'#f4a020', img:'/images/lamssa/products/edible-bikini/mango.png' },
  { id:'pineapple', name:'Pineapple', arName:'أناناس', hex:'#f4c542', img:'/images/lamssa/products/edible-bikini/pineapple.png' },
  { id:'grape', name:'Grape', arName:'عنب', hex:'#7b2d8b', img:'/images/lamssa/products/edible-bikini/grape.png' },
  { id:'chocolate', name:'Chocolate', arName:'شوكولاتة', hex:'#3d1e10', img:'/images/lamssa/products/edible-bikini/chocolate.png' },
]

export const products = [
  ...FLAVORS.map(f => ({
    id:`edible-bikini-${f.id}`,
    name:`EDIBLE BIKINI — ${f.name.toUpperCase()}`,
    arName:`بكيني قابل للأكل — ${f.arName}`,
    price:'AED 65',
    aed:'DHS. 65.00',
    priceAed:65,
    img:f.img,
    hover:f.img,
    colorName:f.name,
    desc:`${f.name}-flavored edible candy bikini — fun, playful, and sweet. For married couples only.`,
    arDesc:`بكيني حلوى قابل للأكل بنكهة ${f.arName} — مرح وحلو ومميز. للمتزوجين فقط.`,
    gallery:[f.img],
    hasFlavors:false,
    flavor:f,
  })),
  {
    id:'edible-bikini-bundle',
    name:'ALL 6 FLAVORS BUNDLE',
    arName:'بكج الـ 6 نكهات كامل',
    price:'AED 299',
    aed:'DHS. 299.00',
    priceAed:299,
    compareAtAed:390,
    img:'/images/lamssa/products/edible-bikini/strawberry.png',
    hover:'/images/lamssa/products/edible-bikini/chocolate.png',
    colorName:'Pink',
    desc:'Get all 6 edible bikini flavors in one bundle and save. Strawberry, cherry, mango, pineapple, grape & chocolate.',
    arDesc:'احصل على كل الـ 6 نكهات في بكج واحد ووفّر. فراولة، كرز، مانجو، أناناس، عنب وشوكولاتة.',
    gallery: FLAVORS.map(f => f.img),
    hasFlavors:false,
    badge:{ en:'Save AED 91', ar:'وفّر ٩١ درهم' },
  },
  {
    id:'femininity-care-package',
    name:'FEMININITY CARE PACKAGE',
    arName:'بكج الأنوثة للعناية بالمناطق الحساسة',
    price:'AED 149',
    aed:'DHS. 149.00',
    priceAed:149,
    img:'/images/lamssa/products/bikini-care/01.png',
    hover:'/images/lamssa/products/bikini-care/01.png',
    colorName:'Pink',
    desc:'Complete bikini area care set — Beauty Girl wash & toner + soap. Brightening, moisturizing, 48h freshness.',
    arDesc:'بكج كامل للعناية بالمناطق الحساسة — غسول وتونر + صابونة من بيوتي غيرل. تفتيح وترطيب وانتعاش ٤٨ ساعة.',
    gallery:['/images/lamssa/products/bikini-care/01.png'],
    hasFlavors:false,
  },
]

export const blackProductGallery = products[0].gallery

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
  { id:'strawberry', name:'Strawberry', arName:'فراولة', hex:'#e63946', icon:'/images/lamssa/flavors/strawberry.svg', img:'/images/lamssa/products/edible-bikini/strawberry.png' },
  { id:'cherry', name:'Cherry', arName:'كرز', hex:'#c1121f', icon:'/images/lamssa/flavors/cherry.svg', img:'/images/lamssa/products/edible-bikini/cherry.png' },
  { id:'mango', name:'Mango', arName:'مانجو', hex:'#f4a020', icon:'/images/lamssa/flavors/mango.svg', img:'/images/lamssa/products/edible-bikini/mango.png' },
  { id:'pineapple', name:'Pineapple', arName:'أناناس', hex:'#f4c542', icon:'/images/lamssa/flavors/pineapple.svg', img:'/images/lamssa/products/edible-bikini/pineapple.png' },
  { id:'grape', name:'Grape', arName:'عنب', hex:'#7b2d8b', icon:'/images/lamssa/flavors/grape.svg', img:'/images/lamssa/products/edible-bikini/grape.png' },
  { id:'chocolate', name:'Chocolate', arName:'شوكولاتة', hex:'#3d1e10', icon:'/images/lamssa/flavors/chocolate.svg', img:'/images/lamssa/products/edible-bikini/chocolate.png' },
]

export const products = [
  ...FLAVORS.map(f => ({
    id:`edible-bikini-${f.id}`,
    name:`EDIBLE BIKINI — ${f.name.toUpperCase()}`,
    arName:`بكيني قابل للأكل — ${f.arName}`,
    price:'AED 129',
    aed:'DHS. 129.00',
    priceAed:129,
    compareAtAed:169,
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
    price:'AED 499',
    aed:'DHS. 499.00',
    priceAed:499,
    compareAtAed:774,
    img:'/images/lamssa/products/edible-bikini/strawberry.png',
    hover:'/images/lamssa/products/edible-bikini/chocolate.png',
    colorName:'Pink',
    desc:'Get all 6 edible bikini flavors in one bundle and save. Strawberry, cherry, mango, pineapple, grape & chocolate.',
    arDesc:'احصل على كل الـ 6 نكهات في بكج واحد ووفّر. فراولة، كرز، مانجو، أناناس، عنب وشوكولاتة.',
    gallery: FLAVORS.map(f => f.img),
    hasFlavors:false,
  },
  {
    id:'femininity-care-package',
    name:'FEMININITY CARE PACKAGE',
    arName:'بكج الأنوثة للعناية بالمناطق الحساسة',
    price:'AED 149',
    aed:'DHS. 149.00',
    priceAed:149,
    compareAtAed:199,
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

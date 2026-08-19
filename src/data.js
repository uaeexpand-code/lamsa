export const img = (url, width = 900) => `${url}${url.includes('?') ? '&' : '?'}width=${width}`
export const moneyAED = (amount) => `Dhs. ${Number(amount).toFixed(2)}`

export const assets = {
  logo: '/images/lamssa/products/edible-bikini/strawberry.png',
  headerLogo: '/images/lamssa/products/edible-bikini/strawberry.png',
  hero: '/images/lamssa/products/edible-bikini/strawberry.png',
  brandPackaging: '/images/lamssa/products/edible-bikini/chocolate.png',
}

export const collections = [
  ['NEW ARRIVALS','/images/lamssa/products/edible-bikini/strawberry.png'],
  ['EDIBLE FLAVORS','/images/lamssa/products/edible-bikini/mango.png'],
  ['NOVELTY LINGERIE','/images/lamssa/products/edible-bikini/grape.png'],
  ['BODY CARE','/images/lamssa/products/edible-bikini/pineapple.png'],
]

export const FLAVORS = [
  { id:'strawberry', name:'Strawberry', arName:'فراولة', hex:'#e63946', img:'/images/lamssa/products/edible-bikini/strawberry.png' },
  { id:'cherry', name:'Cherry', arName:'كرز', hex:'#c1121f', img:'/images/lamssa/products/edible-bikini/cherry.png' },
  { id:'mango', name:'Mango', arName:'مانجو', hex:'#f4a020', img:'/images/lamssa/products/edible-bikini/mango.png' },
  { id:'pineapple', name:'Pineapple', arName:'أناناس', hex:'#f4c542', img:'/images/lamssa/products/edible-bikini/pineapple.png' },
  { id:'grape', name:'Grape', arName:'عنب', hex:'#7b2d8b', img:'/images/lamssa/products/edible-bikini/grape.png' },
  { id:'chocolate', name:'Chocolate', arName:'شوكولاتة', hex:'#3d1e10', img:'/images/lamssa/products/edible-bikini/chocolate.png' },
]

export const products = FLAVORS.map(f => ({
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
}))

export const blackProductGallery = products[0].gallery

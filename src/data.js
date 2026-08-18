export const img = (url, width = 900) => `${url}${url.includes('?') ? '&' : '?'}width=${width}`
export const moneyAED = (amount) => `Dhs. ${Number(amount).toFixed(2)}`

export const assets = {
  logo: '/images/amadora/products/1/01.jpg',
  headerLogo: '/images/amadora/products/1/01.jpg',
  hero: '/images/amadora/products/1/01.jpg',
  brandPackaging: '/images/amadora/products/7/01.jpg',
}

export const collections = [
  ['NEW ARRIVALS','/images/amadora/products/1/01.jpg'],
  ['SUMMER IDYLLS','/images/amadora/products/2/01.jpg'],
  ['CLASSY','/images/amadora/products/6/01.jpg'],
  ['EVENING EDIT','/images/amadora/products/8/01.jpg'],
]

const g = (group) => {
  const max = { 1:2, 2:3, 3:3, 4:3, 5:3, 6:3, 7:3, 8:1 }
  return Array.from({ length:max[group] || 1 }, (_,index) => `/images/amadora/products/${group}/${String(index + 1).padStart(2,'0')}.jpg`)
}

export const products = [
  { id:'peach-pleated-lace-gown', name:'PEACH PLEATED LACE GOWN', arName:'فستان خوخي بطيات ودانتيل', price:'AED 2000', aed:'DHS. 2000.00', priceAed:2000, img:g(1)[0], hover:g(1)[1], colorName:'Peach', desc:'A peach-toned pleated gown with a lace bodice from the Summer Idylls Collection 2025.', arDesc:'فستان خوخي بطيات وصدر من الدانتيل من مجموعة سمر إيدلز ٢٠٢٥.', gallery:g(1) },
  { id:'blush-embroidered-abaya', name:'BLUSH EMBROIDERED ABAYA', arName:'عباية وردية مطرزة', price:'AED 2000', aed:'DHS. 2000.00', priceAed:2000, img:g(2)[0], hover:g(2)[1], colorName:'Blush', desc:'A blush floor-length abaya with pink embroidery and delicate button detailing from the Summer Idylls Collection 2025.', arDesc:'عباية وردية طويلة بتطريز وردي وتفاصيل أزرار ناعمة من مجموعة سمر إيدلز ٢٠٢٥.', gallery:g(2) },
  { id:'champagne-lace-sleeve-dress', name:'CHAMPAGNE LACE-SLEEVE DRESS', arName:'فستان شامبين بأكمام دانتيل', price:'AED 2000', aed:'DHS. 2000.00', priceAed:2000, img:g(3)[0], hover:g(3)[1], colorName:'Champagne', desc:'A champagne maxi dress with lace sleeves and a softly draped silhouette from the Summer Idylls Collection 2025.', arDesc:'فستان شامبين طويل بأكمام دانتيل وقصة انسيابية من مجموعة سمر إيدلز ٢٠٢٥.', gallery:g(3) },
  { id:'ice-blue-lace-trim-abaya', name:'ICE BLUE LACE-TRIM ABAYA', arName:'عباية سماوية بتفاصيل دانتيل', price:'AED 2000', aed:'DHS. 2000.00', priceAed:2000, img:g(4)[0], hover:g(4)[1], colorName:'Ice Blue', desc:'An ice-blue abaya finished with white lace trim along the front and sleeves from the Summer Idylls Collection 2025.', arDesc:'عباية سماوية بتفاصيل دانتيل أبيض على الواجهة والأكمام من مجموعة سمر إيدلز ٢٠٢٥.', gallery:g(4) },
  { id:'dusty-rose-lace-kaftan', name:'DUSTY ROSE LACE KAFTAN', arName:'قفطان وردي غباري بدانتيل', price:'AED 2000', aed:'DHS. 2000.00', priceAed:2000, img:g(5)[0], hover:g(5)[1], colorName:'Dusty Rose', desc:'A flowing dusty-rose kaftan with white lace detailing from the Summer Idylls Collection 2025.', arDesc:'قفطان انسيابي باللون الوردي الغباري مع تفاصيل دانتيل أبيض من مجموعة سمر إيدلز ٢٠٢٥.', gallery:g(5) },
  { id:'classy-sage-ruffle-dress', name:'CLASSY SAGE RUFFLE DRESS', arName:'فستان كلاسي سيج بأكمام كشكش', price:'AED 700', aed:'DHS. 700.00', priceAed:700, img:g(6)[0], hover:g(6)[1], colorName:'Sage', desc:'Classy in soft sage, with a gathered waist and layered ruffle sleeves.', arDesc:'تصميم كلاسي بلون السيج الناعم، بخصر مجمع وأكمام كشكش متعددة الطبقات.', gallery:g(6) },
  { id:'ivory-embroidered-dress', name:'IVORY EMBROIDERED DRESS', arName:'فستان عاجي مطرز', price:'AED 2000', aed:'DHS. 2000.00', priceAed:2000, img:g(7)[0], hover:g(7)[1], colorName:'Ivory', desc:'An ivory loose-cut dress with tonal embroidery and wide sleeves from the Summer Idylls Collection 2025.', arDesc:'فستان عاجي بقصة فضفاضة وتطريز متناغم وأكمام واسعة من مجموعة سمر إيدلز ٢٠٢٥.', gallery:g(7) },
  { id:'white-lace-evening-dress', name:'WHITE LACE EVENING DRESS', arName:'فستان سهرة أبيض بدانتيل', price:'AED 2000', aed:'DHS. 2000.00', priceAed:2000, img:g(8)[0], hover:g(8)[0], colorName:'White', desc:'A white floor-length dress with embroidery and lace-finished sleeves from the Summer Idylls Collection 2025.', arDesc:'فستان أبيض طويل بتطريز وأكمام مزينة بالدانتيل من مجموعة سمر إيدلز ٢٠٢٥.', gallery:g(8) },
]

export const blackProductGallery = products[0].gallery

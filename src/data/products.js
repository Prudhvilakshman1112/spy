export const products = [
  // ═══════════════════════════════════════════
  // SHIRTS (clothing → shirts)
  // ═══════════════════════════════════════════
  {
    id: 'shirt-001',
    name: 'Midnight Floral Print Shirt',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'shirts',
    price: 1899,
    originalPrice: 2999,
    description: 'Premium cotton floral print shirt with a relaxed modern fit. Perfect for evening outings and casual gatherings.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy'],
    badge: 'BESTSELLER',
    atmosphere: 'clothing',
    images: [
      '/products/shirts/1/652593437_17898996006407338_6629818373478168293_n.jpg',
      '/products/shirts/1/653708450_17898995796407338_7117762134364532222_n.jpg',
      '/products/shirts/1/653890948_17898995832407338_1447990606815323151_n.jpg',
    ],
    // colorImages: maps each colour to its carousel index in `images[]`
    // index 0 = cover (all colours together), 1+ = individual colour shots
    colorImages: {
      'Black': 1,
      'Navy':  2,
    },
  },
  {
    id: 'shirt-002',
    name: 'Classic Striped Formal Shirt',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'shirts',
    price: 1499,
    originalPrice: 2499,
    description: 'Tailored striped shirt in premium cotton. Clean lines and structured collar for a sophisticated look.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White/Blue', 'White/Grey'],
    badge: null,
    atmosphere: 'clothing',
    images: [
      '/products/shirts/2/652079210_17898917031407338_6624973146843047815_n.jpg',
      '/products/shirts/2/652772779_17898916962407338_2020798742231414796_n.jpg',
      '/products/shirts/2/652774100_17898916944407338_1782183215977825139_n.jpg',
    ],
    colorImages: {
      'White/Blue': 1,
      'White/Grey': 2,
    },
  },
  {
    id: 'shirt-003',
    name: 'Botanical Garden Resort Shirt',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'shirts',
    price: 2199,
    originalPrice: 3499,
    description: 'Tropical-inspired resort shirt with all-over botanical print. Lightweight fabric ideal for Vizag summers.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['White/Green', 'Cream/Blue'],
    badge: 'NEW',
    atmosphere: 'clothing',
    images: [
      '/products/shirts/3/651502232_17898511128407338_3961653521532903808_n.jpg',
      '/products/shirts/3/651646487_17898511098407338_2235510785294967997_n.jpg',
      '/products/shirts/3/651752674_17898511068407338_1128419072619679100_n.jpg',
    ],
    colorImages: {
      'White/Green': 1,
      'Cream/Blue':  2,
    },
  },
  {
    id: 'shirt-004',
    name: 'Oxford Button-Down Classic',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'shirts',
    price: 1699,
    originalPrice: null,
    description: 'Timeless Oxford button-down in premium cotton. A wardrobe essential for any gentleman.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue', 'Pink'],
    badge: null,
    atmosphere: 'clothing',
    images: [
      '/products/shirts/4/649556360_17897947104407338_6319893587288100179_n.jpg',
      '/products/shirts/4/649773913_17897947059407338_7777731556998918859_n.jpg',
      '/products/shirts/4/650220944_17897947047407338_3452300984456669186_n.jpg',
    ],
    colorImages: {
      'White':      0,
      'Light Blue': 1,
      'Pink':       2,
    },
  },
  {
    id: 'shirt-005',
    name: 'Black Embroidered Statement Shirt',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'shirts',
    price: 2499,
    originalPrice: 3999,
    description: 'Bold black shirt with intricate butterfly and floral embroidery. For the man who makes a statement.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    badge: 'TRENDING',
    atmosphere: 'clothing',
    images: [
      '/products/shirts/5/649403710_17897912421407338_3405813342588314246_n.jpg',
      '/products/shirts/5/649847084_17897912367407338_7409692509874705074_n.jpg',
      '/products/shirts/5/650134244_17897912397407338_7803089676417766917_n.jpg',
    ],
    colorImages: {
      'Black': 0,
    },
  },
  {
    id: 'shirt-006',
    name: 'Pastel Linen Summer Shirt',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'shirts',
    price: 1799,
    originalPrice: 2799,
    description: 'Breathable linen shirt in soft pastel tones. The perfect companion for beach walks at RK Beach.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Mint', 'Peach', 'Sky Blue'],
    badge: null,
    atmosphere: 'clothing',
    images: [
      '/products/shirts/6/641330726_17896985091407338_8128616217468782635_n.jpg',
      '/products/shirts/6/641771398_17896985085407338_3943083797370913406_n.jpg',
      '/products/shirts/6/642500050_17896985076407338_8004424778753884120_n.jpg',
    ],
    colorImages: {
      'Mint':     0,
      'Peach':    1,
      'Sky Blue': 2,
    },
  },

  // ═══════════════════════════════════════════
  // JEANS (clothing → jeans)
  // ═══════════════════════════════════════════
  {
    id: 'jeans-001',
    name: 'Distressed Charcoal Slim Fit',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'jeans',
    price: 2299,
    originalPrice: 3499,
    description: 'Modern distressed jeans in charcoal wash. Slim fit with stretch comfort for all-day wear.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Charcoal'],
    badge: 'BESTSELLER',
    atmosphere: 'clothing',
    images: [
      '/products/jeans/1/650730237_17898653781407338_1684584722879861276_n.jpg',
      '/products/jeans/1/651061685_17898653853407338_7314555725827964414_n.jpg',
      '/products/jeans/1/651632102_17898653895407338_7391433155879392190_n.jpg',
    ],
    colorImages: {
      'Charcoal': 0,
    },
  },
  {
    id: 'jeans-002',
    name: 'Classic Indigo Straight Fit',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'jeans',
    price: 1999,
    originalPrice: null,
    description: 'Classic indigo jeans with a straight-leg silhouette. Versatile enough for both casual and semi-formal occasions.',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Dark Indigo', 'Medium Blue'],
    badge: null,
    atmosphere: 'clothing',
    images: [
      '/products/jeans/2/621386639_17891753571407338_4713682832581669159_n.jpg',
      '/products/jeans/2/622113472_17891753622407338_7232810798027093273_n.jpg',
      '/products/jeans/2/622254779_17891753631407338_3027813790584895536_n.jpg',
    ],
    colorImages: {
      'Dark Indigo':  1,
      'Medium Blue':  2,
    },
  },
  {
    id: 'jeans-003',
    name: 'Ripped Knee Skinny Jeans',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'jeans',
    price: 2499,
    originalPrice: 3999,
    description: 'Edgy skinny jeans with artful knee rips. Premium stretch denim for the fashion-forward man.',
    sizes: ['28', '30', '32', '34'],
    colors: ['Black', 'Light Blue'],
    badge: 'TRENDING',
    atmosphere: 'clothing',
    images: [
      '/products/jeans/3/611249000_17889796719407338_2717939747655955892_n.jpg',
      '/products/jeans/3/611292584_17889796767407338_7084810456017708497_n.jpg',
      '/products/jeans/3/611678659_17889796710407338_4512478654306926527_n.jpg',
    ],
    colorImages: {
      'Black':      1,
      'Light Blue': 2,
    },
  },
  {
    id: 'jeans-004',
    name: 'Washed Denim Relaxed Fit',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'jeans',
    price: 2199,
    originalPrice: 3299,
    description: 'Relaxed-fit washed denim with a vintage vibe. Premium quality fabric for ultimate comfort.',
    sizes: ['30', '32', '34', '36'],
    colors: ['Washed Blue'],
    badge: 'NEW',
    atmosphere: 'clothing',
    images: [
      '/products/jeans/4/610523916_17889087690407338_196443099719518210_n.jpg',
      '/products/jeans/4/610622703_17889087681407338_3885442591387502714_n.jpg',
      '/products/jeans/4/610833833_17889087699407338_5287642713699373401_n.jpg',
    ],
    colorImages: {
      'Washed Blue': 0,
    },
  },

  // ═══════════════════════════════════════════
  // HOODIES (clothing → hoodies)
  // ═══════════════════════════════════════════
  {
    id: 'hoodie-001',
    name: 'Urban Street Hoodie',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'hoodies',
    price: 2499,
    originalPrice: 3999,
    description: 'Premium quality street-style hoodie with a modern oversized fit. Soft fleece interior for maximum comfort.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey'],
    badge: 'NEW',
    atmosphere: 'clothing',
    images: [
      '/products/hoodies/1/619893256_17891330793407338_5031916512463966049_n.jpg',
      '/products/hoodies/1/621235687_17891330784407338_7764068102480186370_n.jpg',
      '/products/hoodies/1/621349949_17891330811407338_4457054198515912694_n.jpg',
    ],
  },
  {
    id: 'hoodie-002',
    name: 'Graphic Print Pullover Hoodie',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'hoodies',
    price: 2799,
    originalPrice: 4499,
    description: 'Bold graphic print pullover hoodie. Kangaroo pocket and adjustable drawstring hood for everyday wear.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Multi'],
    badge: 'TRENDING',
    atmosphere: 'clothing',
    images: [
      '/products/hoodies/2/619699425_17891340609407338_5590256109220610075_n.jpg',
      '/products/hoodies/2/620521862_17891340645407338_4552293934859116938_n.jpg',
      '/products/hoodies/2/621449349_17891340636407338_526524656617468674_n.jpg',
    ],
  },

  // ═══════════════════════════════════════════
  // KURTHAS (clothing → kurthas)
  // ═══════════════════════════════════════════
  {
    id: 'kurtha-001',
    name: 'Designer Ethnic Kurta',
    brand: 'Brand 2 Brand',
    category: 'clothing',
    subcategory: 'kurthas',
    price: 1899,
    originalPrice: 2999,
    description: 'Elegant designer kurta blending ethnic roots with contemporary style. Perfect for festive occasions and traditional gatherings.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Cream', 'Navy', 'Sage Green'],
    badge: 'EXCLUSIVE',
    atmosphere: 'clothing',
    images: [
      '/products/kurthas/1/648600484_17897780160407338_4467657135247055673_n.jpg',
      '/products/kurthas/1/649222900_17897780214407338_5633338814343340117_n.jpg',
      '/products/kurthas/1/649227484_17897780241407338_6665421347346239718_n.jpg',
    ],
  },

  // ═══════════════════════════════════════════
  // MEN'S FOOTWEAR — SHOES (footwear → shoes)
  // ═══════════════════════════════════════════
  {
    id: 'foot-m-001',
    name: 'Urban Runner Sneakers',
    brand: 'Brand 2 Brand',
    category: 'footwear',
    subcategory: 'shoes',
    gender: 'men',
    price: 3499,
    originalPrice: 4999,
    description: 'Lightweight urban sneakers with cushioned soles. Built for both style and comfort on Vizag streets.',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['White/Red', 'Black/Gold'],
    badge: 'BESTSELLER',
    atmosphere: 'footwear',
    images: [
      '/products/men-footwear/shoes/1/Screenshot%202026-03-29%20164422.png',
      '/products/men-footwear/shoes/1/Screenshot%202026-03-29%20164530.png',
    ],
  },
  {
    id: 'foot-m-002',
    name: 'Classic Sports Trainer',
    brand: 'Brand 2 Brand',
    category: 'footwear',
    subcategory: 'shoes',
    gender: 'men',
    price: 3999,
    originalPrice: 5999,
    description: 'Performance training shoes with responsive cushioning and breathable mesh upper.',
    sizes: ['7', '8', '9', '10'],
    colors: ['Red/Black', 'Blue/White'],
    badge: 'TRENDING',
    atmosphere: 'footwear',
    images: [
      '/products/men-footwear/shoes/2/Screenshot%202026-03-29%20164604.png',
      '/products/men-footwear/shoes/2/Screenshot%202026-03-29%20164653.png',
    ],
  },
  {
    id: 'foot-m-003',
    name: 'Premium Lifestyle Sneakers',
    brand: 'Brand 2 Brand',
    category: 'footwear',
    subcategory: 'shoes',
    gender: 'men',
    price: 4499,
    originalPrice: 6499,
    description: 'Bold lifestyle sneakers with premium finish. For the fearless trendsetter who stands out.',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Multi'],
    badge: null,
    atmosphere: 'footwear',
    images: [
      '/products/men-footwear/shoes/3/Screenshot%202026-03-29%20164741.png',
      '/products/men-footwear/shoes/3/Screenshot%202026-03-29%20164755.png',
      '/products/men-footwear/shoes/3/Screenshot%202026-03-29%20164812.png',
    ],
  },

  // ═══════════════════════════════════════════
  // MEN'S FOOTWEAR — SLIDES (footwear → slides)
  // ═══════════════════════════════════════════
  {
    id: 'foot-m-004',
    name: 'Comfort Slide Sandals',
    brand: 'Brand 2 Brand',
    category: 'footwear',
    subcategory: 'slides',
    gender: 'men',
    price: 1299,
    originalPrice: 1999,
    description: 'Ultra-comfortable slide sandals with cushioned footbed. Perfect for casual outings and beach days.',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Black', 'Navy'],
    badge: null,
    atmosphere: 'footwear',
    images: [
      '/products/men-footwear/slides/1/Screenshot%202026-03-29%20164907.png',
      '/products/men-footwear/slides/1/Screenshot%202026-03-29%20164923.png',
      '/products/men-footwear/slides/1/Screenshot%202026-03-29%20164930.png',
    ],
  },
  {
    id: 'foot-m-005',
    name: 'Premium Logo Slides',
    brand: 'Brand 2 Brand',
    category: 'footwear',
    subcategory: 'slides',
    gender: 'men',
    price: 1499,
    originalPrice: 2499,
    description: 'Premium branded slides with textured sole and logo emboss. Lightweight and durable.',
    sizes: ['7', '8', '9', '10'],
    colors: ['Black/Red', 'White'],
    badge: 'NEW',
    atmosphere: 'footwear',
    images: [
      '/products/men-footwear/slides/2/Screenshot%202026-03-29%20165029.png',
      '/products/men-footwear/slides/2/Screenshot%202026-03-29%20165033.png',
      '/products/men-footwear/slides/2/Screenshot%202026-03-29%20165048.png',
    ],
  },

  // ═══════════════════════════════════════════
  // WOMEN'S FOOTWEAR (footwear → casual)
  // ═══════════════════════════════════════════
  {
    id: 'foot-w-001',
    name: 'Pastel Cloud Runners',
    brand: 'Brand 2 Brand',
    category: 'footwear',
    subcategory: 'casual',
    gender: 'women',
    price: 2999,
    originalPrice: 4499,
    description: 'Ultra-lightweight runners in dreamy pastel shades. Cloud-like comfort for everyday wear.',
    sizes: ['5', '6', '7', '8'],
    colors: ['Pink/White', 'Lavender/Grey'],
    badge: 'NEW',
    atmosphere: 'footwear',
    images: [
      '/products/women-footwear/1/482761558_17859811380367886_1368309460049346498_n.jpg',
      '/products/women-footwear/1/482822600_17859811362367886_4719970564663976312_n.jpg',
      '/products/women-footwear/1/482825858_17859811353367886_503780173478954933_n.jpg',
    ],
  },
  {
    id: 'foot-w-002',
    name: 'Canvas Printed Slip-Ons',
    brand: 'Brand 2 Brand',
    category: 'footwear',
    subcategory: 'casual',
    gender: 'women',
    price: 1799,
    originalPrice: 2999,
    description: 'Vibrant printed canvas slip-ons. Effortless style for casual outings.',
    sizes: ['5', '6', '7', '8'],
    colors: ['Floral', 'Abstract'],
    badge: null,
    atmosphere: 'footwear',
    images: [
      '/products/women-footwear/2/481204552_17858703837367886_1575731551976373224_n.jpg',
      '/products/women-footwear/2/481686485_17858703867367886_6842924061356850442_n.jpg',
      '/products/women-footwear/2/481877001_17858703855367886_6906692105625158370_n.jpg',
    ],
  },
  {
    id: 'foot-w-003',
    name: 'Flex Motion Sports Shoe',
    brand: 'Brand 2 Brand',
    category: 'footwear',
    subcategory: 'sports',
    gender: 'women',
    price: 3499,
    originalPrice: 4999,
    description: 'Dynamic sports shoes with flex-motion technology. Designed for active lifestyles.',
    sizes: ['5', '6', '7', '8'],
    colors: ['Teal/White', 'Pink/Black'],
    badge: 'TRENDING',
    atmosphere: 'footwear',
    images: [
      '/products/women-footwear/3/476611577_17856356457367886_3281942688952236433_n.jpg',
      '/products/women-footwear/3/476669871_17856356475367886_8201040391479122935_n.jpg',
      '/products/women-footwear/3/476753455_17856356466367886_4455089896147586607_n.jpg',
    ],
  },

  // ═══════════════════════════════════════════
  // MEN'S WATCHES (accessories → watches)
  // ═══════════════════════════════════════════
  {
    id: 'watch-m-001',
    name: 'Skeleton Dial Luxury Watch',
    brand: 'Premium Collection',
    category: 'accessories',
    subcategory: 'watches',
    gender: 'men',
    price: 12999,
    originalPrice: 19999,
    description: 'Exquisite skeleton dial mechanical watch with rose gold case. The intricate movement visible through the transparent face.',
    sizes: ['One Size'],
    colors: ['Rose Gold'],
    badge: 'EXCLUSIVE',
    atmosphere: 'accessories',
    images: [
      '/products/men-watches/1/503587610_17867286039407338_1906862732559694388_n.jpg',
      '/products/men-watches/1/514996708_17867286030407338_1565399906431850787_n.jpg',
      '/products/men-watches/1/515012618_17867286048407338_5487718430230671784_n.jpg',
    ],
  },
  {
    id: 'watch-m-002',
    name: 'Chronograph Sports Watch',
    brand: 'Premium Collection',
    category: 'accessories',
    subcategory: 'watches',
    gender: 'men',
    price: 8999,
    originalPrice: 14999,
    description: 'Multi-function chronograph with water resistance. Precision timing meets rugged durability.',
    sizes: ['One Size'],
    colors: ['Silver/Blue', 'Black'],
    badge: null,
    atmosphere: 'accessories',
    images: [
      '/products/men-watches/2/514677846_17867168292407338_2816860666345165928_n.jpg',
      '/products/men-watches/2/514911170_17867168283407338_3571312622933784113_n.jpg',
      '/products/men-watches/2/515446558_17867168253407338_6412254788332877398_n.jpg',
    ],
  },
  {
    id: 'watch-m-003',
    name: 'Minimalist Leather Strap Watch',
    brand: 'Premium Collection',
    category: 'accessories',
    subcategory: 'watches',
    gender: 'men',
    price: 5999,
    originalPrice: 8999,
    description: 'Clean, minimalist dial with genuine leather strap. Understated elegance for the modern professional.',
    sizes: ['One Size'],
    colors: ['Brown/White', 'Black/Black'],
    badge: null,
    atmosphere: 'accessories',
    images: [
      '/products/men-watches/3/Screenshot%202026-03-29%20163814.png',
      '/products/men-watches/3/Screenshot%202026-03-29%20163902.png',
    ],
  },

  // ═══════════════════════════════════════════
  // WOMEN'S WATCHES (accessories → watches)
  // ═══════════════════════════════════════════
  {
    id: 'watch-w-001',
    name: 'Rose Gold Elegance Watch',
    brand: 'Premium Collection',
    category: 'accessories',
    subcategory: 'watches',
    gender: 'women',
    price: 7999,
    originalPrice: 12999,
    description: 'Elegant rose gold women\'s watch with crystal-studded bezel. A statement of grace and sophistication.',
    sizes: ['One Size'],
    colors: ['Rose Gold'],
    badge: 'EXCLUSIVE',
    atmosphere: 'accessories',
    images: [
      '/products/women-watches/1/506348462_17864932968407338_1083202475761799701_n.jpg',
      '/products/women-watches/1/508164113_17864932941407338_2846148449153356628_n.jpg',
      '/products/women-watches/1/508209824_17864932959407338_8710016381696563988_n.jpg',
    ],
  },
  {
    id: 'watch-w-002',
    name: 'Bracelet Style Fashion Watch',
    brand: 'Premium Collection',
    category: 'accessories',
    subcategory: 'watches',
    gender: 'women',
    price: 5999,
    originalPrice: 8999,
    description: 'Chic bracelet-style fashion watch. Doubles as a stunning accessory for any occasion.',
    sizes: ['One Size'],
    colors: ['Silver', 'Gold'],
    badge: 'NEW',
    atmosphere: 'accessories',
    images: [
      '/products/women-watches/2/Screenshot%202026-03-29%20164105.png',
    ],
  },

  // ═══════════════════════════════════════════
  // BAGS (accessories → bags)
  // ═══════════════════════════════════════════
  {
    id: 'bag-001',
    name: 'Premium Leather Tote Bag',
    brand: 'Brand 2 Brand',
    category: 'accessories',
    subcategory: 'bags',
    price: 6999,
    originalPrice: 9999,
    description: 'Stunning premium leather tote bag with spacious interior. Italian-inspired design meets everyday functionality.',
    sizes: ['One Size'],
    colors: ['Beige/Multi'],
    badge: 'EXCLUSIVE',
    atmosphere: 'accessories',
    images: [
      '/products/accessories-bags/bags/Screenshot%202026-03-29%20165647.png',
      '/products/accessories-bags/bags/Screenshot%202026-03-29%20165737.png',
    ],
  },
];

// ═══════════════════════════════════════════
// QUERY HELPERS
// ═══════════════════════════════════════════

export function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

export function getProductsBySubcategory(category, subcategory) {
  return products.filter(p => p.category === category && p.subcategory === subcategory);
}

export function getProductsByGender(gender) {
  return products.filter(p => p.gender === gender);
}

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function getFeaturedProducts() {
  return products.filter(p => p.badge === 'BESTSELLER' || p.badge === 'TRENDING');
}

export function getNewArrivals() {
  return products.filter(p => p.badge === 'NEW' || p.badge === 'EXCLUSIVE');
}

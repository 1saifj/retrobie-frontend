import {capitalize} from '../../helpers';

const links = [
  {
    title: 'Clothing',
    to: '/',
    items: [
      {
        title: 'Shorts',
        to: '/link',
      },
      {
        title: 'T-shirts',
        to: '/link',
      },
      {
        title: 'Trousers',
        to: '/link',
      },
      {
        title: 'Streetwear',
        to: '/link',
      },
      {
        title: 'Trench Coats',
        to: '/link',
      },
      {
        title: 'Polo shirts',
        to: '/link',
      },
      {
        title: 'Sportswear',
        to: '/link',
      },
      {
        title: 'Link',
        to: '/link',
      },
    ],
  },
  {
    title: 'Footwear',
    to: '/',
    items: [
      {
        title: 'Nike',
        to: '/link',
      },
      {
        title: 'Adidas',
        to: '/link',
      },
      {
        title: 'Yeezy',
        to: '/link',
      },
      {
        title: 'Converse',
        to: '/link',
      },
      {
        title: 'Link',
        to: '/link',
      },
      {
        title: 'Link',
        to: '/link',
      },
      {
        title: 'Link',
        to: '/link',
      },
      {
        title: 'Link',
        to: '/link',
      },
    ],
  },
  {
    title: 'Accessories',
    to: '/',
    items: [
      {
        title: 'Sunglasses',
        to: '/link',
      },
      {
        title: 'Keychains',
        to: '/link',
      },
      {
        title: 'Actual chains',
        to: '/link',
      },
      {
        title: 'Laces',
        to: '/link',
      },
      {
        title: 'Link',
        to: '/link',
      },
      {
        title: 'Link',
        to: '/link',
      },
      {
        title: 'Link',
        to: '/link',
      },
    ],
  },
];

const menuItems = [
  // note: having these items preloaded here
  // makes sure they don't jump around the page
  // if dynamically loaded
  {
    title: 'Brands',
    featured: false,
    links: [],
    style: {
      minWidth: 600,
      padding: '12px',
      rowGap: 8
    }
  }
  // {
  //     title: "Mens",
  //     featured: {
  //         //should be 400px wide
  //         image: "https://ik.imagekit.io/t25/v2/landing/converse-guy_1-oyeVteT.webp?tr=w-400",
  //         link: ""
  //     },
  //     links,
  // },
  // {
  //     title: "Womens",
  //     featured: {
  //         image: "https://ik.imagekit.io/t25/v2/landing/woman-shoes-2_VKcw430fh.webp?tr=w-400",
  //         link: ""
  //     },
  //     links,
  // },
  // {
  //     title: "Kids",
  //     featured: {
  //         image: "https://ik.imagekit.io/t25/v2/landing/kid-jordans-1_iI3MVADRioW.jpg?tr=w-400",
  //         link: ""
  //     },
  //     links,
  // },
];

const newItems = [
  {
    title: '',
    //should be 300px wide
    image: 'https://ik.imagekit.io/t25/v2/landing/air-jordan-6_vaYQOP8ejHD.webp?tr=w-200',
    to: '',
  },
  {
    title: '',
    image:
      'https://ik.imagekit.io/t25/v2/landing/nike-lebron-17-low-bone_HmFkaLy_9Tl.webp?tr=w-200',
    to: '',
  },
];

export {menuItems, newItems};

export function sortBrands(brands: any): Map<any, any> {
  // If no brands, return an empty array
  if (!brands?.length) return new Map<any, any>();
  // Capitalize the brand names
  const brandNames = brands.map(brand => capitalize(brand.name));
  // and sort them
  brandNames.sort();

  const brandCharMap = new Map();

  // For every brand, grab the first letter,
  brandNames.forEach(brand => {
    // check if that key exists in the map.
    // if not, create it as an array
    // and push the brand name into the array, sorting it
    // Our map will look like {"A": ["Adidas"], "N": ["Nike"]}
    let char = brand.charAt(0);

    if (brandCharMap.has(char)) {
      brandCharMap.set(char, [...brandCharMap.get(char), brand].sort());
    } else {
      brandCharMap.set(char, [brand]);
    }
  });

  return brandCharMap;
}

export function getBrandLinks(brandCharMap: Map<any, any>){

  // @ts-ignore
  return [...brandCharMap.keys()].map(key => {
    return {
      title: key.toUpperCase(),
      to: '#',
      items: brandCharMap.get(key)?.map(item => ({
        title: capitalize(item),
        to: `/brands/${item
          .trim()
          .toLowerCase()
          .replace(new RegExp(' ', 'g'), '-')}`,
      })),
    }
  });

}
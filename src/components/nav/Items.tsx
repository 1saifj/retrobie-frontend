import {capitalize} from '../../helpers';

// const links = [
//   {
//     title: 'Clothing',
//     to: '/',
//     items: [
//       {
//         title: 'Shorts',
//         to: '/link',
//       },
//       {
//         title: 'T-shirts',
//         to: '/link',
//       },
//       {
//         title: 'Trousers',
//         to: '/link',
//       },
//       {
//         title: 'Streetwear',
//         to: '/link',
//       },
//       {
//         title: 'Trench Coats',
//         to: '/link',
//       },
//       {
//         title: 'Polo shirts',
//         to: '/link',
//       },
//       {
//         title: 'Sportswear',
//         to: '/link',
//       },
//       {
//         title: 'Link',
//         to: '/link',
//       },
//     ],
//   },
//   {
//     title: 'Footwear',
//     to: '/',
//     items: [
//       {
//         title: 'Nike',
//         to: '/link',
//       },
//       {
//         title: 'Adidas',
//         to: '/link',
//       },
//       {
//         title: 'Yeezy',
//         to: '/link',
//       },
//       {
//         title: 'Converse',
//         to: '/link',
//       },
//       {
//         title: 'Link',
//         to: '/link',
//       },
//       {
//         title: 'Link',
//         to: '/link',
//       },
//       {
//         title: 'Link',
//         to: '/link',
//       },
//       {
//         title: 'Link',
//         to: '/link',
//       },
//     ],
//   },
//   {
//     title: 'Accessories',
//     to: '/',
//     items: [
//       {
//         title: 'Sunglasses',
//         to: '/link',
//       },
//       {
//         title: 'Keychains',
//         to: '/link',
//       },
//       {
//         title: 'Actual chains',
//         to: '/link',
//       },
//       {
//         title: 'Laces',
//         to: '/link',
//       },
//       {
//         title: 'Link',
//         to: '/link',
//       },
//       {
//         title: 'Link',
//         to: '/link',
//       },
//       {
//         title: 'Link',
//         to: '/link',
//       },
//     ],
//   },
// ];

const menuItems = [
  // note: having these items preloaded here
  // makes sure they don't jump around the page
  // if dynamically loaded
  // {
  //   title: 'Brands',
  //   featured: false,
  //   links: [],
  //   style: {
  //     minWidth: 600,
  //     padding: '12px',
  //     rowGap: 8
  //   }
  // }
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

export function menuItemsToMap(items: any[], nameKey: string): Map<any, {name: string, slug: string}[]> {
  // If no items, return an empty array
  if (!items?.length) return new Map<any, any>();
  // Capitalize the item names
  const itemCharMap = new Map();

  items.sort((a, b)=> a[nameKey] < b[nameKey] ? -1 : a[nameKey] === b[nameKey] ? 0 : 1)

  items.forEach(item=> {
    let char = item[nameKey].charAt(0).toUpperCase();
    let itemName = capitalize(item[nameKey]);
    // if the map already has this char,
    if (itemCharMap.has(char)) {
      // append the new item to the end
      itemCharMap.set(char,
        [
          ...itemCharMap.get(char), {
          name: itemName,
          slug: item.slug,
        },
        ].sort());
    } else {
      // otherwise, set it to the map
      itemCharMap.set(char, [{
        name: itemName,
        slug: item.slug
      }]);
    }
  })

  return itemCharMap;
}

export function getMenuItemLinks(menuItemCharMap: Map<any, {name: string, slug: string}[]>, {
  url,
  withTitle
}){

  // @ts-ignore
  return [...menuItemCharMap.keys()].map(key => {
    return {
      title: withTitle ? key: undefined,
      to: '#',
      items: menuItemCharMap.get(key)?.map(item => ({
        title: capitalize(item.name),
        to: `/${url}/${item.slug}`,
      })),
    }
  });
}
import {env} from '../../config';
import {ProductType} from '../../types';
import {capitalize} from '../../helpers';

export default function(product: ProductType) {
  const brandName = product.brands?.[0].name || 'N/A';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Brand',
        item: `${env.getClientBaseUrl()}/brands/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: capitalize(brandName),
        item: `${env.getClientBaseUrl()}/brands/${brandName.toLowerCase()}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: capitalize(product.name),
        item: `${env.getClientBaseUrl()}/brands/${brandName.toLowerCase()}/${product.slug}`,
      },
    ],
  };
}

export function subProduct(product: ProductType) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(obj => {
      return `${obj.url}`;
    }),
    sku: product.uuid,
    description: product.description.seo,
    offers: {
      '@type': 'Offer',
      url: `${env.getClientBaseUrl()}/product/${product.slug}`,
      priceCurrency: product.currency || 'KSH',
      price: product.originalPrice,
      itemCondition: 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '01/12/2021',
      seller: {
        '@type': 'Organization',
        name: 'Retrobie',
      },
    },
    brand: {
      '@type': 'Thing',
      name: capitalize(product.brands?.[0].name),
    },
  };
}

import {env} from '../../config';

export default function(product, id) {
  if (product && id) {
    const brandName = product.brands?.[0].name || 'N/A';
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Brands',
          item: `${env.getClientBaseUrl()}/brands`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: brandName,
          item: `${env.getClientBaseUrl()}/brands/${brandName.toLowerCase()}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: `${env.getClientBaseUrl()}/brands/${brandName.toLowerCase()}/${id}`,
        },
      ],
    };
  }
}

export function subProduct(product, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(obj => {
      return `${env.getApiBaseUrl()}${obj.url}`;
    }),
    sku: product.id,
    description: product.description.copy,
    offers: {
      '@type': 'Offer',
      url: env.getApiBaseUrl() + url,
      priceCurrency: product.currency || 'KSH',
      price: product.originalPrice,
      itemCondition: 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '01/12/2020',
      seller: {
        '@type': 'Organization',
        name: 'Retrobie',
      },
    },
    brand: {
      '@type': 'Thing',
      name: product.brands?.[0].name || 'Adidas',
    },
  };
}

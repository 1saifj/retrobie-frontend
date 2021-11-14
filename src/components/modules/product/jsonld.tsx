import {env} from '../../../config';
import {ProductType} from '../../../types';
import {capitalize} from '../../../helpers';
import {JsonLd} from 'react-schemaorg';
import {Product} from 'schema-dts';
import React from 'react';

const JSONLD = ({product}: {product: ProductType}) => {
  const brandName = product.brands?.[0].name || 'N/A';

  return (
    <>
      <JsonLd item={{
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
      }} />
      <JsonLd<Product> item={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images.map(obj => `${obj.url}`),
        sku: product.uuid,
        description: product.description.seo,
        brand: {
          '@type': 'Brand',
          name: capitalize(brandName),
        },
        offers: {
          '@type': 'Offer',
          url: `${env.getClientBaseUrl()}/product/${product.slug}`,
          priceCurrency: 'KSH',
          price: product.originalPrice,
          itemCondition: 'https://schema.org/UsedCondition',
          availability: 'https://schema.org/InStock',
          priceValidUntil: '01/12/2022',
          seller: {
            '@type': 'Organization',
            name: 'Retrobie',
          },
        },
      }} />
    </>
  );
};

export default JSONLD;

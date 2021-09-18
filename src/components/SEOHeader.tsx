import React from 'react';
import {Helmet} from 'react-helmet';
import site from '../site-details';
import {env} from '../config';
import {JsonLd} from 'react-schemaorg';
import defaultHelpers from '../helpers';

function SEOHeader(params: {
    description: string,
    title: string,
    path: string,
    jsonld?: any
  }) {

    const metaDescription = params.description || site.siteMetadata.description;

  return (
    <>
      <Helmet
        htmlAttributes={{
          lang: 'en',
        }}
        title={`${(defaultHelpers.titleCase(params.title))}`}
        titleTemplate={`${site.siteMetadata.title} | %s  `}
        link={[
          {
            rel: 'canonical',
            href: env.getClientBaseUrl() + params.path,
          },
        ]}
        meta={[
          {
            name: `description`,
            content: metaDescription,
          },
        ]}
      />

      <JsonLd item={params.jsonld} />

    </>
  );
}

export default SEOHeader;

import React from 'react';
import {Helmet} from 'react-helmet';
import site from '../site-details';
import {env} from '../config';

function SEOHeader(
  {
      description,
      title,
      path
  }:
    {
        description: string,
        title: string,
        path: string
    }
) {

    const metaDescription = description || site.siteMetadata.description;

    return (
        <Helmet
            htmlAttributes={{
                lang: 'en',
            }}
            title={`${title}`}
            titleTemplate={`${site.siteMetadata.title} | %s  `}
            link={[
                {
                    rel: 'canonical',
                    href: env.getClientBaseUrl() + path
                }
            ]}
            meta={[
                {
                    name: `description`,
                    content: metaDescription,
                },
            ]}
        />
    )
}

export default SEOHeader;

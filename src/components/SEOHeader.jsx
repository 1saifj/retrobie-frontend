import React from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import site from '../site-details';
import {env} from '../config';

function SEOHeader({description, author, lang, meta, title, canonicalSlug}) {

    const metaDescription = description || site.siteMetadata.description;

    return (
        <Helmet
            htmlAttributes={{
                lang,
            }}
            title={title}

            titleTemplate={`%s | ${site.siteMetadata.title}`}
            link={[
                {
                    rel: 'canonical',
                    href: `${env.getClientBaseUrl()}product/${canonicalSlug}`
                }
            ]}
            meta={[
                {
                    name: `description`,
                    content: metaDescription,
                },
                {
                    property: `og:title`,
                    content: title,
                },
                {
                    property: `og:description`,
                    content: metaDescription,
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
                {
                    name: `twitter:card`,
                    content: `summary`,
                },
                {
                    name: `twitter:creator`,
                    content: author || site.siteMetadata.author,
                },
                {
                    name: `twitter:title`,
                    content: title,
                },
                {
                    name: `twitter:description`,
                    content: metaDescription,
                },
            ].concat(meta)}
        />
    )
}

SEOHeader.defaultProps = {
    lang: `en`,
    meta: [],
    description: ``,
};

SEOHeader.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
};

export default SEOHeader;

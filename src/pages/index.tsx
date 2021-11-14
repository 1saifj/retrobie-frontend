import React from 'react';
import styled from 'styled-components';
import SEOHeader from '../components/SEOHeader';

import Layout from '../components/Layout';
import PopularProducts from '../components/modules/landing/PopularProducts';
import Categories from '../components/modules/landing/Categories';
import Discover from '../components/modules/landing/Discover';
import Hero from '../components/modules/landing/Hero';
import Newsletter from '../components/modules/landing/Newsletter';
import Values from '../components/modules/landing/Values';
import Perks from '../components/modules/landing/Perks';
import FAQs from '../components/modules/landing/FAQs';

const meta = {
  jsonld: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'image': [
      'https://retrobie.com/logo.png',
    ],
    '@id': 'https://retrobie.com',
    'name': 'Retrobie',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Parklands, Nairobi',
      'addressLocpropsality': 'Nairobi',
      'addressRegion': 'KE',
      'postalCode': '00100',
      'addressCountry': 'KE',
    },
    'review': {
      '@type': 'Review',
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': '4',
        'bestRating': '5',
      },
      'author': {
        '@type': 'Person',
        'name': 'John Baptiste Omollo',
      },
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -1.250,
      'longitude': 36.800,
    },
    'url': 'https://retrobie.com',
    'telephone': '+254-725-538-683',
    'priceRange': '$$$',
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
        ],
        'opens': '08:30',
        'closes': '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        'opens': '08:30',
        'closes': '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': 'Saturday',
        'opens': '08:00',
        'closes': '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': 'Sunday',
        'opens': '08:00',
        'closes': '12:00',
      },
    ],
  },
  description: 'We stock high-quality affordable sneakers, running shoes, sports shoes and classy men\'s shoes in Nairobi. We also accept shoe requests from repeat customers.',
  title: 'Home of Authentic Sneakers & Sports Shoes in Kenya',

};


function Landing() {
  return (
    <Layout style={{maxWidth: '1684px'}}>
      <SEOHeader path={'/'} description={meta.description} title={meta.title} jsonld={meta.jsonld} />

      <Hero />
      <Perks />
      <PopularProducts />
      <Discover />
      {/*<Values />*/}
      <Categories />
      <Newsletter />
      <FAQs />

    </Layout>
  );
}


export default Landing;

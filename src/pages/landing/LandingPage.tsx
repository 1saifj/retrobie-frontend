import React from 'react';
import styled from 'styled-components';
import SEOHeader from '../../components/SEOHeader';

import Layout from '../../components/Layout';
import PopularProducts from './components/PopularProducts';
import Categories from './components/Categories';
import Discover from './components/Discover';
import Hero from './components/Hero';
import Newsletter from './components/Newsletter';
import Values from './components/Values';
import Perks from './components/Perks';
import FAQs from './components/FAQs';

import meta from './meta'


function Landing() {
  return (
    <Layout style={{maxWidth: '1684px'}}>
      <SEOHeader path={'/'} description={meta.description} title={meta.title} jsonld={meta.jsonld} />

      <Hero />
      <Perks />
      <PopularProducts />
      <Discover />
      <Values />
      <Categories />
      <Newsletter />
      <FAQs />

    </Layout>
  );
}


export default Landing;

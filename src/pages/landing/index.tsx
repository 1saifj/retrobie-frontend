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


export const FakeBorder = styled.div`
  background: ${p => (p.color ? p.color : '#004196')};
  width: 100px;
  border-radius: 4px;
  height: 6px;
  margin-top: 8px;
`;


export const ValueProposition = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  justify-content: space-around;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 12px;
    text-align: center;

    @media screen and (max-width: 376px) {
        margin: 12px
    }

    h4 {
      margin-bottom: 6px;
    }

    p {
      margin: 0;
      text-align: center;
    }
  }
`;



export default Landing;

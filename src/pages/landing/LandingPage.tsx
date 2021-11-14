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

import meta from './meta';
import {EmptyState} from '../../components';
import UnderConstructionEmoji from '../../assets/images/emoji/under-construction.png';


function Landing() {
  return (
    <Layout hideNav={true}
            hideFooter={true}
            style={{maxWidth: '1684px'}}>

      <Hero />

      <EmptyState
        icon={UnderConstructionEmoji}
        iconWidth={36}
        message={`We're taking a break to figure 
        things out and make Retrobie better for you. Don't miss us too much ;).`}
        title={'We\'ll be back!'} />

    </Layout>
  );
}


export default Landing;

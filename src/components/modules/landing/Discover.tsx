import React from 'react';
import styled from 'styled-components';
import BrandSlider from './BrandSlider';
import {
  AdidasBlackLogo,
  AirJordanBlackLogo,
  ConverseLogo,
  NikeBlackLogo,
  VansBlackLogo,
  YeezyLogo,
} from '../../../constants/icons';
import RetroImage from '../../image';
import {Container, Section} from 'bloomer';
import DotPattern from '../../../assets/images/vectors/dots.svg';
import {Link} from 'gatsby';

const PopularBrands = () => {
  return (
    <PopularBrandsContainer>
      <div className="header">
        <h2>Discover your favorite brands and collaborations</h2>
      </div>
      <div className="brand-slider--container">
        <BrandSlider
          items={[
            {image: AdidasBlackLogo, link: '/brands/adidas'},
            {image: AirJordanBlackLogo, link: '/brands/jordan'},
            {image: YeezyLogo, link: '/brands/yeezy'},
            {image: NikeBlackLogo, link: '/brands/nike'},
            // {image: AdidasOriginalsLogo, link: '/brands/adidas-originals'},
            // {image: NewBalanceLogo, link: '/brands/new-balance'},
            {image: ConverseLogo, link: '/brands/converse'},
            {image: VansBlackLogo, link: '/brands/vans'},
            // {image: KobeLogo, link: '/brands/kobe'},
            // {image: LebronLogo, link: '/brands/lebron'},
            // {image: AntaLogo, link: '/brands/anta'},
          ]} />
      </div>
    </PopularBrandsContainer>
  );
};

const PopularBrandsContainer = styled.div`
     background: var(--color-background--light);

  .header {
    text-align: center;
  }
  
  .brand-slider--container {
     gap: 16px;
  }

`;

const DiscoveryGrid = () => {
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <BrandImages>
          <Link to={'/brands/converse'} style={{position: 'relative'}}>
            <RetroImage
              className="popular-brand--image"
              style={{maxHeight: 550}}
              id="popularBrandConverse"
              src={'https://ik.imagekit.io/t25/v2/landing/converse-girl_xBGozjXIT.webp?tr=h-540'}
              alt={'woman wearing converse'} />
          </Link>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <RetroImage
              className="popular-brand--image"
              id="popularBrandVansOldSkool"
              src={'https://ik.imagekit.io/t25/v2/landing/vans-old-skool-1_fx5NrnSi6.webp?tr=w-400'}
              alt={'vans old skool'} />

            <RetroImage
              className="popular-brand--image"
              id="popularBrandAirJordan1"
              src={'https://ik.imagekit.io/t25/v2/landing/air-jordan-1_Qtle7cPaS.webp?tr=w-400,ar-3-2'}
              alt={'red black and white air jordan 1'} />
          </div>
          <div>
            <Link to={'/brands/adidas'}>
              <RetroImage
                className="popular-brand--image"
                id="popularBrandAdidas"
                src={'https://ik.imagekit.io/t25/v2/landing/adidas-superstars-1_aUAyIuusI.webp?tr=h-540'}
                alt={'adidas superstars'} />
            </Link>
          </div>

        </BrandImages>
      </div>
    </>
  );
};

function Discover() {

  return (
    <Section style={{background: `url('${DotPattern}')`}} id="app-body">
      <Container style={{paddingTop: 32}}>
        <PopularBrands />
        <DiscoveryGrid />
      </Container>
    </Section>

  );
}

const BrandImages = styled('div')`
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 48px 0;
      
      @media screen and (max-width: 1024px){
        max-width: 90vw;
      }
      
      img {
        padding: 4px;
        object-fit: contain;
        transition: all 0.25s ease-in-out;
        
        &:hover {
          cursor: pointer;
          transform: translateY(-2px) scale(1.01);
      }
       

  }
`;

export default Discover;

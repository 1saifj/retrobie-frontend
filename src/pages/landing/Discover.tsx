import React from 'react';
import styled from 'styled-components';
import BrandSlider from '../../components/slider/BrandSlider';
import { AdidasBlackLogo, AirJordanBlackLogo, ConverseLogo, NikeBlackLogo, YeezyLogo } from '../../constants/icons';
import RetroImage from '../../components/image';
import { useSelector } from 'react-redux';
import { RootStateOrAny } from 'react-redux'

function Discover() {

  const theme = useSelector((state: RootStateOrAny) => state.meta.theme);

  return (
    <div
      style={{paddingTop: 32}}>
      <div
        style={{
          textAlign: 'center',
          background: 'var(--color-background--light)',
        }}>
        <h2>Discover your favorite brands and collaborations</h2>
      </div>
      <div
        style={{
          background: 'var(--color-background--light)',
          gap: 16,
        }}>
        <BrandSlider
          items={[
            {image: AdidasBlackLogo, link: '/brands/adidas'},
            {image: AirJordanBlackLogo, link: '/brands/jordan'},
            {image: YeezyLogo, link: '/brands/yeezy'},
            {image: NikeBlackLogo, link: '/brands/nike'},
            // {image: AdidasOriginalsLogo, link: '/brands/adidas-originals'},
            // {image: NewBalanceLogo, link: '/brands/new-balance'},
            {image: ConverseLogo, link: '/brands/converse'},
            // {image: VansBlackLogo, link: '/brands/vans'},
            // {image: KobeLogo, link: '/brands/kobe'},
            // {image: LebronLogo, link: '/brands/lebron'},
            // {image: AntaLogo, link: '/brands/anta'},
          ]} />
      </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <BrandImages>
          <div style={{position: 'relative'}}>
            <RetroImage
              style={{maxHeight: 550}}
              src={'https://ik.imagekit.io/t25/v2/landing/converse-girl_xBGozjXIT.webp?tr=h-540'}
              alt={'woman wearing converse'} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <RetroImage
              src={'https://ik.imagekit.io/t25/v2/landing/vans-old-skool-1_fx5NrnSi6.webp?tr=w-400'}
              alt={'vans old skool'} />

            <RetroImage
              src={'https://ik.imagekit.io/t25/v2/landing/air-jordan-1_Qtle7cPaS.webp?tr=w-400,ar-3-2'}
              alt={'red black and white air jordan 1'} />
          </div>
          <div>
            <RetroImage
              src={'https://ik.imagekit.io/t25/v2/landing/adidas-superstars-1_aUAyIuusI.webp?tr=h-540'}
              alt={'adidas superstars'} />
          </div>

        </BrandImages>
      </div>
    </div>
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

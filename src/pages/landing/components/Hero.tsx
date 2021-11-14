import React, { useState } from 'react';
import styled from 'styled-components';
import {Button, Column, Columns, Section} from 'bloomer';
import FeaturedSneaker from '../../../assets/images/vectors/featured-sneaker.svg';
import RetroImage from '../../../components/image';
import HowItWorksModal from '../modals/HowItWorksModal';
import RegisterModal from '../modals/RegisterModal';
import {H1, P} from '../../../components/Text/Text';

const images = {
  landing: {
    //The image container has a max-width: 752px;
    //768px -> 576px
    //1024px
    //1216px
    //1408px
    big: 'https://ik.imagekit.io/t25/v2/landing/Air-Jordan-1-Hi-85-Varsity-Red_Ef9VMKOMZ.webp',
    mid3:
      'https://ik.imagekit.io/t25/v2/landing/Air-Jordan-1-Hi-85-Varsity-Red_Ef9VMKOMZ.webp?tr=w-600',
    mid2:
      'https://ik.imagekit.io/t25/v2/landing/Air-Jordan-1-Hi-85-Varsity-Red_Ef9VMKOMZ.webp?tr=w-550',
    mid1:
      'https://ik.imagekit.io/t25/v2/landing/Air-Jordan-1-Hi-85-Varsity-Red_Ef9VMKOMZ.webp?tr=w-500',
    mid:
      'https://ik.imagekit.io/t25/v2/landing/Air-Jordan-1-Hi-85-Varsity-Red_Ef9VMKOMZ.webp?tr=w-450',
    small:
      'https://ik.imagekit.io/t25/v2/landing/Air-Jordan-1-Hi-85-Varsity-Red_Ef9VMKOMZ.webp?tr=w-350',
  },
};

const Hero = () => {

  return (
    <>
      <Section>
        <HeroColumns>
          <Image />
          <Description />
        </HeroColumns>
      </Section>
    </>
  );
};

const Image = () => {
  return (
    <>
      <ImageContainer className='image'>
        <RetroImage
          src={images.landing.big}
          alt=''
          srcSet={{
            srcSet: `
                    ${images.landing.small} 350w,
                    ${images.landing.mid}   450w,
                    ${images.landing.mid2}  500w,
                    ${images.landing.mid3}  550w,
                    ${images.landing.big}   1140w,
                `,
            sizes: `
                    (max-width: 428px) 350px,
                    (max-width: 510px) 450px,
                    (max-width: 630px) 500px,
                    (max-width: 1024px) 550px,
                    1140px
                `,
          }}
        />
      </ImageContainer>
    </>
  );
};

const Description = () => {

  const [isHowItWorksModalActive, setIsHowItWorksModalActive] = useState(false);
  const [isRegisterModalActive, setRegisterModalActive] = useState(false);

  return (
    <>
      <DescriptionContainer>
        <div>

          <header>
            <div style={{width: '48px', marginLeft: '8px'}}>
              <img src={FeaturedSneaker} alt="just a sneaker" />
            </div>
            <small className='secondary'>ABOUT US</small>
          </header>

          <H1>
            Home of <span> authentic,</span> exclusive sneakers and sports shoes in Nairobi
          </H1>

          <div style={{margin: '1rem 0'}}>
            <P fontSize={1.75} className="secondary">
              Find and discover your favorite brands - from Air Jordans to Yeezys -{' '}
              <span>original sneakers</span>,{' '}
              basketball shoes, and many more fashion pieces
              at the best sneaker shop in Nairobi.
            </P>
          </div>
        </div>
        <CTAButtons>
          {/*<Button*/}
          {/*  isColor='primary'*/}
          {/*  id="getStartedButton"*/}
          {/*  onClick={() => setRegisterModalActive(true)}*/}
          {/*>*/}
          {/*  Get started*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  isOutlined*/}
          {/*  id="howItWorksButton"*/}
          {/*  onClick={() => setIsHowItWorksModalActive(true)}*/}
          {/*>*/}
          {/*  Learn more*/}
          {/*</Button>*/}
        </CTAButtons>
        <RegisterModal
          isActive={isRegisterModalActive}
          onClose={() => setRegisterModalActive(false)} />

        <HowItWorksModal
          isActive={isHowItWorksModalActive}
          onClose={() => setIsHowItWorksModalActive(false)} />
      </DescriptionContainer>
    </>
  );
};

const DescriptionContainer = styled(Column)`
  display: flex;
  flex-direction: column;
  max-width: 800px;

  h1 {
    line-height: 78px;
  }
  

  @media (min-width: 320px) and (max-width: 1024px) {
    max-width: 100vw;
    margin-bottom: 24px;
    
    h1 {
      line-height: 55px;
    }
  }

  small {
    font-size: 16px;
    margin-left: 8px;
    font-weight: 600;
  }

  header {
    display: flex;
    align-items: center;
  }

  span {
    font-weight: 600;
    color: var(--color-primary);
  }

`;

const CTAButtons = styled.div`
  display: flex;
  margin-top: 12px;

  button {
    flex: 1 1 150px;
    font-size: 18px;
    padding: 16px 60px;
    height: unset;
    margin: 4px 4px;
    font-weight: bold;
    max-height: 4rem;

    &:hover {
      box-shadow: 0 3px 12px 2px rgba(0, 0, 0, 0.16);
    }
  }

  @media screen and (max-width: 1024px) {
    padding: 0;
    flex-direction: column;

    button {
      margin-left: 0;
    }
  }
  
`;

const ImageContainer = styled(Column)`
    margin: 0 auto;
    min-height: 350px;

    img {
      border-radius: 6px;
      object-fit: contain;
      height: 100%;
    }
    
    @media screen and (max-width: 1024px) {
      .image {
        display: flex;
        align-self: center;
        height: unset;
        margin-bottom: 24px;
  
        img {
          width: 100%;
        }
      }
  
      img {
        margin-right: auto;
        margin-left: auto;
      }
    }
`;

const HeroColumns = styled(Columns)`
  display: flex;
  align-items: center;
  min-height: 75vh;
  overflow: hidden;
  text-align: left;
  position: relative;
  justify-content: space-around;

  span {
    font-weight: 600;
    color: var(--color-primary);
  }

  h1,
  header {
    margin: 0;
  }

  h4 {
    margin: 0;
  }

  & > img {
    max-width: 64px;
  }


  @media screen and (max-width: 1024px) {
    background: none;
    padding-bottom: 0;
    flex-direction: column;

    h1,
    p,
    header {
      margin: 0;
    }
  }
`;

export default Hero;

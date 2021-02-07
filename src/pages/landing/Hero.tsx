import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Column, Columns } from 'bloomer';
import FeaturedSneaker from '../../../public/assets/images/vectors/featured-sneaker.svg';
import RetroImage from '../../components/image';

const Hero = props => {
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

  const [imageState] = useState(images);

  function scrollToAppBody() {
    let appBody = document.getElementById('app-body');
    appBody.scrollIntoView();
  }

  function getScreenWidth() {
    return window.screen.availWidth;
  }

  return (
    <>
      <HeroSection>
        <Column className={'image'}>
          <div>
            <RetroImage
              src={imageState.landing.big}
              alt=''
              srcSet={{
                srcSet: `
                    ${imageState.landing.small} 350w,
                    ${imageState.landing.mid}   450w,
                    ${imageState.landing.mid2}  500w,
                    ${imageState.landing.mid3}  550w,
                    ${imageState.landing.big}   1140w,
                `,
                sizes: `
                    (max-width: 428px) 350px,
                    (max-width: 510px) 450px,
                    (max-width: 630px) 500px,
                    (max-width: 1024px) 550px,
                    1140px
                `
              }}
            />
            {/*<picture>*/}
            {/*  <source media={'(max-width:428px)'} srcSet={imageState.landing.small} />*/}
            {/*  <source media={'(max-width:510px)'} srcSet={imageState.landing.mid} />*/}
            {/*  <source media={'(max-width:630px)'} srcSet={imageState.landing.mid2} />*/}
            {/*  <source media={'(max-width:1024px)'} srcSet={imageState.landing.mid3} />*/}
            {/*  <img src={imageState.landing.big} alt={'landing page'} />*/}
            {/*</picture>*/}
          </div>
        </Column>
        <Column className={'description'}>
          <div>
            <header>
              <div style={{ width: '48px', marginLeft: '8px' }}>
                <img src={FeaturedSneaker} alt="just a sneaker" />
              </div>
              <small className={'secondary'}>ABOUT US</small>
            </header>
            <h1>
              Home of <span> authentic </span> sneakers and apparel
            </h1>
            <p className={'secondary'}>
              Find and discover the best brands and <span> original </span> designer shoes, hoodies,
              t-shirts and many more fashion pieces from all over the world.
            </p>
          </div>
          <div className={'ctas'}>
            <Button
              isColor={'primary'}
              style={{
                margin: '4px 4px',
              }}
              onClick={() => scrollToAppBody()}
            >
              Get started
            </Button>
            <Button
              isOutlined
              style={{ margin: '4px 4px', minWidth: '200px' }}
              onClick={() => scrollToAppBody()}
            >
              Learn more
            </Button>
          </div>
        </Column>
      </HeroSection>
    </>
  );
};

Hero.propTypes = {};

const HeroSection = styled(Columns)`
  display: flex;
  align-items: center;
  min-height: 75vh;
  overflow: hidden;
  text-align: left;
  position: relative;
  justify-content: space-around;

  span {
    font-weight: 600;
    color: var(--color-accent);
  }

  h1,
  p,
  header {
    margin: 0;
    padding: 8px 16px;
  }

  h4 {
    margin: 0;
  }

  & > img {
    max-width: 64px;
  }

  .description {
    display: flex;
    flex-direction: column;
    max-width: 800px;

    p {
      font-size: 28px;
      line-height: normal;
    }

    h1 {
      font-size: 5em;
      line-height: 78px;
    }

    @media (min-width: 320px) and (max-width: 1024px) {
      max-width: 100vw;
      h1 {
        font-size: 4em;
        line-height: 55px;
      }

      p {
        font-size: 24px;
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

    .ctas {
      display: flex;
      margin-top: 12px;
      padding: 8px 16px;

      button {
        margin-left: 0;
        font-size: 18px;
        padding: 16px 60px;
        height: unset;

        &:hover {
          box-shadow: 0 3px 12px 2px rgba(0, 0, 0, 0.16);
        }
      }

      @media screen and (max-width: 1024px) {
        padding: 0;
      }
    }

    span {
      font-weight: 600;
      color: var(--color-primary);
    }
  }

  .image {
    margin: 0 auto;
    min-height: 350px;

    img {
      border-radius: 6px;
      object-fit: contain;
      height: 100%;
    }
  }

  @media screen and (max-width: 1024px) {
    background: none;
    padding-bottom: 0;
    flex-direction: column;

    h1,
    p,
    header {
      margin: 0;
      padding: 8px 4px;
    }

    .image {
      display: flex;
      align-self: center;
      height: unset;
      margin-bottom: 24px;

      img {
        width: 100%;
      }
    }

    .description {
      width: 90%;
      margin-bottom: 24px;

      .ctas {
        flex-direction: column;

        button {
          margin-left: 0;
        }
      }
    }

    img {
      margin-right: auto;
      margin-left: auto;
    }
  }
`;

export default Hero;

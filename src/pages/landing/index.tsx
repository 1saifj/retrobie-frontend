import React from 'react';
import styled from 'styled-components';
import SEOHeader from '../../components/SEOHeader';

import {Button, Container, Input, Section} from 'bloomer';
import Return from '../../../src/assets/images/icons/return.svg';
import FastDelivery from '../../../src/assets/images/icons/delivery.svg';
import FreePickups from '../../../src/assets/images/icons/pickup.svg';
import Shield from '../../../src/assets/images/icons/guarantee.svg';
import Fire from '../../../src/assets/images/icons/fire.svg';
import Blob from '../../assets/images/vectors/blob.svg';
import Blob2 from '../../assets/images/vectors/blob-2.svg';
import Orbit from '../../assets/images/icons/orbit.svg';
import WinkingEmoji from '../../assets/images/emoji/wink.webp';

import jsonld from './jsonld';

import {MPesaLogo} from '../../constants/icons';
import {JsonLd} from 'react-schemaorg';
import Layout from '../../components/Layout';
import PopularProducts from './PopularProducts';
import Scope from '../../../src/assets/images/vectors/DancingDoodle.svg';
import Expression from '../../../src/assets/images/vectors/SelfieDoodle.svg';
import Authenticity from '../../../src/assets/images/vectors/LovingDoodle.svg';
import Originality from '../../../src/assets/images/vectors/RollingDoodle.svg';
import Categories from './Categories';
import Discover from './Discover';
import Hero from './Hero';
import DotPattern from '../../assets/images/patterns/dots.svg';

const LoaderParent = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  padding: 4px;
  background: gray;
`;

function Landing({ history }) {
  return (
    <Layout style={{ maxWidth: '1684px' }}>
      <SEOHeader
        title={'The Home of Authentic Sneakers & Sports Shoes in Kenya'}
      />
      <JsonLd item={jsonld()} />
      <div
        style={{
          display: 'grid',
          alignItems: 'center',
          marginTop: '64px',
          position: 'relative',
        }}
      >
        <Section>
          <Hero />
        </Section>
      </div>
      <Section>
        <div style={{ textAlign: 'center' }}>
          <h1>Enjoy the perks of shopping with us</h1>
        </div>
        <ValueProposition>
          <div>
            <img style={{ width: '48px' }} src={Return} alt={'easy payment'} />
            <h4>Free Returns</h4>
            <p>Within 7 days of delivery.</p>
          </div>
          <div>
            <img style={{ width: '48px' }} src={FastDelivery} alt={'Free Delivery'} />
            <h4>Next-day Delivery</h4>
            <p>Anywhere within Nairobi</p>
          </div>
          <div>
            <img style={{ width: '48px' }} src={FreePickups} alt={'easy payment'} />
            <h4>Free pickups</h4>
            <p>At selected points within the CBD.</p>
          </div>
          <div>
            <img style={{ width: '48px' }} src={Shield} alt={'easy payment'} />
            <h4>100% Quality Guarantee</h4>
            <p>It's real deal or no deal.</p>
          </div>
        </ValueProposition>
      </Section>

      <Section>
        <Container>
          <div>
            <div style={{ textAlign: 'center' }}>
              <img src={Fire} alt={'fire'} style={{ width: '64px' }} />

              <h2>Popular Right Now.</h2>
              <p>Not sure where to start? Check out the most popular brands and models</p>
            </div>
            <div>
              <PopularProducts />
            </div>
          </div>
        </Container>
      </Section>

      <Section style={{ background: `url('${DotPattern}')` }} id="app-body">
        <Container>
          <Discover />
        </Container>
      </Section>

      <Section className="fancy">
        {/*language=CSS*/}
        <style>{`
          .fancy {
            background-color: #f5f6f7;
            background: url(${Blob2}), url(${Blob});
            background-repeat: no-repeat, no-repeat;
            background-position: 113% center, -33% center;
            background-size: contain;
          }

          @media screen and (max-width: 1216px) {
            .fancy {
              background: url(${Blob2});
              background-position: 50% center;
              background-size: cover;
            }
          }
        `}</style>
        <Container>
          <div style={{ padding: '24px 0', display: 'flex' }}>
            <img
              src={Orbit}
              alt="stand for something"
              style={{ width: 65, alignSelf: 'flex-start', padding: 8 }}
            />
            <div>
              <h2 style={{marginBottom: 0}}>What we stand for</h2>
              <p>
                Every member of the Retrobie team works and
                operates on a set of core values
              </p>
            </div>
          </div>
          <Values>
            <div>
              <img src={Scope} alt={'fire'} style={{ width: '100%' }} />
              <h4>Discovery</h4>
              <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
            <div>
              <img src={Expression} alt={'fire'} style={{ width: '100%' }} />
              <h4>Self-Expression</h4>
              <div>
                <p>Duis gravida dignissim elit ut vehicula. Morbi pellentesque eleifend feugiat.</p>
              </div>
            </div>
            <div>
              <img src={Authenticity} alt={'fire'} style={{ width: '100%' }} />
              <h4>Authenticity</h4>
              <div>
                <p>
                  Suspendisse ullamcorper odio congue urna porta lobortis. Donec id molestie lacus.
                </p>
              </div>
            </div>
            <div>
              <img src={Originality} alt={'fire'} style={{ width: '100%' }} />
              <h4>Originality</h4>
              <div>
                <p>Maecenas consequat felis nec ipsum lobortis, eget tincidunt dolor auctor.</p>
              </div>
            </div>
          </Values>
        </Container>
      </Section>

      <Section>
        <Container>
          <Categories />
        </Container>
      </Section>
      {/*<Section>*/}
      {/*    <Container>*/}
      {/*        <Collections/>*/}
      {/*    </Container>*/}
      {/*</Section>*/}

      <Section>
        <Container>
          <Partners>
            <h2 style={{ margin: 0 }}>We accept</h2>
            <div className="images">
              <div>
                <img title="M-Pesa" src={MPesaLogo} alt="mpesa logo" />
              </div>
            </div>
          </Partners>
        </Container>
        <div>
          <Container>
            <CallToAction>
              <div className={'images'}>
                <img
                  src={'https://ik.imagekit.io/t25/v2/landing/coffee_ZF-vC31Vp.gif'}
                  alt={'coffee'}
                />
              </div>
              <div id="mc_embed_signup" style={{ display: 'flex', alignItems: 'center' }}>
                <form
                  action="https://store.us15.list-manage.com/subscribe/post?u=6ec31ce43b70efd818395b2ae&amp;id=159a07cdbd"
                  method="post"
                  id="mc-embedded-subscribe-form"
                  name="mc-embedded-subscribe-form"
                  className="validate"
                  target="_blank"
                  noValidate
                >
                  <div id="mc_embed_signup_scroll">
                    <h2>You'll love our newsletter like you love your coffee.</h2>
                    <div>
                      <div>
                        <p>
                          If you've got good taste (of course you do), you'll love our newsletter
                          <span>
                            <img
                              style={{ width: '16px', verticalAlign: 'sub' }}
                              src={WinkingEmoji}
                              alt={'winking emoji'}
                            />
                          </span>
                          .
                        </p>
                        <p>
                          We publish a blog post or two every week with helpful tidbits and the
                          latest trends on the market
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="cta--input">
                        <Input
                          placeholder="you@gmail.com"
                          type="email"
                          defaultValue=""
                          name="EMAIL"
                          className="input required email"
                          id="mce-EMAIL"
                        />
                        <Button
                          isColor="primary"
                          style={{ padding: '10px 24px', fontSize: '14px' }}
                          defaultValue="Subscribe"
                          name="subscribe"
                          id="mc-embedded-subscribe"
                        >
                          Get Started
                        </Button>
                      </div>
                    </div>
                    <div id="mce-responses" className="clear">
                      <div className="response" id="mce-error-response" style={{ display: 'none' }} />
                      <div
                        className="response"
                        id="mce-success-response"
                        style={{ display: 'none' }}
                      />
                    </div>
                    <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                      <input
                        type="text"
                        name="b_6ec31ce43b70efd818395b2ae_159a07cdbd"
                        tabIndex={-1}
                        defaultValue=""
                      />
                    </div>
                  </div>
                </form>
              </div>
            </CallToAction>
          </Container>
        </div>
      </Section>

      <Section>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <h2>Do you still have questions?</h2>
            <Button isColor="primary" onClick={() => history.push('/support')}>
              Check out the FAQs
            </Button>
          </div>
        </Container>
      </Section>
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

const Partners = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .images {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    & > div {
      display: flex;
      align-items: center;
    }

    img {
      width: 150px;
      margin-right: 12px;
      object-fit: contain;
      border-radius: 4px;
      padding: 12px;
    }
  }
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

const Values = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & > div {
    text-align: center;
    max-width: 250px;

    @media screen and (max-width: 1024px) {
      max-width: 200px;
    }
  }

  @media screen and (max-width: 720px) {
    justify-content: center;
  }
`;

const CallToAction = styled('div')`
  display: grid;
  grid-template-columns: 1fr 2fr;

  input {
    min-width: 250px;
  }

  .images {
    display: flex;
    justify-content: center;

    img {
      margin: 0 8px;
    }
  }

  .cta--input {
    display: flex;
    align-items: center;
    min-width: 250px;
    width: 100%;
    max-width: 600px;

    input {
      margin-right: 24px;
    }
    
    @media screen and (max-width: 768px) {
        flex-direction: column;

        input {
            margin-bottom: 12px;
            margin-right: 0;
        }
    }
  }

  a {
    margin: 0 8px;
    display: inline-block;
    transition: all 0.25s ease-in-out;
    padding: 0 8px;
    background-repeat: no-repeat;
    background-position: 0 90%;
    background-size: 100% 5px;

    &:hover {
      background-size: 100% 100%;
      color: white;
    }
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: unset;

    img {
      max-width: 260px;
    }
  }

  @media (min-width: 320px) and (max-width: 480px) {
    a {
      display: block;
      margin: 0;
    }
  }
`;

export default Landing;

import React from 'react';
import Layout from '../components/Layout';
import {SupportParent} from './policies/shipping-policy';
import SEOHeader from '../components/SEOHeader';
import {LandingImage1, LandingImage2, LandingImage3, Listing, Plane, Verify} from '../constants/icons';
import styled from 'styled-components';
import {Card, Container, Section} from 'bloomer';

function About() {
  return (
    <Layout>
      <SEOHeader
        title={'About us'}
        path={'/company/about-us'}
        description={
          'Retrobie is a premium online sneaker store in Nairobi offering great deals on new and second-hand shoes.'
        }
      />
      <div>
        <MainCopy>
          <Section>
            <Container>
              <img
                style={{width: '100%', maxWidth: '400px'}}
                src={LandingImage2}
                alt={'image of jordans'}
              />
              <h2 style={{color: 'white'}}>No More Fake Jordans. No More Counterfeit Yeezys.</h2>
              <h4 style={{color: 'white'}}>It's What We're All About.</h4>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{maxWidth: '800px'}}>
                  <p>
                    The 2500 Store (T25) was created to serve the needs of people like you. People
                    in search of good-quality shoes but met instead with the same tired imitations
                    at every turn. We'll help you realize
                    <span className={'accented'}>
                        {' '}
                      &nbsp; what it means to be original. &nbsp;{' '}
                      </span>
                  </p>
                  <p>
                    We deliver high-quality, authentic shoes delivered right to your doorstep.
                  </p>
                  <p>Take a look around. You'll love it.</p>
                </div>
              </div>
            </Container>
          </Section>
        </MainCopy>
        <SupportParent>
          <Container>
            <div>
              <div>
                <h1>Who are we?.</h1>
                <p>
                  The 2500 Store (T25 for short) is an <b>online store</b> that facilitates the
                  delivery of <b>quality</b>, <b>authentic</b> shoes to you - the shoe lover. We
                  strive to this in a timely and affordable manner that's convenient to both you
                  and us.
                </p>
              </div>
              <div>
                <h3>How does it work?</h3>
                <p>
                  We source shoes from all over the country and all over the globe - China, the
                  United States, Vietnam and Bangladesh and within Kenya itself. We <b>only</b>{' '}
                  stock <b>authentic</b> shoes, or otherwise within a reasonable margin of
                  authenticity. That margin is defined by:
                  <ul>
                    <li>Materials used to make the shoes.</li>
                    <li>Estimated longevity.</li>
                  </ul>
                  All products stocked on our platform are inspected by professionals before being
                  listed for sale.
                </p>
                <a href={'#'}>Learn more.</a>
              </div>
              <div>
                <h3>What kind of shoes do we stock?</h3>
                <div>
                  <h4>New/Like-new</h4>
                  <p>
                    Most of the shoes on our platform are either <b>new</b> or{' '}
                    <b>
                      <em>reasonably new</em>
                    </b>
                    . That is:
                    <ul>
                      <li>
                        Every part of the shoe is intact
                        <ul>
                          <li>The sole is not worn out in any places.</li>
                          <li>
                            The tongue is not damaged. Readings on the tongue (eg. size, country
                            of origin) should be easy to read.
                          </li>
                          <li>The laces are not frilled.</li>
                        </ul>
                        <em>All shoes that do not meet these criteria are heavily subsidized.</em>
                      </li>
                    </ul>
                  </p>
                </div>
                <div>
                  <h4>Mitumba/Refurbished shoes</h4>
                  <p>
                    The second category of shoes available on our platform are <b>refurbished</b>{' '}
                    shoes. Popularly known as
                    <b>
                      <em>mitumba</em>
                    </b>
                    .
                  </p>
                  <p>
                    These are either sourced locally or abroad and are often significantly cheaper
                    than their new and like-new counterparts.
                  </p>
                </div>
              </div>
              <div>
                <h3>Can you trust us?</h3>
                <p>
                  We aim to be as transparent as possible every step of the way. Some of the
                  measures we've taken to ensure you feel comfortable with the purchase process
                  include:
                  <ul>
                    <li>Providing original photos of the products alongside marketing photos.</li>
                    <li>
                      Providing links to the original product, if still stocked by the
                      manufacturers
                    </li>
                    <li>
                      Providing side-by-side comparisons of real and fake products to teach
                      customers how to identify them.
                    </li>
                    <li>
                      Ultimately, if you're dissatisfied with the product delivered,{' '}
                      <b>returns are free</b>
                    </li>
                  </ul>
                </p>
              </div>
              <div>
                <h3>The Team</h3>
                <p>
                  Retrobie is currently a solo venture run by me, Bradley, a self-taught developer
                  and lover of all things to do with shoes and fashion.
                </p>

                <div style={{textAlign: 'center'}}>
                  <div style={{maxWidth: '500px', margin: '0 auto'}}>
                    <img
                      style={{width: '100%'}}
                      src="https://ik.imagekit.io/t25/IMG_20200201_145532_UnWBwguSb.jpg?tr=w-1000"
                      alt="moi"
                    />
                  </div>
                  <small>By far the most official photo I could find.</small>
                </div>

                <p>
                  So, who am I? A code junkie, basketball player, and sneakers lover (obviously).
                  When I'm not doing any of those, I'm probably looking for ways to make this site
                  even better, browsing memes on Reddit or shitposting on Twitter.
                </p>

                <p>
                  Want to have a chat? Have suggestions? Questions? Memes? A photo of your cat
                  being a complete derp? I'm in! Hit me up on Twitter{' '}
                  <a href="https://twitter.com/bradleykingz">@bradleykingz</a>. I'm basically
                  always online.
                </p>
              </div>
            </div>
          </Container>
        </SupportParent>
        <Section>
          <HowItWorksLanding>
            <div style={{maxWidth: '800px'}}>
              <div>
                <h2>How it Works</h2>
                <p>
                  The 2500 is an online store for purchasing some of the most popular clothing
                  brands in the world. We source and partner with local and international partners
                  to ensure only the best quality items arrive at your doorstep.
                </p>
                <div className={'copy'}>
                  <div className={'copy--image'}>
                    <img
                      className={'desktop'}
                      src={LandingImage1}
                      alt={'air jordan one kenya'}
                    />
                    <div className={'mobile'}>
                      <img src={LandingImage3} alt={'kobe proto 5 kenya'}/>
                    </div>
                  </div>
                  <div className={'process'}>
                    <Card>
                      <img src={Plane} style={{width: '64px'}}/>
                      <h4>Sourcing</h4>
                      <p>
                        We track down shoes we think you will like from local markets - Gikomba
                        and other local shops.
                      </p>
                    </Card>
                    <Card>
                      <img src={Verify} style={{width: '64px'}}/>

                      <h4>Verification</h4>
                      <p>
                        All our shoes undergo a verification process to ensure they are the real
                        deal.
                      </p>
                    </Card>
                    <Card>
                      <img src={Listing} style={{width: '64px'}}/>

                      <h4>Listing</h4>
                      <p>The product is made available to the customer for order and delivery.</p>
                    </Card>
                  </div>
                </div>
              </div>
              {/*<div>*/}
              {/*    <h3>Third-party sellers.</h3>*/}
              {/*    <p>*/}
              {/*        Once in a while, we are approached by brands and business interested in listing*/}
              {/*        their products on our store. We often work with third-party sellers to help*/}
              {/*        promote their brands.*/}
              {/*    </p>*/}
              {/*    <p>*/}
              {/*        These brands also undergo the vetting and verification process to ensure*/}
              {/*        everything meets our strict criteria.*/}
              {/*    </p>*/}
              {/*</div>*/}
            </div>
          </HowItWorksLanding>
        </Section>
      </div>
    </Layout>
  );
}

export default About;

const HowItWorksLanding = styled.div``;

const MainCopy = styled.div`
  background-image: linear-gradient(
    to right top,
    #004196,
    #013a8d,
    #013384,
    #012c7c,
    #012573,
    #012573,
    #012573,
    #012573,
    #012c7c,
    #013384,
    #013a8d,
    #004196
  );
  width: 100%;
  text-align: center;

  p {
    color: white;
  }
`;

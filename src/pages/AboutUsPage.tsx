import React, {useEffect} from 'react';
import Layout from '../components/Layout';
import SEOHeader from '../components/SEOHeader';
import {LandingImage2, Listing, Plane, Verify} from '../constants/icons';
import styled from 'styled-components';
import {Card, Container, Section} from 'bloomer';
import posthog from 'posthog-js';

function AboutUsPage() {

  useEffect(() => {
    posthog.capture('visited about us page');
  }, []);

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
          <Section style={{paddingBottom: '6rem'}}>
            <Container style={{textAlign: 'center'}}>
              <img
                style={{width: '100%', maxWidth: '400px'}}
                src={LandingImage2}
                alt={'image of jordans'}
              />
              <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'left'}}>
                <h1 style={{color: 'white'}}>No More Fake Jordans. No More Counterfeit Yeezys.</h1>
                <h4 style={{color: 'white'}}>What We're All About.</h4>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <div style={{textAlign: 'left'}}>
                    <p>
                      Retrobie was created to serve the needs of people like you. People
                      in search of good-quality shoes but met instead with the same tired imitations
                      at every turn. We'll help you realize
                      <em style={{color: 'white'}}>
                        {' '}what it means to be original.{' '}
                      </em>
                    </p>
                    <p>
                      We deliver high-quality, authentic shoes delivered right to your doorstep.
                    </p>
                    <p>Take a look around. You'll love it.</p>
                  </div>
                </div>
              </div>

            </Container>
          </Section>
        </MainCopy>
        <>
          <WhoWeAreContainer style={{marginTop: '2rem'}}>
            <div>
              <div>
                <h1>Who are we?</h1>
                <p>
                  Retrobie is an <b>online store</b> that facilitates the
                  delivery of <b>quality</b>, <b>authentic</b> shoes to you - the shoe lover. We
                  strive to this in a timely and affordable manner that's convenient to both you
                  and us.
                </p>
              </div>
              <div>
                <h3>What inspired the idea?</h3>

                <p>
                  Retrobie was first concieved when I ran into an old friend of that introduced me
                  to the beauty of original shoes. The difference between they and their Chinese
                  counterparts are night and day.
                </p>

                <p>
                  I've been pushing an old pair
                  of <span className={'accented'}>Nike Court Force</span> shoes for close to 4 years now, and another
                  pair of
                  Adidas Superstars for around the same amount of time.
                </p>

                <p>
                  That's two more years (and counting!) than the kinds of shoes I was used
                  to buying and wearing.
                </p>

                <p>
                  So, what's a man to do? <em>Share that beauty with the world, of course.</em>
                </p>

                <div style={{textAlign: 'center'}}>
                  <div style={{maxWidth: '500px', margin: '0 auto'}}>
                    <img
                      className={'me'}
                      src="https://ik.imagekit.io/t25/illustrations/IMG_20200201_145532_QlIG1PiIL.png"
                      alt="moi"
                    />
                  </div>
                  <small>By far the most official photo I could find. (Forgive the crappy cropping. An AI did
                    it)</small>
                </div>

                <p>
                  So, who am I? A code junkie, basketball player, and sneaker lover (obviously).
                  When I'm not doing any of those, I'm probably looking for ways to make this site
                  even better, browsing memes on Reddit or shitposting on Twitter.
                </p>

                <p>
                  Want to have a chat? Have suggestions? (I appreciate feedback
                  big time, btw :))) Questions? Memes? A photo of your cat
                  being a complete derp? I'm in! Hit me up on Twitter{' '}
                  <a href="https://twitter.com/bradleykingz">@bradleykingz</a>. I'm basically
                  always online.
                </p>
              </div>

              {/*<div>*/}
              {/*  <h3>How does it work?</h3>*/}
              {/*  <p>*/}
              {/*    We source shoes from all over the country and all over the globe - China, the*/}
              {/*    United States, Vietnam and Bangladesh and within Kenya itself. We <b>only</b>{' '}*/}
              {/*    stock <b>authentic</b> shoes, or otherwise within a reasonable margin of*/}
              {/*    authenticity. That margin is defined by:*/}
              {/*    <ul>*/}
              {/*      <li>Materials used to make the shoes.</li>*/}
              {/*      <li>Estimated longevity.</li>*/}
              {/*    </ul>*/}
              {/*    All products stocked on our platform are inspected by professionals before being*/}
              {/*    listed for sale.*/}
              {/*  </p>*/}
              {/*  <a href={'#'}>Learn more.</a>*/}
              {/*</div>*/}
              {/*<div>*/}
              {/*  <h3>Can you trust us?</h3>*/}
              {/*  <p>*/}
              {/*    We aim to be as transparent as possible every step of the way. Some of the*/}
              {/*    measures we've taken to ensure you feel comfortable with the purchase process*/}
              {/*    include:*/}
              {/*    <ul>*/}
              {/*      <li>Providing original photos of the products alongside marketing photos.</li>*/}
              {/*      <li>*/}
              {/*        Providing links to the original product, if still stocked by the*/}
              {/*        manufacturers*/}
              {/*      </li>*/}
              {/*      <li>*/}
              {/*        Providing side-by-side comparisons of real and fake products to teach*/}
              {/*        customers how to identify them.*/}
              {/*      </li>*/}
              {/*      <li>*/}
              {/*        Ultimately, if you're dissatisfied with the product delivered,{' '}*/}
              {/*        <b>returns are free</b>*/}
              {/*      </li>*/}
              {/*    </ul>*/}
              {/*  </p>*/}
              {/*</div>*/}
            </div>
          </WhoWeAreContainer>
        </>
        <Section>
          <HowItWorksLanding>
            <div>
              <div>
                <h2>How it Works</h2>
                <p>
                  Retrobie sources and partners from local suppliers, then
                  thoroughly inspects and verifies every model uploaded to our
                  store is legit.
                </p>
                <p>
                  Only the best quality items arrive at your doorstep.

                </p>
                <div className={'copy'}>
                  <ProcessParent>
                    <Card>
                      <img src={Plane} style={{width: '64px'}} />
                      <h4>Sourcing</h4>
                      <p>
                        We track down shoes we think you will like from local markets - Gikomba
                        and other local shops.
                      </p>
                    </Card>
                    <Card>
                      <img src={Verify} style={{width: '64px'}} />

                      <h4>Verification</h4>
                      <p>
                        All our shoes undergo a verification process to ensure they are the real
                        deal.
                      </p>
                    </Card>
                    <Card>
                      <img src={Listing} style={{width: '64px'}} />

                      <h4>Listing</h4>
                      <p>The product is made available to the customer for order and delivery.</p>
                    </Card>
                  </ProcessParent>
                </div>
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

const ProcessParent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  
  .card {
    padding: 2rem 1rem;
  }
`;

export default AboutUsPage;

const HowItWorksLanding = styled.div``;

const WhoWeAreContainer = styled(Container)`
  .me {
    width: 250px;
    margin-top: 0rem;
    border-radius: 50%;
    background: var(--color-background--dark);
    height: 250px;
    object-fit: contain;
  }

`;

const MainCopy = styled.div`
  background-image: linear-gradient(
    to right top,
    var(--color-primary),
    var(--color-primary-dark),
    var(--color-primary-light)
  );
  width: 100%;
  

  p {
    color: white;
  }
`;

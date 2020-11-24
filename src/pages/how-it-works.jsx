import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import {
  AirJordanWhiteLogo,
  LandingImage2,
  Listing,
  NikeWhiteLogo,
  Plane,
  VansWhiteLogo,
  Verify,
  YeezyLogo,
} from '../constants/icons';
import {Box} from 'bloomer';

class HowItWorks extends React.Component {
  render() {
    return (
      <Layout>
        <HowItWorksLanding>
          <div style={{maxWidth: '800px'}}>
            <div>
              <h2>How it Works</h2>
              <p>
                The 2500 is an online store for purchasing some of the most popular clothing brands
                in the world. We source and partner with local and international partners to ensure
                only the best quality items arrive at your doorstep.
              </p>
              <div className={'process'}>
                <Box>
                  <img src={Plane} style={{width: '64px'}} />
                  <h4>Sourcing</h4>
                  <p>
                    We track down shoes we think you will like from local markets - Gikomba and
                    other local shops.
                  </p>
                </Box>
                <Box>
                  <img src={Verify} style={{width: '64px'}} />

                  <h4>Verification</h4>
                  <p>
                    All our shoes undergo a verification process to ensure they are sufficiently
                    similar to the real thing.
                  </p>
                </Box>
                <Box>
                  <img src={Listing} style={{width: '64px'}} />

                  <h4>Listing</h4>
                  <p>The product is made available to the customer for order and delivery.</p>
                </Box>
              </div>
            </div>
            <div>
              <h3>Third-party sellers.</h3>
              <p>
                Once in a while, we are approached by brands and business interested in listing
                their products on our store. We often work with third-party sellers to help promote
                their brands.
              </p>
              <p>
                These brands also undergo the vetting and verification process to ensure everything
                meets our strict criteria.
              </p>
            </div>
          </div>
          {/*<div>*/}
          {/*    <div>*/}
          {/*        <h2>How It Works</h2>*/}
          {/*        <p>Not sure how to get started? Here's how it works</p>*/}

          {/*        <p style={{color: "#353535"}}>*/}
          {/*            Buying stuff on our store is a simple 5-step process. If you're still confused*/}
          {/*            after this, feel free to reach us at customer.support@retrobie.com. We're always online.*/}
          {/*        </p>*/}
          {/*    </div>*/}

          {/*    <div style={{display: 'flex'}}>*/}
          {/*        <img src={SoundWave} style={{width: "64px", marginRight: "12px"}}/>*/}
          {/*        <div>*/}
          {/*            <h4 style={{marginBottom: 0}}>Step 1</h4>*/}
          {/*            <p style={{color: "#353535"}}>Find Something you vibe with.</p>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <div style={{display: 'flex'}}>*/}
          {/*        <img src={CartLove} style={{width: "64px", marginRight: "12px"}}/>*/}
          {/*        <div>*/}
          {/*            <h4 style={{marginBottom: 0}}>Step 2</h4>*/}
          {/*            <p style={{color: "#353535"}}>Add it to your cart</p>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <div style={{display: 'flex'}}>*/}
          {/*        <img src={DeliveryLocation} style={{width: "64px", marginRight: "12px"}}/>*/}
          {/*        <div>*/}
          {/*            <h4 style={{marginBottom: 0}}>Step 3</h4>*/}
          {/*            <p style={{color: "#353535"}}>Pick a delivery location convenient for you.</p>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <div style={{display: 'flex'}}>*/}
          {/*        <img src={DeliveryA} style={{width: "64px", marginRight: "12px"}}/>*/}
          {/*        <div>*/}
          {/*            <h4 style={{marginBottom: 0}}>Step 3</h4>*/}
          {/*            <p style={{color: "#353535"}}>Wait for the deliveryman or pick up your order*/}
          {/*                directly.</p>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <div style={{display: 'flex'}}>*/}
          {/*        <img src={CoolPeach} style={{width: "64px", marginRight: "12px"}}/>*/}

          {/*        <div>*/}
          {/*            <h4>Step 5</h4>*/}
          {/*            <p style={{color: "#353535"}}>*/}
          {/*                Rock your new kicks and keep being a cool peach. You earned it.*/}
          {/*            </p>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <div style={{display: 'flex'}}>*/}
          {/*        <img src={Party} style={{width: "64px", marginRight: "12px"}}/>*/}

          {/*        <div>*/}
          {/*            <h4>Step 5: Profit??</h4>*/}
          {/*            <p style={{color: "#353535"}}>Pop one on us, and spread the word if you enjoyed*/}
          {/*                the experience.</p>*/}
          {/*        </div>*/}
          {/*    </div>*/}

          {/*    <p style={{textAlign: 'center'}}>*/}
          {/*        Still have questions?*/}
          {/*        &nbsp;*/}
          {/*        <Button appearance={'ghost'}*/}
          {/*                onClick={() => this.props.history.push("/support")}>*/}
          {/*            Check out the FAQs*/}
          {/*        </Button>*/}

          {/*    </p>*/}
          {/*</div>*/}
        </HowItWorksLanding>

        <FurtherValueProposition>
          <div style={{textAlign: 'center'}}>
            <img
              style={{width: '100%', maxWidth: '400px'}}
              src={LandingImage2}
              alt={'image of jordans'}
            />
            <h2 style={{fontSize: '32px', color: 'white'}}>
              Tired of Fake Yeezys and Counterfeit Jordans?
            </h2>
            <h4 style={{color: 'white'}}>We've got your back.</h4>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{maxWidth: '800px'}}>
              <p>
                Finding good quality shoes within Nairobi is{' '}
                <em>
                  <b>HARD</b>.
                </em>
                &nbsp; If you've tried getting your hands on a new pair of Jordans, Yeezys or Vans
                that don't look terrible or start wearing out within weeks, you probably know what
                we're talking about.
              </p>
              <p>
                The 2500 Store (T25) was created to serve the needs of people in search of
                good-quality shoes but met instead with the same tired <em>fake</em>, <em>foamy</em>
                &nbsp; imitations strewn all over the streets of Nairobi. Of course, it's not all
                bad, so if nothing else, we'll help you realize
                <span style={{color: 'red'}}>&nbsp; what it means to be original &nbsp;</span>
                and why it matters.
              </p>
              <p>
                Our promise to you is high-quality, authentic shoes delivered right to your
                doorstep.
              </p>
              {/* <p>
                                We trust you'll like our products so much that everything we offer comes with
                                guaranteed free returns within 7 days <em>for any reason.</em> No questions asked.
                            </p> */}
              <p>Go ahead and take a look around. You'll love it.</p>
              <div style={{textAlign: 'center'}}>
                <h4 style={{color: 'white'}}>Some of our favorite brands include</h4>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <img style={{width: '64px'}} src={AirJordanWhiteLogo} alt={'air jordan logo'} />
                  <img style={{width: '64px'}} src={NikeWhiteLogo} alt={'nike logo'} />
                  <img style={{width: '64px'}} src={VansWhiteLogo} alt="vans logo" />
                  <img
                    style={{width: '64px', objectFit: 'contain'}}
                    src={YeezyLogo}
                    alt={'yeezy logo'}
                  />
                </div>
              </div>
            </div>
          </div>
        </FurtherValueProposition>
      </Layout>
    );
  }
}

export const CenterPageContent = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
`;

const FurtherValueProposition = styled.div`
  padding: 80px 0;
  min-height: 100vh;
  //TODO: this should be #323232 on Chrome
  background: #353535;

  p {
    font-size: 18px;
    color: white;
  }

  @media screen and (max-width: 768px) {
        padding: 80px 36px;

        p {
            font-size: 16px;
        }
    }
`;

const HowItWorksLanding = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px;

  h2 {
    font-size: 32px;
  }

  p {
    font-size: 16px;
  }

  h4 {
    margin: 0;
  }

  h2,
  h3,
  h4,
  p {
    color: #353535;
  }

  .process {
    display: grid;
    grid-column-gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

    .rs-Box {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    p {
      font-size: 16px;
    }
  }
`;

export default HowItWorks;

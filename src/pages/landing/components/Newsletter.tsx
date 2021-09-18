import {Button, Container, Input, Section} from 'bloomer';
import {MPesaLogo} from '../../../constants/icons';
import {Helmet} from 'react-helmet';
import {env} from '../../../config';
import WinkingEmoji from '../../../assets/images/emoji/wink.webp';
import Layout from '../../../components/Layout';
import React from 'react';
import styled from 'styled-components';


const Newsletter = ()=> {

  return (
    <Section>
      <Helmet>
        <script id="mcjs">
          {
            env.isStaging() ?
              '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/6ec31ce43b70efd818395b2ae/819f6aab492396f5747c68f82.js");' :
              '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/6ec31ce43b70efd818395b2ae/14ec84c64dab50454558e2aab.js");'
          }
        </script>
      </Helmet>

      <Container>
        <Partners>
          <h2 style={{margin: 0}}>We accept</h2>
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
            <div id="mc_embed_signup" style={{display: 'flex', alignItems: 'center'}}>
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
                              style={{width: '16px', verticalAlign: 'sub'}}
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
                        isSize={'medium'}
                        style={{fontSize: 'inherit'}}
                        defaultValue="Subscribe"
                        name="subscribe"
                        id="mc-embedded-subscribe"
                      >
                        Get Started
                      </Button>
                    </div>
                  </div>
                  <div id="mce-responses" className="clear">
                    <div className="response" id="mce-error-response" style={{display: 'none'}} />
                    <div
                      className="response"
                      id="mce-success-response"
                      style={{display: 'none'}}
                    />
                  </div>
                  <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
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
  )
}

export default Newsletter;

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

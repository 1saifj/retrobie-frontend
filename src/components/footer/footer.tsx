import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {FacebookLogoDark, GithibLogoDark, InstagramLogoDark, TwitterLogoDark} from '../../constants/icons';
import AnimatedLogo from '../logo/AnimatedLogo';
import {Footer} from 'bloomer';

const DefaultFooter = ({internal}) => {
  return (
    <div>
      <Foot>
        <div style={{width: '100%'}}>
          <div style={{textAlign: 'center'}}>
            <AnimatedLogo plain={true} color="#444" />
            <SocialButtonsParent>
              <SocialButtons>
                <a href={'https://instagram.com/retrobie_co'}>
                  <img src={InstagramLogoDark} alt={'Instagram logo'} />
                </a>
                <a href={'https://twitter.com/retrobie'}>
                  <img src={TwitterLogoDark} alt={'Twitter logo'} />
                </a>
                <a href={'https://www.facebook.com/retrobie'}>
                  <img src={FacebookLogoDark} alt={'Facebook logo'} />
                </a>
                <a href={'https://github.com/retrobie'}>
                  <img src={GithibLogoDark} alt={'Github logo'} />
                </a>
              </SocialButtons>
            </SocialButtonsParent>
          </div>
          {
            !internal && (
              <div
                style={{
                  textAlign: 'left',
                  maxWidth: 600,
                  margin: '0 auto'
                }}>
                <p>
                  Retrobie is a relatively young brand and sneaker shop,
                  founded in 2018 with the goal of providing authentic sneakers,
                  high-quality sports shoes and unique apparel to everyone in Nairobi.
                </p>
                <p>
                  Aside from sneakers in Nairobi, we are also passionate
                  about sports, with out main area of expertise being basketball. We've
                  got everything you'll need on the court - Air Jordans, Lebrons, Kyries, Currys,
                  KDs, PGs, CP3s and even rare treats like Iversons.
                </p>
                <p>
                  Try us out. You won't be disappointed.
                </p>
              </div>
            )
          }
          <ListParent>
            <ul>
              <p>The Company</p>
              <li>
                <Link to="/privacy/cookies">About us</Link>
              </li>
              <li>
                <Link to="/privacy/terms-of-service">Get in touch</Link>
              </li>
              <li>
                <Link to="/support/custom-requests">Requesting for a specific shoe</Link>
              </li>
            </ul>

            <ul>
              <p>Our Policies</p>
              <li>
                <Link to="/policies/claims-policy">Claims policy</Link>
              </li>
              <li>
                <Link to="/policies/returns-policy">Returns policy</Link>
              </li>
              <li>
                <Link to="/policies/refund-policy">Refund policy</Link>
              </li>
              <li>
                <Link to="/policies/exchange-policy">Exchange policy</Link>
              </li>
              <li>
                <Link to="/policies/shipping-policy">Shipping policy</Link>
              </li>
            </ul>
            <ul>
              <p>Legal & Privacy</p>
              <li>
                <Link to="/privacy/privacy-and-cookie-policy">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/privacy/terms-of-service">Terms of use</Link>
              </li>
            </ul>
            <ul>
              <p>Popular categories</p>
              <li>
                <Link to="/brands/adidas">Adidas shoes</Link>
              </li>
              <li>
                <Link to="/brands/nike">Nike shoes</Link>
              </li>
              <li>
                <Link to="/brands/air-force-1">Nike Air Force 1 sneakers</Link>
              </li>
              <li>
                <Link to="/category/basketball-shoes">Basketball shoes</Link>
              </li>
            </ul>
          </ListParent>
          <div style={{textAlign: 'center'}}>
            <p style={{marginBottom: 0, fontSize: '14px', paddingBottom: '12px'}}>
              Copyright &copy; {new Date().getFullYear()} Retrobie LTD
            </p>
          </div>
        </div>
      </Foot>
    </div>
  );
};

export default DefaultFooter;

const SocialButtons = styled.div`
  img {
    width: 18px;
    margin-right: 12px;
  }
`;

const SocialButtonsParent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 14px 0;
`;

const ListParent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  margin: 64px 0;
`;

const Foot = styled(Footer)`
  min-height: 250px;
  padding: 2rem;
  display: flex;
  justify-content: center;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 0 1 185px;
    
    li, p {
      margin: 0;
    }

    & > p {
      font-weight: 600;
    }
  }

  a {
    text-decoration: none;
    font-size: .9em;
  }
  a:hover {
    opacity: 0.8;
  }
`;

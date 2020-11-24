import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {FacebookLogoDark, GithibLogoDark, InstagramLogoDark, TwitterLogoDark} from '../../constants/icons';
import AnimatedLogo from '../logo/AnimatedLogo';
import {Footer} from 'bloomer';

const DefaultFooter = () => {
  return (
    <div>
      <Foot>
        <div>
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
          <ListParent>
            <ul>
              <p>Get to know us</p>
              <li>
                <Link to="/support/delivery">Shipping</Link>
              </li>
              <li>
                <Link to="/support/returns">Returns</Link>
              </li>
              <li>
                <Link to="/support/exchanges">Exchanges</Link>
              </li>
              <li>
                <Link to="/support">FAQs</Link>
              </li>
            </ul>
            <ul>
              <p>Customer Service</p>
              <li>
                <Link to="/support/delivery">Shipping</Link>
              </li>
              <li>
                <Link to="/support/returns">Returns</Link>
              </li>
              <li>
                <Link to="/support/exchanges">Exchanges</Link>
              </li>
              <li>
                <Link to="/support">FAQs</Link>
              </li>
            </ul>
            <ul>
              <p>Company</p>
              <li>
                <Link to="/company/about">About us</Link>
              </li>
              <li>
                <Link to="/support/get-in-touch">Contact us</Link>
              </li>
            </ul>
            <ul>
              <p>Further Information</p>
              <li>
                <Link to="/privacy/cookies">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/privacy/terms-of-service">Terms of use</Link>
              </li>
            </ul>
          </ListParent>
          <div style={{textAlign: 'center'}}>
            <p style={{marginBottom: 0, fontSize: '14px', paddingBottom: '12px'}}>
              Copyright &copy; {new Date().getFullYear()} The 2500 Store
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
  display: grid;
  display: none;
  grid-template-columns: repeat(auto-fit, minmax(142px, 1fr));
`;

const Foot = styled(Footer)`
  min-height: 250px;
  padding: 2rem;
  display: flex;
  justify-content: center;

  & > div {
    display: grid;
    justify-content: center;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    & > p {
      font-weight: 600;
    }
  }

  a {
    text-decoration: none;
  }
  a:hover {
    opacity: 0.8;
  }
`;

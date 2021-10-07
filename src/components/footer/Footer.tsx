import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {FacebookLogoDark, GithibLogoDark, InstagramLogoDark, TwitterLogoDark} from '../../constants/icons';
import PlainLogo from '../logo/Logo';
import {Footer} from 'bloomer';

const socialLinks = {
  instagram: {
    link: 'https://instagram.com/retrobie_co',
    icon: InstagramLogoDark,
  },
  twitter: {
    link: 'https://twitter.com/retrobie',
    icon: TwitterLogoDark,
  },
  facebook: {
    link: 'https://www.facebook.com/retrobie',
    icon: FacebookLogoDark,
  },
  github: {
    link: 'https://github.com/retrobie',
    icon: GithibLogoDark,
  },
};

const SocialButtons = () => (
  <SocialButtonsContainer>
    {
      Object.keys(socialLinks).map(key => (
        <a href={socialLinks[key].link}>
          <img src={socialLinks[key].icon} alt={`${key} logo`} />
        </a>
      ))
    }
  </SocialButtonsContainer>
);

const Links = () => (
  <LinksContainer>
    <ul>
      <h4>The Company</h4>
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
      <h4>Our Policies</h4>
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
      <h4>Legal & Privacy</h4>
      <li>
        <Link to="/privacy/privacy-and-cookie-policy">Cookie Policy</Link>
      </li>
      <li>
        <Link to="/privacy/terms-of-service">Terms of use</Link>
      </li>
    </ul>
    <ul>
      <h4>Popular categories</h4>
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
  </LinksContainer>
);

const Copyright = () => (
  <CopyrightContainer>
    <p>
      Copyright &copy; {new Date().getFullYear()} Retrobie LTD
    </p>
  </CopyrightContainer>
);

const CopyrightContainer = styled.div`
  text-align: center;
`;

const Logo = () => (
  <>
    <LogoContainer>
      <PlainLogo />
    </LogoContainer>
  </>
);

const LogoContainer = styled.div`
  display: flex;;
  justify-content: center;
`;

const DefaultFooter = ({hideFooter}) => {

  if (hideFooter) return <span />;

  return (
    <FooterContainer>
      <Logo />
      <SocialButtons />
      <Links />
      <Copyright />
    </FooterContainer>
  );
};

export default DefaultFooter;

const SocialButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 14px 0;

  img {
    width: 18px;
    margin-right: 12px;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  margin: 64px 0;
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 0 1 185px;
  }

  a {
    text-decoration: none;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const FooterContainer = styled(Footer)`
  min-height: 250px;
  padding: 2rem;
  margin-top: 48px;
  width:100%;
`;

import React, {useState} from 'react';
import Drawer from 'rc-drawer';
import Nav from '../nav/nav';
import {Link} from 'gatsby';
import styled from 'styled-components';
import {Navbar, NavbarBrand, NavbarBurger, NavbarItem, NavbarMenu} from 'bloomer';
import Logo from '../logo/Logo';
import 'rc-drawer/assets/index.css';
import MobileSidebar from './mobile-sidebar';

const headerStyling = {
  top: 0,
  zIndex: 9,
};


const LogoParent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <NavbarBrand style={{alignItems: 'center', justifyContent: 'center', marginTop: 36}}>
        <LogoContainer>
          <Link to="/">
            <Logo animated />
          </Link>
        </LogoContainer>
        <NavbarBurger onClick={() => setDrawerOpen(true)} />
      </NavbarBrand>

      <Drawer
        open={drawerOpen}
        duration={'.25s'}
        placement={'left'}
        handler={false}
        onClose={() => setDrawerOpen(false)}>
        <MobileSidebar onClose={() => setDrawerOpen(false)} />
      </Drawer>

    </>

  );
};

type HeaderProps = {
  hideNav?: boolean
  TopRightComponent: Function
}

const Header = (props: HeaderProps) => {

  const {TopRightComponent} = props;


  return (
    <>
      <div style={{...headerStyling}}>
        <NavbarContainer>
          <Navbar style={{alignItems: 'center'}}>
            <LogoParent />
            <NavbarMenu style={{marginTop: 48, justifyContent: 'flex-end'}}>
              {
                !props.hideNav && <Nav />
              }

              {
                props.hideNav && TopRightComponent && (
                  <TopRightComponent />
                )
              }

            </NavbarMenu>
          </Navbar>
        </NavbarContainer>
      </div>

    </>

  );
};

export default Header;

const LogoContainer = styled(NavbarItem)`
    margin-top: 13px;
    
    a {
      display: flex;
      align-items: center;
      line-height: normal;
      
      &:hover {
        text-decoration: none;
      }
    }
`;

const NavbarContainer = styled.header`
    padding: 0 48px;
    width: 100%;
    
    @media screen and (max-width: 700px){
      padding: 0 24px;
    }
    
    @media screen and (max-width: 655px){
      padding: 0 12px;
    }
    
  a {
    transition: color 0.2s ease;
    text-decoration: none;
    font-weight: 600;
  }
 
  
  @media screen and (max-width: 1024px) {
    .logo {
      margin-top: 0;
    }
  }
`;

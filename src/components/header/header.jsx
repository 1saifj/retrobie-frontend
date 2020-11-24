import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Drawer from 'rc-drawer';
import Nav from '../nav/nav';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {Container, Navbar, NavbarBrand, NavbarBurger, NavbarItem, NavbarMenu, Section} from 'bloomer';
import AnimatedLogo from '../logo/AnimatedLogo';
import 'rc-drawer/assets/index.css';

const headerStyling = {
    top: 0,
    background: "white",
    zIndex: 9,
};
const Header = ({style, withoutNav, topRightButton, rootStyle}) => {

    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const burger = document.getElementsByClassName('navbar-burger')[0];
        burger.addEventListener('click', () => {
            setDrawerOpen(true)
        })
    }, []);


    return (
        <>
            <div style={{...headerStyling, ...rootStyle}} id={'blog-animated-container'}>
                <NavbarContainer>
                    <Navbar style={{...style, alignItems: 'center'}}>
                        <NavbarBrand style={{alignItems: 'center', justifyContent: 'center', marginTop: 36}}>
                            <NavbarItem className={'logo'}>
                                <Link to="/" style={{display: "flex", alignItems: "center"}}>
                                    <AnimatedLogo color="#444"/>
                                </Link>
                            </NavbarItem>
                            <NavbarBurger/>
                        </NavbarBrand>
                        <NavbarMenu style={{marginTop: 48, justifyContent: 'flex-end'}}>
                            {
                                !withoutNav && <Nav/>
                            }

                            {
                                withoutNav && topRightButton && (
                                    <div>
                                        {topRightButton()}
                                    </div>
                                )
                            }

                        </NavbarMenu>
                    </Navbar>
                </NavbarContainer>
            </div>

            <Drawer open={drawerOpen}
                    duration={'.25s'}
                    placement={"left"}
                    handler={false}
                    onClose={() => setDrawerOpen(false)}>
                <AnimatedLogo plain/>

                <Section>
                    <Container>

                    </Container>
                </Section>
            </Drawer>
        </>

    );
};

Header.propTypes = {
    title: PropTypes.string,
};

export default Header;

const NavbarContainer = styled.header`
    padding: 0 48px;
    width: 100%;
    
  a {
    transition: color 0.2s ease;
    text-decoration: none;
    font-weight: 600;
  }
  
  .logo {
    margin-top: 13px;
  }
  
  @media screen and (max-width: 1024px) {
    .logo {
      margin-top: 0;
    }
  }
`;

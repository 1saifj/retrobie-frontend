import {Container, Section} from 'bloomer';
import AnimatedLogo from '../logo/AnimatedLogo';
import Man from '../../../public/assets/images/icons/man.svg';
import Woman from '../../../public/assets/images/icons/woman.svg';
import Boy from '../../../public/assets/images/icons/baby-boy.svg';
import Dollar from '../../../public/assets/images/icons/dollar-symbol.svg';
import Jordan1Icon from '../../../public/assets/images/icons/jordan1.svg';
import TShirtIcon from '../../../public/assets/images/icons/tshirt.svg';
import {Archive, Smartphone} from 'react-feather';
import Drawer from 'rc-drawer';
import React from 'react';

export default function MobileSidebar(){

  return (
    <div>
      <Section>
        <Container>
          <AnimatedLogo plain color={'#444'}/>
          <div>
            <h4>Categories</h4>
            <div>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <img
                    alt={'men'}
                    src={Man} style={{stroke: "#444", width: 20, height: 20}}/>
                  <a href={'/accounts/me'}>
                    Men
                  </a>
                </li>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <img
                    alt={'women'}
                    src={Woman} style={{stroke: "#444", width: 20, height: 20}}/>
                  <a href={'/accounts/me'}>
                    Women
                  </a>
                </li>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <img
                    alt={'kids'}
                    src={Boy} style={{stroke: "#444", width: 20, height: 20}}/>
                  <a href={'/accounts/me'}>
                    Kids
                  </a>
                </li>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <img
                    alt={'dollar sign'}
                    src={Dollar} style={{stroke: "#444", width: 16, height: 16}}/>
                  <a href={'/accounts/me'}>
                    Affordable
                  </a>
                </li>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <img
                    alt={'jordan icon'}
                    src={Jordan1Icon} style={{stroke: "#444", width: 20, height: 20}}/>
                  <a href={'/accounts/me'}>
                    Sneakers+
                  </a>
                </li>
                <li style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <img
                    alt={'t-shirt'}
                    src={TShirtIcon} style={{stroke: "#444", width: 20, height: 20}}/>
                  <a href={'/accounts/me'}>
                    Clothing
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <hr/>
          </div>
          <div>
            <ul style={{listStyle: 'none', padding: 0}}>
              <div>
                <h4>Your stuff</h4>
              </div>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <Smartphone style={{stroke: "#444", width: 16, height: 16}}/>
                <a href={'/accounts/me'}>
                  Your account
                </a>
              </li>
              <li style={{
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <Archive style={{stroke: "#444", width: 16, height: 16}}/>
                <a href={'/accounts/me/orders'}>
                  Your orders
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </Section>

    </div>
  )
}
import React from 'react';
import {Section} from 'bloomer';
import Return from '../../../assets/images/vectors/icons/return.svg';
import FastDelivery from '../../../assets/images/vectors/icons/delivery.svg';
import FreePickups from '../../../assets/images/vectors/icons/pickup.svg';
import Shield from '../../../assets/images/vectors/icons/guarantee.svg';
import styled from 'styled-components';


const Perks = () => {

  return (
    <Section>
      <div style={{textAlign: 'center'}}>
        <h1>Enjoy the perks of shopping with us</h1>
      </div>
      <ValueProposition>
        <div>
          <img style={{width: '48px'}} src={Return} alt={'easy returns'} />
          <h4>We accept Returns</h4>
          <p>Within 7 days of delivery.</p>
        </div>
        <div>
          <img style={{width: '48px'}} src={FastDelivery} alt={'next-day Delivery'} />
          <h4>Next-day Delivery</h4>
          <p>Anywhere within Nairobi</p>
        </div>
        <div>
          <img style={{width: '48px'}} src={FreePickups} alt={'free pickups payment'} />
          <h4>Free pickups</h4>
          <p>At selected points within the CBD.</p>
        </div>
        <div>
          <img style={{width: '48px'}} src={Shield} alt={'easy payment'} />
          <h4>100% Quality Guarantee</h4>
          <p>It's real deal or no deal.</p>
        </div>
      </ValueProposition>
    </Section>
  )
}

export const ValueProposition = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  justify-content: space-around;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 12px;
    text-align: center;

    @media screen and (max-width: 376px) {
        margin: 12px
    }

    h4 {
      margin-bottom: 6px;
    }

    p {
      margin: 0;
      text-align: center;
    }
  }
`;


export default Perks;

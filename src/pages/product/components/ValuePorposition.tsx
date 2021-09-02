import {Diamond, FastDelivery, HelpIcon} from '../../../constants/icons';
import React from 'react';
import styled from 'styled-components';


function ValuePropositionComponent(){

  return (
    <ValueProposition>
      <div>
        <img style={{width: '50px'}} src={FastDelivery} alt={'Free Delivery'} />
        <h4>Next-day Delivery</h4>
        <p>Anywhere within Nairobi</p>
      </div>
      <div>
        <img style={{width: '50px'}} src={HelpIcon} alt={'easy payment'} />
        <h4>Any questions? Need help?</h4>
        <p>
          Hit us up on Twitter <a href="https://twitter.com/retrbobie">@retrobie</a> or
          give us a call at <a
          href={'tel:+254-796-610-303'}
          type={'tel'}>
          +254 796 610 303
        </a>
        </p>
      </div>
      <div>
        <img style={{width: '50px'}} src={Diamond} alt={'easy payment'} />
        <h4>Assured Quality</h4>
        <p>100% original product guarantee</p>
      </div>
    </ValueProposition>

  )
}

export default ValuePropositionComponent;

const ValueProposition = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  justify-content: space-around;
  padding: 24px;
  text-align: center;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 12px;
    
    @media screen and (max-width: 376px) {
       margin: 12px;
    }

    h4 {
      margin-bottom: 6px;
    }

    a {
      color: dodgerblue;
      text-decoration: underline;
    }
    
    p {
      margin: 0;
      text-align: center;
    }
  }
`;

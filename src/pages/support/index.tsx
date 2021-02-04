import React from 'react';
import styled from 'styled-components';
import chevron from '../../assets/images/icons/chevron-right.svg';
import {Link} from 'react-router-dom';
import Layout from '../../components/Layout';
import {HelpIcon} from '../../constants/icons';

function Support() {
    return (
      <Layout>
          <SupportParent>
              <div style={{textAlign: 'center'}}>
                  <img src={HelpIcon} alt={'help'} style={{width: '48px'}}/>
              </div>

              <h1>What do you need help with?</h1>
              <Link to={'/support/making-an-order-for-shoes-sneakers-nairobi'}>
                  <HelpItem>
                      <p>Making an order</p>
                      <img src={chevron} alt={'chevron'}/>
                  </HelpItem>
              </Link>
              <Link to={'/support/paying-for-an-order'}>
                  <HelpItem>
                      <p>Paying for an order</p>
                      <img src={chevron} alt={'chevron'}/>
                  </HelpItem>
              </Link>
              <Link to={'/policies/shipping-policy'}>
                  <HelpItem>
                      <p>Delivery</p>
                      <img src={chevron} alt={'chevron'}/>
                  </HelpItem>
              </Link>
              <Link to={'/policies/returns-policy'}>
                  <HelpItem>
                      <p>Returns</p>
                      <img src={chevron} alt={'chevron'}/>
                  </HelpItem>
              </Link>
              <Link to={'/support/cancelling-an-order'}>
                  <HelpItem>
                      <p>Cancelling an order</p>
                      <img src={chevron} alt={'chevron'}/>
                  </HelpItem>
              </Link>
              <Link to={'/support/custom-requests'}>
                  <HelpItem>
                      <p>Requesting a specific shoe</p>
                      <img src={chevron} alt={'chevron'}/>
                  </HelpItem>
              </Link>
              <Link to={'/support/get-in-touch'}>
                  <HelpItem>
                      <p>Other (Contact us)</p>
                      <img src={chevron} alt={'chevron'}/>
                  </HelpItem>
              </Link>
          </SupportParent>
      </Layout>
    );
}

const SupportParent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 48px 0;
`;

const HelpItem = styled.div`
    display: flex;
    border: 1px solid var(--color-border-pale);
    border-radius: 4px;
    margin-bottom: 8px;
    min-width: 350px;
    padding: 6px 12px;
    align-items: center;
    justify-content: space-between;
    transition: all 0.25s ease-in-out;
    
    p {
      transition: all 0.25s ease-in-out;
    }    
    img {
      height: 8px;
      transition: all 0.25s ease-in-out;
    }
    
    &:hover {
      cursor:pointer;
      background: var(--color-primary);
      border-color: #444444;
      
      p {
        color: #fff;
      }
      
      img {
        filter: invert(100%);
      }
      
    }
`;

export const CenterPageContent = styled.div`
    width: 100%;
    align-items: center;
    justify-content: center;
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    
`;


export default Support;

import React from 'react';
import Layout from '../../../components/Layout';
import styled from 'styled-components';
import {CenterPageContent} from '../index';
import {SupportParent} from '../../policies/shipping-policy';

function MakingAnOrder() {
  return (
    <Layout style={{maxWidth: 800, margin: "0 auto"}}>
      <CenterPageContent>
        <SupportParent>
          <div>
            <h2>How to make an order on Retrobie</h2>
            <div>
              {/*<video>*/}
              {/*  <source src={'https://ik.imagekit.io/t25/how-to-make-an-order_muQN_oa7u.webm'}/>*/}
              {/*</video>*/}
            </div>
            <p>Making an order is a simple 5-step process</p>
            <div>
              <ol>
                <li>
                  <h4>
                    Find something you like
                  </h4>
                  <p>
                    Browse our catalog of products and find a nice
                    pair of shoes that suits your style.
                  </p>
                </li>
                <li>
                  <h4>
                    Add your products to the cart
                  </h4>
                  <p>
                    Add as many products as you like to your cart.
                  </p>
                </li>
                <li>
                  <h4>
                    Click the 'Checkout' button
                  </h4>
                  <p>
                    Open the cart and click the 'checkout' button
                    when you're ready to proceed to the next step.
                  </p>
                </li>
                <li>
                  <h4>
                    Proceed to Payment and Delivery
                  </h4>
                  <p>
                    In order to proceed to the 'Payment and Delivery' section,
                    you will either need to log in or create a new account.
                  </p>
                </li>
                <li>
                  <h4>
                    Choose your delivery location and complete your order.
                  </h4>
                  <p>
                    Pick a delivery location from the map to view your shipping
                    fees and complete the order.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </SupportParent>

      </CenterPageContent>
    </Layout>
  );
}

export default MakingAnOrder;

const MakingAnOrderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    max-width: 1024px;
  }
`;

import React from 'react';
import Layout from '../../../components/Layout';
import {CenterPageContent} from '../index';
import Payment from '../../../../public/assets/images/icons/online-payment.webp';
import SEOHeader from '../../../components/SEOHeader';

function PayingForAnOrder() {
    return (
      <Layout>
          <SEOHeader
            path={'/paying-for-an-order'}
            description={`We accept a variety of payment methods regardless of what you're paying for - shoes, clothes, etc.`}
            title={'Paying for an order'}
          />
          <CenterPageContent>
              <div>
                  <img style={{width: '45px'}} src={Payment} alt={'Dollar in cart'}/>
                  <h1>Paying for an Order</h1>
                  <p>
                      We only accept payments through our M-pesa Buy Goods Number.
                  </p>
                  <p>
                      You can either pay for an order at the checkout or
                      once your goods are delivered.
                  </p>
              </div>
          </CenterPageContent>
      </Layout>
    );
}

export default PayingForAnOrder;

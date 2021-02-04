import React from 'react';
import Layout from '../../../components/Layout';
import {CancelOrder} from '../../../constants/icons';
import {SupportParent} from '../../policies/shipping-policy';
import {CenterPageContent} from '../index';
import SEOHeader from '../../../components/SEOHeader';


export default function CancellingAnOrder() {

  return (
    <>
      <Layout>
        <SEOHeader
          path={'/support/cancelling-an-order'}
          description={'You can cancel your order on Retrobie any time before it is delivered. Here are instructions on how to do it.'}
          title={'Cancelling an order'}
        />
        <CenterPageContent>
          <SupportParent>
            <div>
              <img alt={'cancelled order'} style={{maxWidth: 48}} src={CancelOrder}/>
              <h1>Cancelling An Order</h1>
              <p>
                If you changed your mind about an order, you can cancel it at any time before it is
                delivered.
              </p>
              <p>
                You cannot cancel an order that's in transit. However, you can reject the order once
                it reaches your doorstep.
              </p>
              <p>
                If you decide not to accept the order but you had already paid for it,
                you will receive a full or partial refund within two working days (48 hours).
              </p>
            </div>
          </SupportParent>
        </CenterPageContent>
      </Layout>
    </>
  );
}
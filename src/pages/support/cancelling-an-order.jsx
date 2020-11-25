import React from 'react';
import Layout from '../../components/Layout';
import {CancelOrder} from '../../constants/icons'


export default function CancellingAnOrder() {

  return (
    <>
      <Layout style={{display: 'flex', justifyContent: 'center', marginTop: '48px'}}>
        <div>
          <img style={{maxWidth: 48}} src={CancelOrder}/>
          <h2>Cancelling An Order</h2>
          <p>
            You can cancel an order at any time before it is delivered.
          </p>
          <p>
            If your order is cancelled before delivery, but you had already paid for it,
            you will receive a full or partial refund within two working days (48 hours).
          </p>
        </div>
      </Layout>
    </>
  );
}
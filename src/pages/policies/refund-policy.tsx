import React from 'react';
import {CenterPageContent} from '../support';
import {Layout} from '../../components';
import {SupportParent} from './shipping-policy';

export default function() {

  return (
    <Layout>
      <CenterPageContent>
        <SupportParent>
          <h2>
            Refund policy
          </h2>
          <p>
            A refund involves Us (Retrobie) sending the customer an amount of money equivalent to the cost of an order previously paid to us. All refunds made on
            our platform are done so in accordance with the following terms.
          </p>
          <div>
            <h4>Terms and conditions</h4>
            <p>
              All refunds will be made to the same mobile/card number that was used
              during the order checkout, unless otherwise requested by the customer.
            </p>
            <p>
              In such a case, the customer will be required to provide sufficient
              proof that the new number does indeed belong to them,
              or the claim against which the refund was requested is considered invalid.
              One such proof would involve setting and confirming the new mobile number
              against their Retrobie account, and no further action will be taken on our end.
            </p>
            <p>
              When a claim is successfully processed, a processing fee, which is usually,
              but not always, equal to the amount of money charged for the delivery of
              the order against which the claim was lodged,
              will be subtracted
              against the amount of money requested for the refund by the customer,
              and thus a partial refund will almost always be issued.
            </p>
            <p>
              The only exception to this rule would be if a customer has an unused
              promotional offer that they choose to use in order to receive a
              full refund instead
            </p>
          </div>
        </SupportParent>
      </CenterPageContent>
    </Layout>
  )
};
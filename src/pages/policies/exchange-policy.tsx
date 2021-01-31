import React from 'react';
import {Layout} from '../../components';
import {CenterPageContent} from '../support';
import {SupportParent} from './shipping-policy';

export default function() {

  return (
    <Layout>
      <CenterPageContent>
        <SupportParent>
          <h2>
            Exchange policy
          </h2>
          <p>
            An exchange involves the issuing of a product in place of one a customer
            received after the completion of an order.
            The facilitation of an exchange will be conducted with respect to the
            following terms:
          </p>
          <h4>Terms and conditions</h4>
          <p>
            An exchange will be issued to the customer within 3-5 working days of having
            their claim successfully processed.
            Unsuccessful claims will not be considered valid for requesting an exchange.
          </p>
          <p>
            All exchanges are inclusive of a delivery fee, which will often,
            but not always, be the same as charged for the facilitation of
            the delivery for which the claim was made.
          </p>
          <p>
            We (Retrobie) will attempt to arrange a delivery, and it is up to the
            customer to confirm or otherwise arrange for the delivery of an
            exchanged product.
          </p>
          <p>
            All products requested must be in their original packaging, if any,
            inclusive of any gifts or merchandise delivered together with the product.
            The product requested for exchange must also be in the same condition as
            when delivered, failure to which, the claim against which the exchange was
            requested is considered invalid.

          </p>
          <p>
            An exchange involves switching of one product with another of similar type and value,
            offers, discounts and other temporary reduction in prices notwithstanding.
            It would not be acceptable, then, to claim an exchange on a product
            that the customer paid Ksh. 5,000 for, against another,
            currently on offer for Ksh. 5,000, but whose price was originally Ksh. 8,000.
            Additionally, it would not be valid to request for an exchange of a
            pair of shoes for a hoodie of similar value.
          </p>
          <p>
            Any gifts received by the customer during facilitation of the invalid order
            will remain with the customer, unless communicated otherwise.
          </p>

        </SupportParent>
      </CenterPageContent>
    </Layout>
  )
};
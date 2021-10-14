import React, {useEffect} from 'react';
import Layout from '../../components/Layout';
import {CenterPageContent} from '../support';
import styled from 'styled-components';
import {FastDelivery} from '../../constants/icons';
import {Section} from 'bloomer';
import {Link} from 'react-router-dom';
import SEOHeader from '../../components/SEOHeader';
import posthog from 'posthog-js';


export default function ShippingPolicy(props) {

  useEffect(() => {
    posthog.capture('viewed shipping policy page');
  }, []);

  return (
    <Layout>
      <SEOHeader
        title={'Shipping & Delivery Policy'}
        path={'/policies/shipping-policy'}
        description={'We accept returns on your goods within 7 days.'}
      />
      <CenterPageContent>
        <SupportParent>
          <header>
            <img alt={'fast delivery'} style={{width: 48}} src={FastDelivery}/>
            <h1>Shipping policy</h1>
          </header>
          <p>
            Thank you for visiting and shopping at Retrobie. The following are the terms and
            conditions that constitute our Shipping Policy.
          </p>
          <h4>
            Shipment processing time
          </h4>
          <p>
            All orders are processed within 2-3 business days. Orders are not shipped or delivered
            on weekends or holidays.
          </p>
          <p>
            If we are experiencing a high volume of orders, shipments may be delayed by a few days.
            Please allow additional days in transit for delivery. If there is a significant delay in
            shipment of your order, we will contact you via email or telephone.
          </p>
          <h4>
            Shipping rates & delivery estimates
          </h4>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          <p>
            The cost of shipping depends on the distance your delivery location is from the Central
            Business District, and can only be displayed to you at the checkout page.
          </p>
          <p>
            However, high-value orders allow us to subsidize the shipping cost and thus
            cost less to deliver. All all orders valued above Ksh. 8,000 are free.
          </p>
          <h4>
            Shipment confirmation & Order tracking
          </h4>
          <p>

            You will receive a Shipment Confirmation email once your order has
            shipped containing a link that allows you to track the location of the rider delivering
            your order. The link will be active within 24 hours.
          </p>
          <h4>
            Customs, Duties and Taxes
          </h4>
          <p>
            Retrobie is not responsible for any taxes applied to your order. These will be displayed
            at the checkout page, if applicable and are the responsibility of the
            customer.
          </p>
          <h4>
            Returns & Refunds
          </h4>
          <p>
            For more information, see our{' '}
            <Link to={'/policies/returns-policy'}>
              returns policy
            </Link>{' '}
            and{' '}
            <Link to={'/policies/refund-policy'}>
              refund policy
            </Link>.
          </p>
          {/*<h4>*/}
          {/*  Damages*/}
          {/*</h4>*/}
          {/*<p>*/}
          {/*  Retrobie is not liable for any products damaged or lost during shipping. */}
          {/*  If you received your order damaged, please contact the shipment carrier to file a claim.*/}

          {/*  Please save all packaging materials and damaged goods before filing a claim.*/}
          {/*</p>*/}
        </SupportParent>
      </CenterPageContent>
    </Layout>
  );
}

export const SupportParent = styled(Section)`
  max-width: 600px;

  a {
    color: dodgerblue;
    text-decoration: underline;
  }
`;

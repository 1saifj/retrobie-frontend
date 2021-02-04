import React from 'react';
import Layout from '../../components/Layout';
import {CenterPageContent} from './index';
import SEOHeader from '../../components/SEOHeader';

function Other() {
  return (
    <Layout>
      <SEOHeader
        description={'Need to make an enquiry on what sneakers in Nairobi we stock? Want us to book a special pair of shoes? Get in touch!'}
        title={'Get in touch with us'}
        path={'/support/get-in-touch'}/>
      <CenterPageContent>
        <h1>Get in Touch</h1>
        <p>
          If you need to make an enquiry about what shoes we stock in our Nairobi shop, what sneakers
          we can get for you or just want to say hi, we are always online on Twitter -{" "}
          <a href={'https://twitter.com/retrobie'}>@retrobie</a> or you can give us a call/Whatsapp or
          Telegram us at <a href={'tel:+254796610303'}>+254-796-610-303</a>
        </p>
        <p>
          Social media shy? Just a bit old school?
          Reach us via email at <a href={'mailto:customer.support@retrobie.com'}>
          customer.support@retrobie.com
        </a>
        </p>
      </CenterPageContent>
    </Layout>
  );
}

export default Other;

import React from 'react';
import Layout from '../../components/Layout';
import {SupportParent} from '../policies/shipping-policy';
import SEOHeader from '../../components/SEOHeader';
import {Container} from 'bloomer';
import {Request} from '../../constants/icons';

function CustomRequests() {
    return (
      <Layout style={{display: 'flex', justifyContent: 'center', marginTop: '48px'}}>
          <SEOHeader
            path={'/support/custom-requests'}
            title={'Making a Custom Request'}
            description={'Are you looking for sneakers in Nairobi and have a particular pair of sneakers in mind? We\'ll do our best to track them down for you. '}
          />
          <div>
              <SupportParent>
                  <Container>
                      <img alt={'custom sneaker request'} style={{maxWidth: 48}} src={Request}/>
                      <h1>Custom Requests</h1>
                      <p>
                          If you have a request for specific shoes, our agents and suppliers will try
                          to facilitate the same. However, there's no guarantee we'll find it, but we'll
                          try our best.
                      </p>
                      <p>
                          Hit us up on our socials or give us a call.
                      </p>
                  </Container>
              </SupportParent>
          </div>
      </Layout>
    );
}

export default CustomRequests;

import React, {Component} from 'react';
import {connect} from 'react-redux';
import Layout from '../../components/Layout';
import {CenterPageContent} from './support';
import styled from 'styled-components';
import {FastDelivery} from '../../constants/icons';
import {Section} from 'bloomer';

class Delivery extends Component {
  render() {
    return (
      <Layout>
        <CenterPageContent>
          <SupportParent>
            <div style={{marginTop: '48px'}}>
              <img style={{width: '80px'}} src={FastDelivery} />
              <h1>Delivery</h1>
            </div>
            <p>We offer two kinds of delivery methods:</p>
            <div>
              <h3>Drop-off point delivery.</h3>
              <p>
                Drop-off point delivery is <b>free</b>, but can only be done at specific areas
                within the CBD:
                <ul>
                  <li>Archives</li>
                  <li>Afya Center</li>
                </ul>
              </p>
              {/*<p>*/}
              {/*  Outside the CBD, drop-off point delivery is only supported in the following areas:*/}
              {/*  <ul>*/}
              {/*    <li>Stima Plaza</li>*/}
              {/*  </ul>*/}
              {/*</p>*/}
              <p>
                <b>Note</b>: Delivery outside these areas{' '}
                <em>
                  <b>but still within the CBD</b>
                </em>{' '}
                can be arranged, but will cost you extra.
              </p>
            </div>
            <div>
              <h3>Home/Office delivery</h3>
              <p>
                We are currently working with a third-party supplier to facilitate home & office
                deliveries. However, these can only be done within Nairobi.
              </p>
              <p>
                For delivery outside Nairobi, please get in touch with us at
                customer.support@retrobie.com
              </p>
            </div>
            <div>
              <h3>When can I expect my order?</h3>
              <p>
                All orders take 24 hours to ship, at most. You should get a confirmation message
                within a few minutes and delivery to be completed the next day.
              </p>
            </div>
          </SupportParent>
        </CenterPageContent>
      </Layout>
    );
  }
}

export const SupportParent = styled(Section)`
  max-width: 600px;

  p,
  li {
    color: #222;
  }

  a {
    color: dodgerblue;
    font-size: 14px;
    text-decoration: underline;
  }
`;

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Delivery);

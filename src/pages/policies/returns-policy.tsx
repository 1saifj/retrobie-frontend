import React from 'react';
import Layout from '../../components/Layout';
import {SupportParent} from './shipping-policy';
import {Return} from '../../constants/icons';
import SEOHeader from '../../components/SEOHeader';
import {Container} from 'bloomer';
import {Link} from 'react-router-dom';

class ReturnsPolicy extends React.Component {
  render() {
    return (
      <Layout style={{display: 'flex', justifyContent: 'center', marginTop: '48px'}}>
        <SEOHeader
          title={'Making ReturnsPolicy'}
          description={
            'If you purchased a product from one of sneaker shops in Nairobi but aren\'t satisfied, here are the resources you need for making returns.'
          }
        />
        <SupportParent>
          <Container>
            <Container>
              <div>
                <img src={Return} alt={'making returns'} style={{width: '48px'}}/>
              </div>
              <h2>Returns Policy</h2>
              <p>
                First things first, considering a refund or return means you made an order from us,
                which means we owe you a gigantic "Thank You!" Nothing makes us happier than having
                happy customers behind us. Since being able to give things back if they don't meet
                your requirements is a crucial component of that, we've made the returns process as
                seamless as possible for your experience.
              </p>
              <p>
                A return occurs when a customer (You) requests for a product to be taken back by Us
                (Retrobie) due to a fault with the product or an error made during delivery.
              </p>

              <p>
                The return will then take 3-5 business days to process,
                within which time, a full or partial refund will be issued
                in accordance with our{' '}
                <Link to={'/support/policies/refund-policy'}>
                  refund policy
                </Link>.
              </p>

              <p>That said, there are some things you need to keep in mind:</p>
              <ul>
                <li>
                  You may cancel your order any time before delivery.
                </li>
                <li>
                  You have seven (7) days since the day of delivery to make a returns claim.
                </li>
                <li>
                  <p>
                    A return can only be made once claim has been successfully processed.
                    To learn more, see our{' '}
                    <Link to={'/support/policies/claims-policy'}>
                      claims policy
                    </Link>
                  </p>
                </li>
              </ul>
            </Container>
            <Container>
              <div>
                <h3>Frequently Asked Questions</h3>
                <p>
                  These are some of the enquires that customers have most often. If you have any
                  further questions, reach us via email at customer.support@retrobie.com. We'll get
                  back to you within an hour.
                </p>
                <div>
                  <div>
                    <div>
                      <div>
                        <h4>What are the conditions for making a return?</h4>
                        <ul>
                          <li>
                            Proof of purchase - a receipt, usually sent to your email address.
                          </li>
                          <li>A valid return reason as outlined below</li>
                          <li>
                            The products should be given back in reasonably good condition. That is,
                            they should be:
                            <ul>
                              <li>Clean.</li>
                              <li>In the same condition they were delivered.</li>
                              <li>In the same packaging, if any.</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4>What are some valid reasons where returns are acceptable?</h4>
                      </div>
                      <div>
                        <ul>
                          <li>
                            <p>You received damaged goods.</p>
                          </li>
                          <li>
                            <p>You received the wrong order.</p>
                          </li>
                          <li>
                            <p>
                              The product doesn't fit as expected.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4>How do I return an item/ What happens once I have returned an item?</h4>
                      </div>
                      <div>
                        <p>
                          We will contact you in order to arrange a time that's convenient for
                          collecting the order. A Retrobie representative will then collect the product
                          from an agreed upon location on an agreed upon date, but within 48 hours of the
                          claim having been processed.
                        </p>
                        <p>
                          Once the return package is received and properly
                          assessed, you will receive a confirmation email or message and get back
                          your money within 48 hours.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4>How much time do I have to return a product to Retrobie?</h4>
                      </div>
                      <div>
                        <p>7 days from date of delivery.</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4>How do I send my product back to Retrobie?</h4>
                      </div>
                      <div>
                        <p>
                          We'll attempt to reach you on three separate occasions. If we are unable
                          to reach you each time, it will be up to you to get in touch and
                          facilitate the return of the product within reasonable time.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4>How do I track my return status?</h4>
                      </div>
                      <div>
                        <p>We will send you an email within 24 hours.</p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4>Is my product under warranty?</h4>
                      </div>
                      <div>
                        <p>
                          Products sold on Retrobie <b>do not</b> come with a warranty.
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4>Can I return my items after the timeline to return has expired?</h4>
                      <p>Unfortunately, no.</p>
                    </div>
                    <div>
                      <h4>How much do returns cost?</h4>
                      <p>
                        Making a return costs as much as you were charged for the delivery
                        of the product in the first place.
                      </p>
                      <p>
                        However, if the fault was on our end - e.g. we delivered the wrong
                        size/wrong order - the returns are free.
                      </p>
                    </div>
                    <div>
                      <h4>Why would my return be rejected?</h4>
                      <p>
                        A return can be rejected for a variety of reasons.
                      </p>
                      <ul>
                        <li>
                          You may be prohibited from making future returns if we notice
                          a suspicious history of returning products.
                        </li>
                        <li>

                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Container>

          </Container>
        </SupportParent>
      </Layout>
    );
  }
}

export default ReturnsPolicy;
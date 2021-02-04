import React from 'react';
import Layout from '../../../components/Layout';
import styled from 'styled-components';
import {CenterPageContent} from '../index';
import {SupportParent} from '../../policies/shipping-policy';
import SEOHeader from '../../../components/SEOHeader';
import {Link} from 'react-router-dom';
import {WinkingEmoji} from '../../../constants/icons';

function MakingAnOrder() {
  return (
    <Layout style={{maxWidth: 800, margin: "0 auto"}}>
      <SEOHeader
        path={"/making-an-order-shoes-sneakers-nairobi"}
        description={'Making an order for shoes or sneakers on Retrobie is a simple 5-step process. We delivery everywhere in Nairobi.'}
        title={'How to place an order for shoes/apparel in Nairobi'}
      />
      <CenterPageContent>
        <SupportParent>
          <div>
            <header>
              <h1>Making an order on Retrobie</h1>
              <div>
                {/*<video>*/}
                {/*  <source src={'https://ik.imagekit.io/t25/how-to-make-an-order_muQN_oa7u.webm'}/>*/}
                {/*</video>*/}
              </div>
              <p>
                You can order shoes, sneakers, hoodies, t-shirts and all that other dope stuff we have
                on our website in five simple steps. We delivery everywhere within Nairobi!
              </p>
            </header>
            <div>
              <h2>
                How to place an order
              </h2>
              <ol>
                <li>
                  <h3>
                    Find something you like
                  </h3>
                  <p>
                    At Retrobie, we specialize at finding and stocking original, hard-to-come-by
                    sneakers, apparel and shoes. But first, you have to find something that suits your
                    fancy.
                  </p>
                  <p>
                    Browse through our catalogue of <Link to={'/brands/nike'}>Nike sneakers</Link>,{" "}
                    <Link to={'/brands/adidas'}>Adidas shoes</Link> and pretty much anything else you can
                    think of.
                  </p>
                  <p>
                    Can't find what you're looking for? We can probably help you find it. Just hit us up.
                  </p>
                </li>
                <li>
                  <h3>
                    Add your products to the cart
                  </h3>
                  <p>
                    Once you've found something that fits your exqusite taste, add as many as you like
                    to the cart. Curious about how we handle shoe deliveries in Nairobi? Check out
                    our <Link to={'/policies/delivery-policy'}>delivery policy.</Link>
                  </p>
                </li>
                <li>
                  <h3>
                    Click the 'Checkout' button
                  </h3>
                  <p>
                    This one is easy. Once you're done shopping , open your cart from the menu and
                    click on the bright red 'Checkout' button.
                  </p>
                </li>
                <li>
                  <h3>
                    Log in or create a new account
                  </h3>
                  <p>
                    In order to comply with at least a dozen different laws, we need to store your
                    information. Not only does it keep us out of trouble, though, it also helps us
                    prevent fraud and know you a little bit better.
                  </p>
                  <p>
                    At this step, you'll either have to log in to your account or enter your
                    personal information and we'll create one for you. We{" "}
                    <strong>do not</strong> sell your data, and it's stored safely on our servers.
                  </p>
                </li>
                <li>
                  <h3>
                    Choose your delivery location and complete your order.
                  </h3>
                  <p>
                    Lastly, we need to know where to deliver your stuff. Pick a location using the
                    map or search bar and select the payment method you'd prefer. You can either pay
                    straight away or once your order has been delivered.
                  </p>
                  <p>
                    PS: paying straight away helps us expedite your delivery <span>
                    <img style={{verticalAlign: 'sub', width: 16}} src={WinkingEmoji} alt={'winking emoji'}/>
                  </span>
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </SupportParent>

      </CenterPageContent>
    </Layout>
  );
}

export default MakingAnOrder;

const MakingAnOrderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    max-width: 1024px;
  }
`;

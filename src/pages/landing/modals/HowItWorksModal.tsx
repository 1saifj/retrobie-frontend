import React from 'react';
import {
  AddToCart, Confetti,
  CoolPeach,
  FastDelivery,
  LocationIcon,
  SoundWaves,
} from '../../../constants/icons';
import CustomModal from '../../../components/CustomModal';
import styled from 'styled-components';
import AnimatedLogo from '../../../components/logo/AnimatedLogo';
import {Link} from 'react-router-dom';

const HowItWorksModal = function(props){
  return (
    <div>
      <CustomModal
        closeOnClickBackground
        isActive={props.isActive}
        onClose={props.onClose}>
        <ModalContent>
          <div>
            <div>
              <div>
                <AnimatedLogo color={'#444'} />
              </div>
              <h3>Who we are</h3>
              <p>
                <strong>
                  Retrobie
                </strong> is the newest kid on the block and we've got a lot to prove.
              </p>
              <p>
                We are an
                online sneaker shop and tech startup founded in 2018 with the goal of delivering
                the cleanest & freshest kicks right to your doorstep.
              </p>
              <p>
                All our stuff - from the cheapest Converse to the most expensive Yeezys - is original.
                That's the Retrobie guarantee.
              </p>
              <p>
                We stock a wide variety of sneakers - from popular stuff like Air Jordans, Yeezys,
                Air Force 1s, Chuck Taylors... you name it, to harder-to-find brands like
                Kevin Garnett and Nike Golf.
              </p>
            </div>
          </div>

          <div>
            <h3>
              How it works
            </h3>
            <p>
              Buying stuff on our store is a simple 5-step process. If you're still confused
              after this, feel free to reach us at our socials -{' '}
              <a href={'https://twitter.com/retrobie'}>@retrobie</a> on Twitter for the cool cats,{' '}
              <a href={'tel:+254796610303'}>+254-796-610-303</a>{' '} on Whatsapp or
              email us at{' '}
              <a href={'mailto:customer.support@retrobie.com'}>customer.support@retrobie.com</a>{' '}
              if you prefer old school.
            </p>

          </div>
          <div>
            <div style={{margin: '16px 0'}}>
              <div>
                <img
                  src={SoundWaves}
                  alt={'shoes you vibe with'}
                  style={{width: 64}}
                />
              </div>
              <div>
                <h4>Step 1: Find Something you vibe with.</h4>
                <p>
                  This one should be easy.
                </p>
                <p>
                  Retrobie is full of a wide selection of
                  sneakers and other sports shoes you're going to love.
                </p>
              </div>
            </div>

            <div style={{margin: '16px 0'}}>
              <div>
                <img
                  src={AddToCart}
                  alt={'add to cart'}
                  style={{width: 48}} />
              </div>
              <div>
                <h4>Step 2: Add it to your cart</h4>
                <p>
                  Once you've found something you like, add it/them to your cart
                  and proceed to the checkout page.
                </p>
              </div>
            </div>

            <div style={{margin: '16px 0'}}>
              <div>
                <img
                  alt={'your location'}
                  src={LocationIcon}
                  style={{width: 48}} />
              </div>
              <div>
                <h4>Step 3: Pick a delivery location & checkout</h4>
                <p>
                  Use the map on our checkout page to select where you'd like your stuff to be
                  delivered. The delivery fee will be calculated and shown on this page.
                </p>
                <p>
                  You can either pay for your order before or after delivery via M-pesa.
                </p>
                <p>
                  PS: Paying before delivery helps us expedite your order. No pressure, though.
                </p>
              </div>
            </div>

            <div style={{margin: '16px 0'}}>
              <img
                src={FastDelivery}
                alt={'fast delivery'}
                style={{width: 48}}
              />
              <div>
                <h4>
                  Step 3: Wait for the delivery to be completed or pick up your order
                  directly.
                </h4>
                <p>
                  Deliveries take two days maximum to complete.
                </p>
                <p>
                  If you're feeling feisty or
                  would prefer not to cover the delivery fee, you can arrange for a pickup
                  of your product within the CBD.
                </p>
              </div>
            </div>

            <div style={{margin: '16px 0'}}>
              <img
                src={CoolPeach}
                alt={'cool peach'}
                style={{width: 48}} />

              <div>
                <h4>Step 4: Rock your new kicks and keep being a cool peach.</h4>
                <p>
                   You earned it.
                </p>
              </div>
            </div>

            <div style={{margin: '16px 0'}}>
              <img
                alt={'confetti'}
                src={Confetti} style={{width: 48}} />

              <div>
                <h4>Step 5: Party??</h4>
                <p>Pop one on us, and spread the word if you enjoyed
                  the experience.
                </p>
              </div>
            </div>
          </div>

          <div style={{marginTop: 48}}>

            <p style={{textAlign: 'center'}}>
              Still have questions?
              &nbsp;
              <Link to={'/support'}>
                Check out the FAQs
              </Link>
            </p>
          </div>
        </ModalContent>
      </CustomModal>
    </div>
  );
}

const ModalContent = styled.div`
    p {
        padding: 0;
    }
    
    a {
      color: dodgerblue;
      text-decoration: underline;
    }
`
export default HowItWorksModal;
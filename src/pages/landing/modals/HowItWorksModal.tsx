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
import Logo from '../../../components/logo/Logo';
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
                <Logo />
              </div>
              <h3>Who we are</h3>
              <p>
                <strong>
                  Retrobie
                </strong> is a tech/e-commerce startup/shop founded and run by {' '}
                <a href="https://twitter.com/bradleykingz">
                  @bradleykingz
                </a> from his brother's basement.
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
              Get in touch
            </h3>
            <p>
              For the cool cats, DM me on Twitter - {' '}
              <a href={'https://twitter.com/retrobie'}>@retrobie</a>,{' '}
              <a href={'tel:+254796610303'}>+254-796-610-303</a>{' '}
              on Whatsapp or
              via email at {' '}
              <a href={'mailto:customer.support@retrobie.com'}>customer.support@retrobie.com</a>{' '}
              if you're old school.
            </p>

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

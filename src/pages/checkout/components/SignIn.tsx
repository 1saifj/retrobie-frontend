import {Link} from 'react-router-dom';
import {Button, Column, Columns, Field, Help, Input, Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import Separator from '../../../components/Separator';
import {Form, Formik} from 'formik';
import {NewUserCheckoutValidationSchema} from '../schema';
import TextField from '../../../components/input/TextField';
import InputMask from 'react-input-mask';
import {cleanString} from '../../../helpers';
import {Eye} from '../../../constants/icons';
import React, {useState} from 'react';
import styled from 'styled-components';
import {CartType, CheckoutType} from '../../../types';
import LoginUser from '../../accounts/login';
import {useNotify} from '../../../hooks';
import {RootStateOrAny, useSelector} from 'react-redux';
import SignUp from './SignUp';


const SignIn = function(props: {
  submitCart: Function
}) {

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const notify = useNotify();
  return (
    <>

      <FormParent>
        <h2>Your Information</h2>
        <p>
          Before we can complete your order, we need to know a few more things about
          you first. To find out how this data is used, please read our{' '}
          <Link to={'/privacy/terms-of-service'}>Terms and Conditions</Link>
        </p>
        <div>
          <h4>Already Have an Account?</h4>
          <div>
            <Button
              isColor={'primary'}
              style={{width: '100%', fontWeight: 'bold'}}
              onClick={() => setLoginModalOpen(true)}
            >
              Login to an existing account
            </Button>
          </div>
        </div>
        <div>
          <Separator text={'OR'} />
          <SignUp onSignUpComplete={props.submitCart} />
        </div>
      </FormParent>


      <Modal isActive={isLoginModalOpen} className={'modal-fx-fadeInScale'}>
        <ModalBackground onClick={() => setLoginModalOpen(false)} />
        <ModalContent>
          <div style={{background: 'white', padding: '12px 24px', borderRadius: 4}}>
            <LoginUser
              hideFooter={true}
              TopRightComponent={() => <span />}
              callback={(err) => {
                if (err) return;

                notify.success('You can now proceed to payments & delivery.');

                setLoginModalOpen(false);
              }}
            />
          </div>
        </ModalContent>
        <ModalClose onClick={() => setLoginModalOpen(false)} />
      </Modal>

    </>
  );
};

export default SignIn;

const FormParent = styled.div`
  max-width: 600px;
  
  a {
    color: dodgerblue;
    text-decoration: underline;
  }

  @media screen and (max-width: 768px) {
       width: 100%;
  }
  
  form {
    margin-top: 24px;
  }

  h4 {
    margin-bottom: 4px;
  }
`;

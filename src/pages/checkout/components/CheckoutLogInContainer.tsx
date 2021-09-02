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


const CheckoutLogInContainer = function(props: {
  submitCart: Function
}){

  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const checkoutState: CheckoutType = useSelector((state: RootStateOrAny) => state.user.checkout);

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
        </div>
        <Formik
          initialValues={{
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            phoneNumber: '',
          }}
          validationSchema={NewUserCheckoutValidationSchema}
          onSubmit={async (values, {setSubmitting}) => {
            setSubmitting(true);

            // clone the object
            const userData = JSON.parse(JSON.stringify(values));

            //remove '0' from the phone number
            if (userData.phoneNumber.charAt(0) === '0') {
              userData.phoneNumber = userData.phoneNumber.substr(1);
            }

            const data = {
              userInfo: userData,
              cart: checkoutState,
            };
            await props.submitCart(data);
            setSubmitting(false);
          }}
        >
          {({setFieldValue, errors, values, isSubmitting, handleBlur}) => (
            <Form>
              <h4>Enter Your Personal Information</h4>
              <div>
                <Columns>
                  <Column isSize={'1/2'}>
                    <Field>
                      <TextField
                        name={'email'}
                        label={'Your email address'}
                        help={`A new account will be created for you with this email.`}
                        type={'email'}
                        placeholder={'email@gmail.com'}
                      />
                    </Field>
                  </Column>
                  <Column isSize={'1/2'}>
                    <Field>
                      <label>Your phone number</label>
                      <InputMask
                        mask="9999-999-999"
                        onBlur={handleBlur}
                        value={values.phoneNumber}
                        onChange={e => {
                          setFieldValue(
                            'phoneNumber',
                            cleanString(e.target.value, ''),
                          );
                        }}
                      >
                        {inputProps => (
                          <Input
                            label={'Your phone number'}
                            name={'phoneNumber'}
                            placeholder={'eg. 0728-538-683'}
                            {...inputProps}
                            type="tel"
                          />
                        )}
                      </InputMask>
                      <Help>
                        In case we need to reach out concerning your order
                      </Help>
                      {errors.phoneNumber && (
                        <div
                          className={'error'}
                          style={{marginTop: 4, marginLeft: 8}}
                        >
                          <small
                            style={{
                              color: 'var(--color-error)',
                              fontWeight: 'bold',
                            }}
                          >
                            {errors.phoneNumber}
                          </small>
                        </div>
                      )}
                    </Field>
                  </Column>
                </Columns>
              </div>
              <Columns>
                <Column>
                  <Field>
                    <TextField
                      name={'password'}
                      type={passwordShown ? 'text' : 'password'}
                      label={'Your new password'}
                      icon={Eye}
                      buttonAction={isButtonActive => {
                        setPasswordShown(isButtonActive);
                      }}
                      placeholder={'A strong password'}
                    />
                  </Field>
                </Column>
              </Columns>
              <Columns>
                <Column>
                  <Field>
                    <TextField
                      name={'firstName'}
                      type={'text'}
                      label={'Your first name'}
                      placeholder={'eg. Dominic'}
                    />
                  </Field>
                </Column>

                <Column>
                  <Field>
                    <TextField
                      name={'lastName'}
                      type={'text'}
                      label={'Your last name'}
                      placeholder={'eg. Fike'}
                    />
                  </Field>
                </Column>
              </Columns>
              <div style={{marginTop: '24px', marginBottom: '24px'}}>
                <Button
                  isColor={'primary'}
                  type={'submit'}
                  isLoading={isSubmitting}
                  style={{width: '100%', fontWeight: 'bold'}}
                >
                  Proceed to Payment & Delivery
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </FormParent>


      <Modal isActive={isLoginModalOpen} className={'modal-fx-fadeInScale'}>
        <ModalBackground onClick={() => setLoginModalOpen(false)} />
        <ModalContent>
          <div style={{background: 'white', padding: '12px 24px', borderRadius: 4}}>
            <LoginUser
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
}

export default CheckoutLogInContainer;

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

import {Form, Formik} from 'formik';
import {NewUserCheckoutValidationSchema} from '../schema';
import {Button, Column, Columns, Field, Help, Input} from 'bloomer';
import TextField from '../../../components/input/TextField';
import InputMask from 'react-input-mask';
import {cleanString} from '../../../helpers';
import {Eye} from '../../../constants/icons';
import React, {useState} from 'react';
import {CheckoutType} from '../../../types';
import {RootStateOrAny, useSelector} from 'react-redux';
import {Simulate} from 'react-dom/test-utils';

const SignUp = (props: {
  onSignUpComplete
}) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const checkoutState: CheckoutType = useSelector((state: RootStateOrAny) => state.user.checkout);

  return (
    <Formik
      initialValues={{
        customer: {
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          phoneNumber: '',
        },
      }}
      validationSchema={NewUserCheckoutValidationSchema}
      onSubmit={async (values, {setSubmitting, setFieldError}) => {
        setSubmitting(true);

        // clone the object
        const userData = JSON.parse(JSON.stringify(values.customer));

        //remove '0' from the phone number
        if (userData.phoneNumber.charAt(0) === '0') {
          userData.phoneNumber = userData.phoneNumber.substr(1);
        }

        const data = {
          isNewCustomer: true,
          customer: userData,
          cart: checkoutState,
        };

        await props.onSignUpComplete(data, setFieldError);
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
                    name={'customer.email'}
                    label={'Your email address'}
                    help={`A new account will be created for you with this email.`}
                    type={'email'}
                    placeholder={'email@gmail.com'}
                  />
                </Field>
              </Column>
              <Column isSize={'1/2'}>
                <Field>
                  <TextField
                    label={'Your Phone Number'}
                    name={'customer.phoneNumber'}
                    placeholder={'eg. 0725887889'}
                    type={'phone'} />

                  {
                    !errors.customer?.phoneNumber && (
                      <Help>
                        In case we need to reach out concerning your order
                      </Help>
                    )
                  }
                </Field>
              </Column>
            </Columns>
          </div>
          <Columns>
            <Column>
              <Field>
                <TextField
                  name={'customer.password'}
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
                  name={'customer.firstName'}
                  type={'text'}
                  label={'Your first name'}
                  placeholder={'eg. Dominic'}
                />
              </Field>
            </Column>

            <Column>
              <Field>
                <TextField
                  name={'customer.lastName'}
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
              disabled={isSubmitting}
              style={{width: '100%', fontWeight: 'bold'}}
            >
              Proceed to Payment & Delivery
            </Button>
          </div>
        </Form>
      )}
    </Formik>

  );
};

export default SignUp;

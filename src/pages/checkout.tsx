import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import Cart from '../components/cart';
import InputMask from 'react-input-mask';
import EmptyState from '../components/empty/EmptyState';
import {
  Button,
  Column,
  Columns,
  Container,
  Field,
  Help,
  Input,
  Modal,
  ModalBackground,
  ModalClose,
  ModalContent,
  Section,
} from 'bloomer';
import {NormalCart} from '../constants/icons';
import {Form, Formik} from 'formik';
import TextField from '../components/input/TextField';
import {cleanString, extractErrorMessage} from '../helpers';
import * as Yup from 'yup';
import Separator from '../components/Separator';
import LoginUser from './accounts/login';
import {Link} from 'react-router-dom';
import {AtSign, Phone, User} from 'react-feather';
import {Helmet} from 'react-helmet';
import {notify} from '../helpers/views';
import EyeVector from '../assets/images/vectors/eye.svg';
import {createCheckoutAction, loginUserAction} from '../state/actions';
import {env} from '../config';
import {CartType} from '../types';
import {LoginUserActionPayload} from '../state/reducers/userReducers';
import {useAuth} from '../network';

const LoggedInContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  img {
    border-radius: 4px;
  }

  .user-info {
    margin-left: 24px;
    & > div {
      display: flex;
      align-items: center;
      p {
        margin-left: 8px;
      }
    }
  }
`;

const NewUserCheckoutValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('This field is required'),
  firstName: Yup.string().required('This field is required'),
  lastName: Yup.string().required('This field is required'),
  phoneNumber: Yup.string()
    .required('This field is required')
    .length(10, 'Please enter a valid phone number'),
  password: Yup.string()
    .required('This field is required')
    .min(8, 'Your password should be at least 8 characters long')
    .max(128, "That's too long. Try something shorter.")
    .matches(/.*[0-9].*/, 'Please include at least one number')
    .matches(/.*[A-Z].*/, 'Please include at least one uppercase letter'),
});

export default function Checkout(props) {
  const api = useAuth();
  const checkoutState = useSelector((state: RootStateOrAny) => state.user.checkout);
  const cartState = useSelector((state: RootStateOrAny) => state.cart);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const isUserLoggedIn = useSelector((state: RootStateOrAny) => state.user.isLoggedIn);

  const [userInfo, setUserInfo] = useState({
    avatar: {
      url: "",
      thumbnailUrl: ""
    },
    phoneNumber: '',
    firstName: '',
    lastName: '',
    email: '',

  });
  const [passwordShown, setPasswordShown] = useState(false);

  const dispatch = useDispatch();

  const setUserLoggedIn = (payload: LoginUserActionPayload) => dispatch(loginUserAction(payload));

  const createCheckout = (payload: CartType) => dispatch(createCheckoutAction(payload));

  useEffect(() => {
    if (isUserLoggedIn) {
      dispatch(api.accounts.me())
        // @ts-ignore
        .then(({data})=> {
          setUserInfo(data);
        })
    }
    createCheckout(cartState);
  }, [isUserLoggedIn]);

  if (!checkoutState?.items.length) {
    return (
      <EmptyState
        title={'Your Cart is Empty'}
        icon={NormalCart}
        message={'Do some shopping and check back later. ;)'}
        prompt={() => (
          <Button
            type={'primary'}
            onClick={() => props.history.push('/')}
            style={{marginTop: '12px', width: '250px'}}
          >
            Start Shopping
          </Button>
        )}
      />
    );
  }

  async function submitCart(cartInfo) {
    try {
      // @ts-ignore
      const {data} = await dispatch(api.orders.new(cartInfo));
      if (data.tokens) {
        // if the user doesn't have an account,
        // log them in
        setUserLoggedIn({
          ...data.tokens,
          avatar: data.avatar,
        });
      }

      props.history.push(`/checkout/shipping/${data.order.uuid}`);
    } catch (e) {
      const message = extractErrorMessage(e);
      notify('error', message);
    }
  }

  return (
    <CheckoutParent>
      <Layout>
        <Helmet>
          <title>Retrobie | Checkout</title>
        </Helmet>
        <Section>
          <Container>
            <GridParent isLoggedIn={isUserLoggedIn}>
              <Columns className="cart--flex">
                {isUserLoggedIn ? (
                  <Column
                    isSize={{
                      mobile: 'full',
                      tablet: 'full',
                      desktop: '1/2',
                    }}
                  >
                    <LoggedInContainer>
                      <h2>Your Information</h2>
                      <p>
                        This information will be used to get in touch with you concerning your
                        order, should the need arise.
                      </p>
                      <div style={{display: 'flex', marginRight: '24px'}}>
                        <div>
                          <img
                            style={{minWidth: 100}}
                            src={env.getApiBaseUrl() + userInfo?.avatar?.url}
                            alt={'random avatar'}
                          />
                        </div>
                        <div className={'user-info'}>
                          <div>
                            <User />
                            <p>
                              {userInfo?.firstName} {userInfo?.lastName}
                            </p>
                          </div>
                          <div>
                            <Phone />
                            <p>+254-{userInfo?.phoneNumber}</p>
                          </div>
                          <div>
                            <AtSign />
                            <p>{userInfo?.email}</p>
                          </div>
                        </div>
                      </div>
                    </LoggedInContainer>
                  </Column>
                ) : (
                  <div>
                    <Column isSize={5}>
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
                            email: 'bradstar@vivaldi.com',
                            firstName: 'Jack',
                            lastName: 'Orb',
                            password: 'O4l7xfPggLXp4LmnoIudR',
                            phoneNumber: '0728538683',
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
                            await submitCart(data);
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
                                        maskChar={''}
                                        mask="9999-999-999"
                                        onBlur={handleBlur}
                                        value={values.phoneNumber}
                                        onChange={e => {
                                          setFieldValue(
                                            'phoneNumber',
                                            cleanString(e.target.value, '')
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
                                      icon={EyeVector}
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
                    </Column>
                  </div>
                )}
                <Column isSize={5} className="cart--parent">
                  <div style={{maxWidth: 600, margin: '0 auto'}}>
                    <h2 style={{color: '#222'}}>Your Cart</h2>
                    <Cart
                      hideCheckoutButton={!isUserLoggedIn}
                      checkoutButtonText={'Proceed to Payment & Delivery'}
                      onCheckout={async () => {
                        const data = {
                          cart: checkoutState,
                        };
                        await submitCart(data);
                      }}
                    />
                  </div>
                </Column>
              </Columns>
            </GridParent>
          </Container>
        </Section>
      </Layout>
      <Modal isActive={isLoginModalOpen} className={'modal-fx-fadeInScale'}>
        <ModalBackground onClick={() => setLoginModalOpen(false)} />
        <ModalContent>
          <div style={{background: 'white', padding: '12px 24px', borderRadius: 4}}>
            <LoginUser
              callback={(err) => {
                if (err) return;

                notify('success', 'You can now proceed to payments & delivery.');

                setLoginModalOpen(false);
              }}
            />
          </div>
        </ModalContent>
        <ModalClose onClick={() => setLoginModalOpen(false)} />
      </Modal>
    </CheckoutParent>
  );
}

const GridParent = styled('div')`
  margin-top: 24px;

  .cart--flex {
    display: flex;
    flex-wrap: ${props => (props.isLoggedIn ? 'wrap' : 'wrap-reverse')};
    justify-content: center;
  }

  .cart--parent {
    background: #fafafa;
    padding-top: 24px;
    padding-left: 16px;
    border-radius: 4px;
    padding-bottom: 24px;
  }
`;

const CheckoutParent = styled.div`
  .layout--parent {
    @media screen and (max-width: 768px) {
     margin: 0     
    }
  }
`;

const FormParent = styled.div`
  width: 600px;

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

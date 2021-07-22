import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import Cart from '../../components/cart';
import InputMask from 'react-input-mask';
import {Avatar, EmptyState, Loading} from '../../components';
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
import {EmptyCart, ErrorIconDark, Eye} from '../../constants/icons';
import {Form, Formik} from 'formik';
import TextField from '../../components/input/TextField';
import {addDashes, cleanString, extractErrorMessage} from '../../helpers';
import * as Yup from 'yup';
import Separator from '../../components/Separator';
import LoginUser from '../accounts/login';
import {Link} from 'react-router-dom';
import {AtSign, Phone, User} from 'react-feather';
import {Helmet} from 'react-helmet';
import {createCheckoutAction, loginUserAction} from '../../state/actions';
import {CartType, CheckoutType, LoginResponseType, ServerCartType} from '../../types';
import {useApi} from '../../network';
import useSWR from 'swr/esm/use-swr';
import ServerError from '../../assets/images/vectors/dead.svg';
import {useNotify} from '../../hooks';
import {UserInfoType} from '../../state/reducers/userReducers';

const LoggedInContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 10px;
  img {
    border-radius: 4px;
  }

  .user-info {
    margin-left: 24px;
    
    @media screen and (max-width: 500px){
      margin-left: 12px;
    }
    
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
  const api = useApi();
  const notify = useNotify();

  const isUserLoggedIn = useSelector((state: RootStateOrAny) => state.user.isLoggedIn);
  const localCart: CartType = useSelector((state: RootStateOrAny) => state.cart);

  const userInfoFetcher = ()=> api.accounts.me().then(({data}) => data);
  const {data: userInfo, error: fetchUserInfoError} = useSWR<UserInfoType>(isUserLoggedIn ? '/me': null, userInfoFetcher)

  const cartId = props.match.params.cartId;

  const isLocalCartEmpty = localCart.count === 0;

  // Does the cart in the redux store have the same
  // id as the param in the url?
  // Notice that localCart.id will realistically never be null
  const isLocalCart = localCart.id === cartId;   // TODO: verifying if valid guid will save us a few requests

  const cartInfoFetcher = (key, id) => api.cart.fetch(id).then(({data}) => data)

  const {data: remoteCart, error: fetchRemoteCartError} = useSWR<ServerCartType>(
    !isLocalCart ?
      [`/cart/${cartId}`, cartId] :
      null,
    cartInfoFetcher,
  );

  const checkoutState: CheckoutType = useSelector((state: RootStateOrAny) => state.user.checkout);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const [passwordShown, setPasswordShown] = useState(false);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const dispatch = useDispatch();

  const setUserLoggedIn = (payload: LoginResponseType) => dispatch(loginUserAction(payload));

  const createCheckout = (payload: CartType) => dispatch(createCheckoutAction(payload));

  useEffect(() => {
    // when a user lands on this page,
    // check if this is a local cart
    if (isLocalCart) {
      // if it is, create a checkout from it
      createCheckout(localCart);
    } else {
      // if the cart is not local, it will be fetched by swr
      if (remoteCart) {
        // if it exists,
        const {cartItems, uuid, ...rest} = remoteCart;
        // convert it into a local cart
        const localCart: CartType = {
          ...rest,
          items: cartItems,
          id: uuid,
        };
        // and create a checkout from it
        createCheckout(localCart);
      }

    }

  }, [
    // once a user logs in, this component should re-render in order to show
    // their cart
    isUserLoggedIn,
    cartId,
    localCart,
    remoteCart,
    isLocalCart
  ]);


  // if it's a local cart and it's empty
  if (isLocalCart && isLocalCartEmpty) {
    // show an empty state
    return (
      <Layout>
        <EmptyState
          title={'Your cart is empty'}
          icon={EmptyCart}
          iconWidth={52}
          message={"Sadly, you can't checkout an empty cart. Do some shopping and check back later. ;)"}
          prompt={() => (
            <Button
              isColor={'primary'}
              onClick={() => props.history.push('/')}
              style={{marginTop: '4px', width: '100%'}}
            >
              Start Shopping
            </Button>
          )}
        />
      </Layout>
    );
  }

  // if a 500 error occurs while fetching the
  // user's information
  if (fetchUserInfoError){
    return (
      <Layout>
        <EmptyState
          style={{minWidth: 400}}
          icon={ServerError}
          title={"Oops. That's an error."}
          message={'We could not reach our servers. Please try again in a short while.'}
          prompt={()=> (
            <Button
              style={{width: '100%'}}
              isColor={'primary'}>
              Try again
            </Button>
          )}
        />
      </Layout>
    )
  }

  // if a 500 error occurs while fetching
  // the user's cart
  if (fetchRemoteCartError) {
    return (
      <Layout>
        <EmptyState
          centerAlign={true}
          icon={ErrorIconDark}
          title="That doesn't look right"
          message={'Something went wrong while trying to fetch your order details. Please try again later.'}
        />
      </Layout>
    );
  }

  // if the local cart isn't available from redux,
  // but the remote cart hasn't been loaded yet
  if (!isLocalCart && !remoteCart){
    // show a loading screen
    return (
      <div>
        <Loading/>
      </div>
      );
  }


  async function submitCart(cartInfo) {
    setIsCheckoutLoading(true);
    try {
      // @ts-ignore
      const {data} = await dispatch(api.orders.new(cartInfo));
      setIsCheckoutLoading(false);
      if (data.tokens) {
        // if the user doesn't have an account,
        // log them in
        setUserLoggedIn({
          ...data.tokens, //fixme
          ...data,
        });
      }

      props.history.push(`/checkout/shipping/${data.order.uuid}`);
    } catch (e) {
      setIsCheckoutLoading(false);
      const message = extractErrorMessage(e);
      notify.error(message);
    }
  }

  return (
    <CheckoutParent>
      <Layout
        withoutNav
      >
        <Helmet>
          <title>Retrobie | Checkout</title>
        </Helmet>
        <Section>
          <Container>
            <GridParent isLoggedIn={isUserLoggedIn}>
              <Columns>
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
                      <div style={{display: 'flex'}}>
                        <div style={{
                          display: "flex",
                          alignItems: "center"
                        }}>
                          <Avatar
                            src={userInfo?.avatar}
                            name={`${userInfo?.firstName}`}/>
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
                            <p>+254-{addDashes(userInfo?.phoneNumber)}</p>
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
                  <Column
                    isSize={{
                      mobile: 'full',
                      tablet: 'full',
                      desktop: '1/2',
                    }}>
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
                  </Column>
                )}
                <Column isSize={{
                  desktop: '1/2',
                }} className="cart--parent">
                  <div style={{maxWidth: 600, margin: '0 auto'}}>
                    <h2 style={{color: '#222'}}>Your Cart</h2>
                    <Cart
                      source={remoteCart}
                      hideCloseButton={true}
                      hideCheckoutButton={!isUserLoggedIn}
                      checkoutButtonDisabled={Boolean(fetchUserInfoError)}
                      checkoutButtonIsLoading={isCheckoutLoading}
                      checkoutButtonText={
                        !fetchUserInfoError ? 'Proceed to Payment & Delivery' :
                          'Could not fetch your details'
                      }
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

                notify.success('You can now proceed to payments & delivery.');

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

const GridParent = styled.div<{isLoggedIn?: boolean}>`
  margin-top: 24px;

  .cart--flex {
    display: flex;
    flex-wrap: ${props => (props.isLoggedIn ? 'wrap' : 'wrap-reverse')};
    justify-content: center;
  }

  .cart--parent {
    background: #fafafa;
    padding-top: 24px;
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

import React from 'react';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {EmptyState} from '../../components';
import {
  Button,
  Column,
  Columns,
  Container,
  Section,
} from 'bloomer';
import {extractErrorMessage} from '../../helpers';
import {Helmet} from 'react-helmet';
import {loginUserAction} from '../../state/actions';
import {LoginResponseType} from '../../types';
import {useApi} from '../../network';
import useSWR from 'swr/esm/use-swr';
import ServerError from '../../assets/images/vectors/dead.svg';
import {useNotify} from '../../hooks';
import {UserInfoType} from '../../state/reducers/userReducers';
import CheckoutLoggedInContainer from './components/CheckoutLoggedinContainer';
import CheckoutLogInContainer from './components/CheckoutLogInContainer';
import CheckoutCart from './components/CheckoutCart';
import useFetchers from '../../hooks/useFetchers/useFetchers';


export default function CheckoutPage(props) {

  const cartId = props.match.params.cartId;

  const api = useApi();
  const notify = useNotify();
  const dispatch = useDispatch();
  const {userFetchers} = useFetchers();

  const isUserLoggedIn = useSelector((state: RootStateOrAny) => state.user.isLoggedIn);

  const {data: userInfo, error: fetchUserInfoError} = useSWR<UserInfoType>(
    isUserLoggedIn ? '/me': null,
    userFetchers.userInfoFetcher
  )

  const setUserLoggedIn = (payload: LoginResponseType) => dispatch(loginUserAction(payload));


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

  async function submitCart(cartInfo) {

    const {items, ...rest} = cartInfo.cart;
    const submitData = {
      ...rest,
      cartItems: items,
    };

    try {

      const {data} = await api.cart.new({cart: submitData});
      if (data.tokens) {
        // if the user doesn't have an account,
        // log them in
        setUserLoggedIn({
          ...data.tokens, //fixme
          ...data,
        });
      }

      props.history.push(`/checkout/shipping/${data.orderId}`);
    } catch (e) {
      const message = extractErrorMessage(e);
      notify.error(message);
    }
  }

  return (
    <>
      <Layout
        withoutNav
      >
        <Helmet>
          <title>Retrobie | Checkout</title>
        </Helmet>
        <CheckoutPageParent>
          <Container>
            <Columns>
              {
                isUserLoggedIn ? (
                  <Column isSize={{
                    mobile: 'full',
                    tablet: 'full',
                    desktop: '1/2',
                  }}>
                    <CheckoutLoggedInContainer user={userInfo} />
                  </Column>
                ) : (
                  <Column
                    isSize={{
                      mobile: 'full',
                      tablet: 'full',
                      desktop: '1/2',
                    }}>
                    <CheckoutLogInContainer submitCart={submitCart} />
                  </Column>

                )}

              <Column
                isSize={{
                  desktop: '1/2',
                }} >
                <CheckoutCart
                  cartId={cartId}
                  submitCart={submitCart} />
              </Column>
            </Columns>

          </Container>
        </CheckoutPageParent>
      </Layout>
    </>
  );
}

const CheckoutPageParent = styled(Section)`


`

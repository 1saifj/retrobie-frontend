import Cart from '../../../components/cart';
import React, {useEffect} from 'react';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import useSWR from 'swr/esm/use-swr';
import {CartType, CheckoutType, ServerCartType} from '../../../types';
import useFetchers from '../../../hooks/useFetchers/useFetchers';
import {createCheckoutAction} from '../../../state/actions';
import Layout from '../../../components/Layout';
import {EmptyState, Loading} from '../../../components';
import {EmptyCart, ErrorIconDark} from '../../../constants/icons';
import {Button} from 'bloomer';
import {useHistory} from 'react-router';
import styled from 'styled-components';


function CheckoutCart (props: {
  cartId: string,
  submitCart: Function
}){

  const {cartId} = props;


  const {cartsFetcher} = useFetchers();

  const localCart: CartType = useSelector((state: RootStateOrAny) => state.cart);

  const checkoutState: CheckoutType = useSelector((state: RootStateOrAny) => state.user.checkout);

  const isLocalCartEmpty = localCart.count === 0;

  // Does the cart in the redux store have the same
  // id as the param in the url?
  // Notice that localCart.id will realistically never be null
  const isLocalCart = localCart.id === cartId;   // TODO: verifying if valid guid will save us a few requests

  const {data: remoteCart, error: fetchRemoteCartError} = useSWR<ServerCartType>(
    !isLocalCart ?
      [`/cart/${cartId}`, cartId] :
      null,
    cartsFetcher.getOne,
  );


  const isUserLoggedIn = useSelector((state: RootStateOrAny) => state.user.isLoggedIn);

  const history = useHistory();
  const dispatch = useDispatch();

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
              onClick={() => history.push('/')}
              style={{marginTop: '4px', width: '100%'}}
            >
              Start Shopping
            </Button>
          )}
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


  return (
    <CheckoutParent isLoggedIn={isUserLoggedIn}>
      <div style={{maxWidth: 600, margin: '0 auto'}}>
        <h2 style={{color: '#222'}}>Your Cart</h2>
        <Cart
          source={remoteCart}
          hideCloseButton={true}
          hideCheckoutButton={!isUserLoggedIn}
          checkoutButtonDisabled={Boolean(fetchRemoteCartError)}
          checkoutButtonIsLoading={!remoteCart}
          checkoutButtonText={
            !fetchRemoteCartError ? 'Proceed to Payment & Delivery' :
              'Could not fetch your details'
          }
          onCheckout={async () => {
            const data = {
              cart: checkoutState,
            };
            await props.submitCart(data);
          }}
        />
      </div>
    </CheckoutParent>

  )
}

export default CheckoutCart;

const CheckoutParent = styled.div<{isLoggedIn: boolean}>`
  margin-top: 24px;
  background: #fafafa;
  padding-top: 24px;
  border-radius: 4px;
  padding-bottom: 24px;

  .cart--flex {
    display: flex;
    flex-wrap: ${props => (props.isLoggedIn ? 'wrap' : 'wrap-reverse')};
    justify-content: center;
  }
`;

import React from 'react';
import Layout from '../../components/Layout';
import styled from 'styled-components';
import Cart from '../../components/cart';
import {EmptyState} from '../../components';
import {EmptyCart} from '../../constants/icons';
import {Button} from 'bloomer';

function CartPage(props) {
  return (
    <Layout>
      <CartItemParent>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          {
            props.state.cart.items && props.state.cart.items.length ?
              <CartParent>
                <Cart
                  showTitle={true}
                  hideCloseButton={true}
                  size={'L'}
                  bordered
                  hideRemoveButton={true}
                />
                <small style={{margin: '8px 0'}}>*Total not inclusive of delivery fee, if
                  present</small>
              </CartParent>
              :
              <EmptyState
                title={'Your Cart is Empty'}
                icon={EmptyCart}
                message={'Do some shopping and check back later.'}
                prompt={() =>
                  <Button type={'primary'} onClick={() => props.history.push('/')}
                          style={{marginTop: '12px', width: '250px'}}>
                    Start Shopping
                  </Button>
                }
              />
          }
        </div>
      </CartItemParent>
    </Layout>
  );
}

export default CartPage;

const CartItemParent = styled.div`
  display: grid;
  width: 100%;
  justify-content: center;
  min-height: 65vh;
`;


const CartParent = styled.div`
    width: 600px;

    @media screen and (max-width: 768px) {
      width: 100%;    
    }
`;

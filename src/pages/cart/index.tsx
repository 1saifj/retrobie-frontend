import React from 'react';
import Layout from '../../components/Layout';
import {connect, RootStateOrAny, useSelector} from 'react-redux';
import styled from 'styled-components';
import Cart from '../../components/cart';
import {EmptyState} from '../../components';
import {EmptyCart} from '../../constants/icons';
import {Button} from 'bloomer';

function CartPage(props) {
  const cart = useSelector((state: RootStateOrAny) => state.cart);
  return (
    <Layout>
      <CartItemParent>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          {
            props.state.cart.items && props.state.cart.items.length ?
              <CartParent>
                <header style={{marginLeft: '12px'}}>
                  <h2 style={{color: '#222'}}>Your Cart</h2>
                </header>

                <Cart size={'L'}
                      bordered
                      showRemoveButton={true}
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

export default connect(state => ({
    state
}), null)(CartPage);

const CartItemParent = styled.div`
  display: grid;
  width: 100%;
  justify-content: center;
  min-height: 65vh;
`;


const CartParent = styled.div`
    width: 800px;

    @media screen and (max-width: 768px) {
      width: 100%;    
    }
`;

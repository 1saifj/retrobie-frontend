import React from 'react';
import styled from 'styled-components';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {formatNumberWithCommas} from '../../helpers';
import {addItemToCartAction, removeItemFromCartAction, toggleSidebarAction} from '../../state/actions';
import PropTypes from 'prop-types';
import {Button} from 'bloomer';
import Manga from '../../assets/images/icons/marginalia-online-shopping.png';
import EmptyState from '../empty/EmptyState';
import {notify} from '../../helpers/views';
import {useHistory} from 'react-router';
import {Link} from 'react-router-dom';
import {Minus, Plus} from 'react-feather';
import {CartItemType, CartType} from '../../types';

/**
 * This function checks whether it's safe to add the current product
 * to the cart or not.
 * <br/>
 * It makes sure the product isn't out of stock
 * <br/>
 * TODO: We will probably need measures to make sure a single user
 *       doesn't select more than, say 10 products.
 * @param cart
 * @param cartItem
 * @returns {{shouldAddToCart: boolean}|{message: string}}
 */
export function isProductInStock(
  cart: CartType,
  cartItem: CartItemType,
): {shouldAddToCart?: boolean, message?: string;} {

  let cartItemClone: CartItemType = JSON.parse(JSON.stringify(cartItem));
  const itemExistsInCart = cart
    .items
    .find(cartItem => cartItem.productId === cartItemClone.uuid);

  // If the item already exists in their cart
  if (itemExistsInCart) {
    // re-assign it
    const cartItem: CartItemType = itemExistsInCart;
    // make sure the user hasn't selected too much
    if (cartItem.quantity <= cartItem.stock) {
      // add that item to our cart
      return {
        shouldAddToCart: true,
      };
    } else {
      console.log('Couldn\'t add ', cartItem);
      // TODO: Add route to check for item availability
      return {
        message: 'Sorry. That item is out of stock.',
      };
    }
  } else {
    // If it's being added for the first time
    // Make sure the stock count 1 or more
    if (cartItemClone.stock >= 1) {
      return {
        shouldAddToCart: true,
      };
    } else {
      return {
        message: 'Sorry. That item is out of stock.',
      };
    }
  }
}

export default function Cart(props) {
  const cart: CartType = useSelector((state: RootStateOrAny) => state.cart);
  const isSidebarOpen: boolean = useSelector((state: RootStateOrAny) => state.meta.isSidebarOpen);
  const dispatch = useDispatch();
  const history = useHistory();

  function dispatchToCart(data: CartItemType) {
    const {shouldAddToCart, message} = isProductInStock(cart, data);

    if (shouldAddToCart) {
      const cartItem: CartItemType = data;
      // TODO: Better feedback mechanism?
      if (!isSidebarOpen) notify('info', `Successfully added ${data.name} to cart!`);

      dispatch(addItemToCartAction({item: cartItem}));
    } else {
      notify('error', message);
    }
  }

  function removeFromCart(data: CartItemType) {
    let cartItem: CartItemType = JSON.parse(JSON.stringify(data));
    if (cart.count === 1) {
      if (window.confirm('You are about to empty your cart. Are you sure?')) {
        dispatch(removeItemFromCartAction({item: cartItem}));
      }
    } else dispatch(removeItemFromCartAction({item: cartItem}));
  }

  function redirectOrCloseSidebar(path: string) {
    if (history.location.pathname === path) {
      openOrCloseSidebar(false);
    } else {
      if (props.history) props.history.push(path);
      else window.location.href = path;
    }
  }

  function openOrCloseSidebar(open: boolean) {
    dispatch(toggleSidebarAction({open}));
  }

  return (
    <CartParent>
      {cart.items && cart.items.length ? (
        <CartContent>
          {cart.items.map(cartItem => (
            <div
              className="cart-cartItem--parent"
              key={cartItem.uuid}
              onClick={() => redirectOrCloseSidebar(`/product/${cartItem.productId}`)}
            >
              <CartItem size={props.size} bordered={props.bordered}>
                <div style={{width: '100px'}}>
                  <img src={cartItem.thumbnailUrl} alt={cartItem.name} />
                </div>

                <div className="desc">
                  <div style={{maxWidth: '225px'}}>
                    <p>{cartItem.name}</p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <p>Ksh. {formatNumberWithCommas(cartItem.price)}</p>
                    <p style={{fontWeight: 600}}>x {cartItem.quantity}</p>
                  </div>
                </div>
                {
                  <ButtonsParent>
                    {props.showRemoveButton && (
                      <Button
                        isColor="light"
                        style={{padding: 0}}
                        onClick={event => {
                          event.stopPropagation();
                          removeFromCart(cartItem);
                        }}
                      >
                        <Minus />
                      </Button>
                    )}
                    {props.showAddButton && (
                      <Button
                        isColor="light"
                        disabled={cartItem.quantity === cartItem.stock}
                        style={{padding: 0}}
                        onClick={event => {
                          event.stopPropagation();
                          dispatchToCart(cartItem);
                        }}
                      >
                        <Plus />
                      </Button>
                    )}
                  </ButtonsParent>
                }
              </CartItem>
            </div>
          ))}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h4 style={{margin: 0, color: '#222'}}>Total</h4>
            <h3
              style={{
                color: '#222',
                fontSize: '18px',
              }}
            >
              Ksh. {formatNumberWithCommas(cart.total)}
            </h3>
          </div>
          {!props.hideCheckoutButton && !props.onCheckout && (
            <div>
              <Link to={props.checkoutButtonLink || '/checkout'}>
                <Button
                  isColor="primary"
                  style={{
                    width: '100%',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  {props.checkoutButtonText || 'CHECKOUT'}
                </Button>
              </Link>
            </div>
          )}

          {!props.hideCheckoutButton && props.onCheckout && (
            <div>
              <Button
                isColor="primary"
                style={{
                  width: '100%',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                onClick={props.onCheckout}
              >
                {props.checkoutButtonText || 'CHECKOUT'}
              </Button>
            </div>
          )}
        </CartContent>
      ) : (
        <div>
          <EmptyState
            title={"It's kinda lonely in here."}
            message={'Your cart is empty'}
            icon={Manga}
            width={'350px'}
            style={{minWidth: '280px'}}
            prompt={() => (
              <Button isColor="primary" style={{width: '100%'}}>
                Start Shopping
              </Button>
            )}
          />
        </div>
      )}
    </CartParent>
  );
}

Cart.propTypes = {
  // Indicates whether cartItems will be bordered or not
  bordered: PropTypes.bool,
  // Size of the cartItems
  size: PropTypes.oneOf(['L', 'S']),
  // Should show remove button
  showRemoveButton: PropTypes.bool,
  // Show add button
  showAddButton: PropTypes.bool,
  // Hide checkout button
  hideCheckoutButton: PropTypes.bool,

  checkoutButtonText: PropTypes.string,

  checkoutButtonLink: PropTypes.string,

  onCheckout: PropTypes.func,
};

const CartParent = styled.div`
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonsParent = styled.div`
  display: flex;

  button + button {
    margin: 0 4px;
  }
`;

const CartContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  .cart-cartItem--parent {
    display: flex;
    align-items: center;
  }

  .cart-footer {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 12px;
    width: 100%;
  }
`;

export const CartItem = styled.div`
  border: ${props => (props.bordered ? `1px solid #cacaca` : `1px solid transparent`)};
  border-radius: 4px;
  padding: 8px 8px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  transition: all 0.25s ease-in-out;
  max-width: 500px;
  width: 100%;

  &:hover {
    cursor: pointer;
    border: ${props => (props.border ? `1px solid #222` : `1px solid lightgrey`)};
  }

  .desc {
    margin-left: 12px;
    margin-right: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .quantity {
    font-weight: 600;
  }

  p {
    color: #222;
    margin: 0;
  }

  img {
    max-width: ${props => (props.size === 'L' ? `100%` : `50px`)};
    height: auto;
    max-height: 80px;
  }
`;

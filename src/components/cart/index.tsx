import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import defaultHelpers, {formatNumberWithCommas} from '../../helpers';
import {
  addItemToCartAction,
  deleteCheckoutAction,
  emptyCartAction,
  removeItemFromCartAction,
  toggleSidebarAction,
} from '../../state/actions';
import PropTypes from 'prop-types';
import {Button} from 'bloomer';
import Manga from '../../assets/images/icons/marginalia-online-shopping.png';
import {EmptyState} from '../../components';
import {notify} from '../../helpers/views';
import {useHistory} from 'react-router';
import {Minus, Plus, X} from 'react-feather';
import {CartItemType, CartType, ServerCartType} from '../../types';
import Loading from '../loading';
import posthog from 'posthog-js';

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
    if (cartItem.quantity <= cartItem.inStock) {
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
    if (cartItemClone.inStock >= 1) {
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

const TotalSection = ({hideCheckoutButton, onCheckout, cart, checkoutButtonDisabled, checkoutButtonIsLoading, checkoutButtonText}) => {

  const dispatch = useDispatch();

  const openOrCloseSidebar = (open: boolean) => dispatch(toggleSidebarAction({open}));

  const history = useHistory();

  function redirectOrCloseSidebar(path: string) {
    openOrCloseSidebar(false);

    if (history.location.pathname === path) {
      openOrCloseSidebar(false);
    } else {
      if (history) history.push(path);
      else window.location.href = path;
    }
  }

  const onCheckoutCart = async (cart: CartType) => {
    posthog.capture('checked out cart', {
      cart_total: cart.total,
    });
    await onCheckout?.(cart);
  };

  return (
    <>
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
        <>
          {/*
                  TODO: - Add shipping costs
                        - Indicate status of the order
                        - Show delivery location, if any
                        -
              */}
        </>
      </div>
      {!hideCheckoutButton && !onCheckout && (
        <div>
          <Button
            isColor="primary"
            disabled={checkoutButtonDisabled}
            onClick={() => redirectOrCloseSidebar(`/checkout/${cart.id}`)}
            isLoading={checkoutButtonIsLoading}
            style={{
              width: '100%',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            {checkoutButtonText || 'PROCEED TO CHECKOUT'}
          </Button>

        </div>
      )}

      {!hideCheckoutButton && onCheckout && (
        <div>
          <Button
            isColor="primary"
            disabled={checkoutButtonDisabled}
            isLoading={checkoutButtonIsLoading}
            style={{
              width: '100%',
              fontSize: 18,
              fontWeight: 'bold',
            }}
            onClick={() => onCheckoutCart(cart)}
          >
            {checkoutButtonText || 'PROCEED TO CHECKOUT'}
          </Button>
        </div>
      )}
    </>
  );
};

const CartItem = ({cart, cartItem, itemSize, bordered, redirectOrCloseSidebar, hideRemoveButton, hideAddButton}) => {

  const isSidebarOpen: boolean = useSelector((state: RootStateOrAny) => state.meta.isSidebarOpen);

  const dispatch = useDispatch();


  function emptyCart() {
    dispatch(emptyCartAction());
    dispatch(deleteCheckoutAction());
  }

  function removeFromCart(data: CartItemType) {
    let cartItem: CartItemType = JSON.parse(JSON.stringify(data));
    if (cart.count === 1) {
      if (window.confirm('You are about to empty your cart. Are you sure?')) {
        emptyCart();
      }
    } else dispatch(removeItemFromCartAction({item: cartItem}));
  }


  function dispatchToCart(data: CartItemType) {
    const {shouldAddToCart, message} = isProductInStock(cart, data);

    if (shouldAddToCart) {
      const cartItem: CartItemType = data;
      // TODO: Better feedback mechanism?
      if (!isSidebarOpen) notify('info', `Successfully added ${data.productName} to cart!`);

      dispatch(addItemToCartAction({item: cartItem}));
    } else {
      notify('error', message);
    }
  }

  return (
    <>
      <CartItemContainer key={cartItem.uuid}>
        <CartItemParent
          size={itemSize}
          bordered={bordered}
          onClick={() => redirectOrCloseSidebar(`/product/${cartItem.slug}`)}
        >
          <CartItemImageContainer>
            <img src={cartItem.thumbnailUrl} alt={`${cartItem.productName} thumbnail`} />
          </CartItemImageContainer>

          <CartItemDescription>
            <div className="product-name">
              <p>{defaultHelpers.titleCase(cartItem.productName)}</p>
            </div>
            <div className="product-price">
              <p>Ksh. {formatNumberWithCommas(cartItem.price)}</p>
              <p style={{fontWeight: 600}}>x {cartItem.quantity}</p>
            </div>
          </CartItemDescription>
          {
            <CartItemButtons>
              {
                !hideRemoveButton && (
                  <Button
                    isColor="light"
                    style={{padding: 0}}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      removeFromCart(cartItem);
                    }}
                  >
                    <Minus />
                  </Button>
                )
              }

              {
                !hideAddButton && (
                  <Button
                    isColor="light"
                    disabled={cartItem.quantity >= cartItem.inStock}
                    style={{padding: 0}}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      dispatchToCart(cartItem);
                    }}
                  >
                    <Plus />
                  </Button>
                )
              }
            </CartItemButtons>
          }
        </CartItemParent>
      </CartItemContainer>

    </>
  );
};

export default function Cart(
  {
    source,
    size,
    bordered,
    hideRemoveButton,
    hideAddButton,
    hideCheckoutButton,
    hideCloseButton,
    showTitle,
    onCheckout,
    checkoutButtonText,
    checkoutButtonDisabled,
    checkoutButtonIsLoading,
  }: {
    source?: ServerCartType
    size?: 'L' | 'S';
    bordered?: boolean;
    hideRemoveButton?: boolean;
    hideAddButton?: boolean;
    hideCheckoutButton?: boolean;
    hideCloseButton?: boolean
    showTitle?: boolean
    onCheckout?: ((cart: CartType) => void);
    checkoutButtonText?: string;
    checkoutButtonDisabled?: boolean;
    checkoutButtonIsLoading?: boolean;
  }) {


  const cartState: CartType = useSelector((state: RootStateOrAny) => state.cart);
  const [cart, setCart] = useState<CartType>(null);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(()=> {
    if (source?.cartItems) {
      setCart({
        ...source,
        id: source.uuid,
        items: source.cartItems,
      });
    } else {
      setCart(cartState)
    }
  }, [source, cartState])



  function redirectOrCloseSidebar(path: string) {
    openOrCloseSidebar(false);

    if (history.location.pathname === path) {
      openOrCloseSidebar(false);
    } else {
      if (history) history.push(path);
      else window.location.href = path;
    }
  }

  const openOrCloseSidebar = (open: boolean)=> dispatch(toggleSidebarAction({open}))

  if (!cart){
    return <Loading minor={true} />
  }

  return (
    <CartParent>
      {
        !hideCloseButton && (
          <div
            style={{display: 'flex'}}
            onClick={() => openOrCloseSidebar(false)}
            className={'navbar-close'}
          >
            <div style={{marginLeft: 'auto'}}>
              <X />
            </div>
          </div>
        )
      }
      {
        showTitle && (
          <header>
            <h2 style={{color: '#222'}}>Your Cart</h2>
          </header>
        )
      }
      {
        cart.items && cart.items.length ? (
          <CartContent>
            {
              cart.items.map(cartItem => (
                <CartItem
                  cartItem={cartItem}
                  bordered={bordered}
                  hideAddButton={hideAddButton}
                  hideRemoveButton={hideRemoveButton}
                  itemSize={size}
                  redirectOrCloseSidebar={redirectOrCloseSidebar}
                  cart={cart}
                />
              ))}
            <TotalSection
              checkoutButtonIsLoading={checkoutButtonIsLoading}
              checkoutButtonDisabled={checkoutButtonDisabled}
              checkoutButtonText={checkoutButtonText}
              hideCheckoutButton={hideCheckoutButton}
              onCheckout={onCheckout}
              cart={cart}
            />
          </CartContent>
        ) : (
          <div>
            <EmptyState
              title={'It\'s kinda lonely in here.'}
              message={'Your cart is empty'}
              icon={Manga}
              style={{minWidth: '280px'}}
              prompt={() => (
                <Button
                  isColor="primary"
                  onClick={() => redirectOrCloseSidebar('/')}
                  style={{width: '100%'}}>
                  Start Shopping
                </Button>
              )}
            />
          </div>
        )}
    </CartParent>
  );
}

const CartParent = styled.div`
  -ms-overflow-style: none;
  scrollbar-width: none;
  /* background: ${props => props.theme === 'light' ?
    'var(--color-background--light)' :
    'var(--color-background--dark)'
  }; */


  &::-webkit-scrollbar {
    display: none;
  }
`;

const CartItemButtons = styled.div`
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

  .cart-footer {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 12px;
    width: 100%;
  }
`;

const CartItemContainer = styled.div`
    display: flex;
    align-items: center;
`;

const CartItemImageContainer = styled.div`
  width: 100px;
  height: 80px;
  display: flex;
`;

const CartItemDescription = styled.div`
    margin-left: 12px;
    margin-right: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .product-name {
      max-width: 225px;
    }
    
    .product-price {
      text-align: right;
    }
`;

export const CartItemParent = styled.div<{bordered: boolean, size: 'L' | 'S'}>`
  border: ${props => (props.bordered ? `1px solid #cacaca` : `1px solid transparent`)};
  border-radius: 4px;
  padding: 8px 8px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  transition: all 0.25s ease-in-out;
  //max-width: 500px;
  width: 100%;

  &:hover {
    cursor: pointer;
    border: ${props => (props.bordered ? `1px solid #222` : `1px solid lightgrey`)};
  }

  img {
    max-width: ${props => (props.size === 'L' ? `100%` : `80px`)};
    height: auto;
    max-height: 80px;
    object-fit: contain;
  }
`;

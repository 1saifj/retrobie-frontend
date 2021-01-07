import {v4 as uuidV4} from 'uuid';
import {CartItemType} from '../../types';
import {ADD_TO_CART, DELETE_CART, REMOVE_FROM_CART} from '../actions/constants';

type CartState = {
  id?: number;
  count: number;
  total: number;
  items: Array<CartItemType>;
};

const initialState: CartState = {
  id: null,
  count: 0,
  total: 0,
  items: [],
};

export default (state = initialState, action: {type: string; payload}) => {
  // Either a new or already existing product

  switch (action.type) {
    // When an item is being added to the cart, it can either be a new item
    // or an item already in the cart.
    case ADD_TO_CART:
      let addToCartState = Object.assign({}, state);
      const addToCartActionItem = action.payload.item;
      const cartItemPrice = addToCartActionItem.originalPrice || addToCartActionItem.price;

      // Create a new cartId if there are no items in the cart.
      if (!addToCartState.items.length) {
        // we are essentially creating the user's cart for the first time
        addToCartState.id = uuidV4();
      }

      const cartItemId = addToCartActionItem.productId;

      // Check if the item exists
      let itemExists = addToCartState.items.find(item => item.productId === cartItemId);
      // If it doesn't
      if (!itemExists) {
        const newCartItem: CartItemType = {
          uuid: uuidV4(),
          productName: addToCartActionItem.productName,
          productId: addToCartActionItem.productId,
          slug: addToCartActionItem.slug,
          quantity: 1,
          stock: addToCartActionItem.stock,
          price: addToCartActionItem.originalPrice,
          originalPrice: addToCartActionItem.originalPrice,
          thumbnailUrl: addToCartActionItem.images[0].thumbnailUrl,
          isOnOffer: addToCartActionItem.isOnOffer,
        };
        // add it as a new item
        addToCartState.items.push(newCartItem);
      } else {
        // increase the quantity count of this product
        itemExists.quantity += 1;
      }

      // update the item count & total as long as the item has been added to cart
      addToCartState.count += 1;
      addToCartState.total += Number(cartItemPrice);

      return addToCartState;
    case REMOVE_FROM_CART:
      let removeFromCartState = Object.assign({}, state);
      const removeFromCartActionItem = action.payload.item;
      const removeFromCartItemPrice =
        removeFromCartActionItem.originalPrice || removeFromCartActionItem.price;

      // Find the index of the item to be removed
      let itemToBeRemovedIndex = removeFromCartState.items.findIndex(
        item => item.productId === removeFromCartActionItem.productId
      );
      // If the item exists
      if (itemToBeRemovedIndex !== -1) {
        // Retrieve the item from state
        let itemToBeRemoved = removeFromCartState.items[itemToBeRemovedIndex];
        // if there's 1 or more  in their cart
        if (itemToBeRemoved.quantity >= 1) {
          // decrease its quantity by one
          itemToBeRemoved.quantity -= 1;
          // decrease the total product count by 1
          removeFromCartState.count -= 1;
          // // decrement the total
          removeFromCartState.total -= Number(removeFromCartItemPrice);

          if (itemToBeRemoved.quantity === 0){
            // if the item quantity shrinks to 0, remove it from the cart
            removeFromCartState.items.splice(itemToBeRemovedIndex, 1);
          }

        } else {
          console.log('That item does not exist in the cart');
        }

        // if there are no longer any items in the cart
        if (!removeFromCartState.items.length || removeFromCartState.count <= 0){
          // delete the old cart
          console.log("No items in cart. Deleting...", removeFromCartState)
          removeFromCartState.id = null;
          removeFromCartState.items = [];
          removeFromCartState.total = 0;
          removeFromCartState.count = 0;
        }
      } else {
        console.log('Cannot remove invalid item from state', action.payload);
      }

      return removeFromCartState;
    case DELETE_CART:
      return {
        id: null,
        count: 0,
        total: 0,
        items: [],
      };
    default:
      return state;
  }
};

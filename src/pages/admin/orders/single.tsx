import React, {useEffect, useState} from 'react';
import {Button, Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import Loading from '../../../components/loading';
import EmptyState from '../../../components/empty/EmptyState';
import TextField from '../../../components/input/TextField';
import {Form, Formik} from 'formik';
import useSWR from 'swr';
import {useAuth} from '../../../network';
import {CartItemType, OrderType, ProductType} from '../../../types';
import CustomModal from '../../../components/CustomModal';
import {env} from '../../../config';
import {formatNumberWithCommas} from '../../../helpers';


export default function SingleOrder(props) {
  const api = useAuth();

  function getAllCartItemProducts(key, cartItems: Array<CartItemType>): Promise<ProductType[]> {
    if (cartItems?.length) {
      return Promise.all(
        cartItems?.map(async item => (await api.products.getSingle(item.productId))?.data)
      );
    }

    return undefined;
  }

  function mapCartItemToProduct(uuid) {
    if (allCartProducts?.length) {
      console.log('Searching for product with uuid', uuid);
      const product = allCartProducts?.find(item => item?.uuid === uuid);
      console.log('Found ', product, allCartProducts);
      return product;
    }

    console.log('No cart products');
    return undefined
  }

  const singleOrderFetcher = (uuid) => api.orders.getSingle(uuid).then(({data}) => {
    const {cart, ...rest} = data
    const {cartItems, ...restCart} = cart;
    return {
      ...rest,
      cart: {
        ...restCart,
        items: cartItems
      }
    }
  });

  const {data: thisOrderData, error} = useSWR<OrderType>(
    [props.match.params.id, '/orders/'],
    singleOrderFetcher
  );

  const {data: allCartProducts} = useSWR<ProductType[]>(
    ['products/orders', thisOrderData?.cart.items],
    getAllCartItemProducts
  )

  const [modalState, setModalState] = useState({
    confirmOrder: false,
    cancelOrder: false,
    fulfilOrder: false,
  });

  if (error) {
    return <EmptyState
      title={"Could not process your request"}
      message={'A server error occurred'} />;
  }

  if (!thisOrderData) {
    return <Loading />;
  }

  function markOrderAsFulfilled() {
    showHideModal('fulfilOrder', true);
  }
  function confirmOrder() {
    let cart = thisOrderData.cart;
    // console.log(cart);

    showHideModal('confirmOrder', true);
  }

  function cancelOrder() {
    // console.log(cart);
  }

  function showHideModal(name, show?) {
    if (show === undefined) show = true;

    setModalState({
      ...modalState,
      [name]: show,
    });
  }

  return (
    <>
      <div>
        {thisOrderData?.customer && (
          <div style={{minHeight: '65vh'}}>
            <div>
              <div>
                <div style={{display: 'flex'}}>
                  <div style={{marginRight: '48px'}}>
                    <img
                      src={env.getApiBaseUrl() + thisOrderData.customer.avatar.url}
                      alt={'avatar'}
                    />
                    <div>
                      <h2>Personal information</h2>
                      <div>
                        <p>
                          {thisOrderData.customer.firstName} {thisOrderData.customer.lastName}
                        </p>
                      </div>
                      <div>
                        <p>{thisOrderData.customer.phoneNumber}</p>
                      </div>
                      <div>
                        <p>{thisOrderData.customer.email}</p>
                      </div>
                    </div>
                    <div>
                      <h2>Delivery Information</h2>
                      <p>{
                        thisOrderData.delivery ? thisOrderData.delivery.address.location
                          : "No address provided"
                      }</p>
                    </div>
                    <div>
                      <h2>Payment Information</h2>
                    </div>
                  </div>
                  {thisOrderData.cart.items.length && (
                    <div style={{width: '100%'}}>
                      <h2>Order information</h2>
                      {thisOrderData.cart.items.map(cartItem => (
                        <div key={cartItem.productId}>
                          <div
                            style={{
                              border: '1px solid lightgrey',
                              borderRadius: '4px',
                              padding: '12px',
                              maxWidth: '600px',
                            }}
                          >
                            <div>
                              <p>{mapCartItemToProduct(cartItem.productId)?.name}</p>
                              <p>x {cartItem.quantity}</p>
                              <p>Ksh. {formatNumberWithCommas(cartItem.quantity * cartItem.price)}</p>
                            </div>
                          </div>
                          <div style={{marginLeft: 16}}>
                            <p>In stock: {mapCartItemToProduct(cartItem.productId)?.stock.adminCount}</p>
                          </div>
                        </div>
                      ))}
                      <div style={{marginTop: '24px'}}>
                        <CustomModal
                          closeOnClickBackground={true}
                          onClose={() => showHideModal('confirmOrder', false)}
                          isActive={modalState.confirmOrder}>
                          <div>
                            <h2>Are you sure you want to confirm this order?</h2>
                            <div>
                              <p>Make sure:</p>
                              <ul>
                                <li>There is enough stock of products</li>
                                <li>The email and phone number don't seem suspicious.</li>
                              </ul>
                              <p>
                                An email address will be sent out to{' '}
                                <b>{thisOrderData.customer.email} </b> and a phone call should be made
                                to <b>+254-{thisOrderData.customer.phoneNumber} </b> to confirm the
                                order.
                              </p>
                            </div>
                            <div>
                              <Button isColor={'primary'} onClick={() => confirmOrder()}>
                                Confirm Order
                              </Button>
                              <Button onClick={() => showHideModal('confirmOrder', false)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CustomModal>
                        <div>
                          <h3>Order total</h3>
                          <h4>Ksh. {formatNumberWithCommas(thisOrderData.cart.total)}</h4>
                        </div>
                        <div>
                          <div style={{display: 'flex', gap: 16}}>
                            <Button
                              style={{flex: 1}}
                              isColor={'success'}
                              onClick={() => showHideModal('confirmOrder')}>
                              Confirm this order
                            </Button>
                            <Button
                              style={{flex: 1}}
                              onClick={() => {}}>
                              Mark as fulfilled
                            </Button>
                          </div>

                          <CustomModal
                            closeOnClickBackground={true}
                            onClose={() => showHideModal('cancelOrder', false)}
                            isActive={modalState.cancelOrder}>
                            <div>
                              <h2>Are you sure you want to Cancel this order?</h2>
                              <p>
                                An email address will be sent out to{' '}
                                <b>{thisOrderData.customer.email} </b>
                              </p>
                              <div>
                                <Formik
                                  initialValues={{}}
                                  onSubmit={(values, {setSubmitting}) => {
                                    setSubmitting(true);
                                    showHideModal('cancelOrder', true);
                                  }}
                                >
                                  {({isSubmitting}) => (
                                    <>
                                      <Form>
                                        <TextField
                                          name={'reason'}
                                          type={'textarea'}
                                          placeholder="Reason"
                                          label={'Any particular reason for cancelling?'}
                                        />

                                        <div style={{marginTop: 12}}>
                                          <Button isColor={'primary'} type={'submit'}>
                                            Cancel Order
                                          </Button>
                                          <Button
                                            onClick={() => showHideModal('cancelOrder', false)}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </Form>
                                    </>
                                  )}
                                </Formik>
                              </div>
                            </div>
                          </CustomModal>
                        </div>

                        <div style={{marginTop: '16px'}}>
                          <Button
                            style={{width: '100%'}}
                            isOutlined
                            isColor={'danger'}
                            onClick={() => showHideModal('cancelOrder')}>
                            Cancel this order
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

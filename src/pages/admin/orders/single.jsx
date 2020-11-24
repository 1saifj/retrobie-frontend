import React, {useEffect, useState} from 'react';
import {Button, Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import Loading from '../../../components/loading';
import EmptyState from '../../../components/empty/EmptyState';
import TextField from '../../../components/input/TextField';
import {Form, Formik} from 'formik';
import useSWR from 'swr';
import useApi from '../../../network/useApi';


export default function SingleOrder(props) {
  const api = useApi();

  async function getAllCartItemProducts(cartItems) {
    if (cartItems?.length) {
      return Promise.all(cartItems?.map(async item => await api.products.getSingle(item.uuid)?.data));
    }
  }

  const {data: thisOrderResponse, loading, error} = useSWR(
    [props.match.params.id, '/orders/'],
    api.orders.getSingle
  );

  const {data: allProductsResponse} = useSWR(
    [thisOrderResponse?.data?.cart.cartItems, '/products/'],
    getAllCartItemProducts
  );

  const [thisOrder, setThisOrder] = useState({});

  const [cartItems, setCartItems] = useState([]);

  const [allCartProducts, setAllCartProducts] = useState([]);

  const [modalState, setModalState] = useState({
    confirmOrder: false,
    cancelOrder: false,
    fulfilOrder: false,
  });

  useEffect(() => {
    if (thisOrderResponse?.data) {
      setThisOrder(thisOrderResponse?.data);

      if (allProductsResponse?.data) {
        const cloned = [...allCartProducts];
        cloned.push(allProductsResponse.data);

        setAllCartProducts(cloned);
      }
    }
  }, [thisOrderResponse, allProductsResponse]);

  if (error) {
    return <EmptyState message={'A server error occurred'} />;
  }

  if (loading || !thisOrder) {
    return <Loading />;
  }

  function markOrderAsFulfilled() {
    showHideModal('fulfilOrder', true);
  }
  function confirmOrder() {
    let cart = thisOrder.cart;
    // console.log(cart);

    showHideModal('confirmOrder', true);
  }

  function cancelOrder() {
    // console.log(cart);
  }

  function showHideModal(name, show) {
    if (show === undefined) show = true;

    setModalState({
      ...modalState,
      [name]: show,
    });
  }

  function mapCartItemToProduct(uuid) {
    if (allCartProducts?.length) {
      console.log('Searching for product with uuid', uuid);
      const product = allCartProducts?.find(item => item.productId === uuid);
      console.log('Found ', product, allCartProducts);
      return product;
    }

    console.log('No cart products');
  }

  return (
    <>
      <div>
        {thisOrder?.customer && (
          <div style={{minHeight: '65vh'}}>
            <div>
              <div>
                <div style={{display: 'flex'}}>
                  <div style={{marginRight: '48px'}}>
                    <img
                      src={`https://api.adorable.io/avatars/285/${thisOrder.customer.email}`}
                      alt={'avatar'}
                    />
                    <div>
                      <h2>Personal information</h2>
                      <div>
                        <p>
                          {thisOrder.customer.firstName} {thisOrder.customer.lastName}
                        </p>
                      </div>
                      <div>
                        <p>{thisOrder.customer.phoneNumber}</p>
                      </div>
                      <div>
                        <p>{thisOrder.customer.email}</p>
                      </div>
                    </div>
                    <div>
                      <h2>Delivery Information</h2>
                      <p>Delivery Type</p>
                      <p>{thisOrder.delivery?.deliveryType}</p>
                      <p>Where</p>
                      <p>{thisOrder.delivery?.location}</p>
                    </div>
                    <div>
                      <h2>Payment Information</h2>
                      <p>Payment Method</p>
                      <p>{thisOrder.paymentMethod}</p>
                    </div>
                  </div>
                  {thisOrder.cart.cartItems.length && (
                    <div>
                      <h2>Order information</h2>
                      {thisOrder.cart.cartItems.map(cartItem => (
                        <div key={cartItem.productId}>
                          <div
                            style={{
                              border: '1px solid lightgrey',
                              borderRadius: '4px',
                              padding: '12px',
                              minWidth: '600px',
                            }}
                          >
                            <div>
                              <p>Name: {mapCartItemToProduct(cartItem.productId)?.name}</p>
                              <p>Quantity: {cartItem.quantity}</p>
                              <p>Subtotal: {cartItem.quantity * cartItem.price}</p>
                              <p>Product id: {cartItem.productId}</p>
                              <p>In stock: {cartItem.stock}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div style={{marginTop: '24px'}}>
                        <Modal isActive={modalState.confirmOrder}>
                          <ModalClose />
                          <ModalBackground />
                          <ModalContent>
                            <div style={{background: 'white', padding: 24, borderRadius: 4}}>
                              <h2>Are you sure you want to confirm this order?</h2>
                              <div>
                                <p>Make sure:</p>
                                <ul>
                                  <li>There is enough stock of products</li>
                                  <li>The email and phone number don't seem suspicious.</li>
                                </ul>
                                <p>
                                  An email address will be sent out to{' '}
                                  <b>{thisOrder.customer.email} </b> and a phone call should be made
                                  to <b>+254-{thisOrder.customer.phoneNumber} </b> to confirm the
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
                          </ModalContent>
                        </Modal>
                        <div>
                          <h4>Order total</h4>
                          <p>{thisOrder.cart.total}</p>
                        </div>
                        <div>
                          <Button onClick={() => showHideModal('confirmOrder')}>
                            Confirm Order
                          </Button>

                          <Button onClick={() => showHideModal('cancelOrder')}>Cancel Order</Button>

                          <Modal isActive={modalState.cancelOrder}>
                            <ModalClose />
                            <ModalBackground />
                            <ModalContent>
                              <div style={{background: 'white', padding: 24}}>
                                <h2>Are you sure you want to Cancel this order?</h2>
                                <p>
                                  An email address will be sent out to{' '}
                                  <b>{thisOrder.customer.email} </b>
                                </p>
                                <div>
                                  <Formik
                                    initialValues={{}}
                                    onSubmit={({setSubmitting}) => {
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
                            </ModalContent>
                          </Modal>
                        </div>
                        <div style={{marginTop: '16px'}}>
                          <Button>Mark as fulfilled.</Button>
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

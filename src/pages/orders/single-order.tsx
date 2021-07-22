import React, {useState} from 'react';
import {useApi} from '../../network';
import Layout from '../../components/Layout';
import Cart from '../../components/cart';
import useSWR from 'swr/esm/use-swr';
import Loading from '../../components/loading';
import {Button, Help} from 'bloomer';
import {extractErrorMessage} from '../../helpers';
import styled from 'styled-components';
import {OrderType} from '../../types';
import {EmptyState} from '../../components';
import {DeadEyes, DeadEyes2} from '../../constants/icons';
import {useNotify} from '../../hooks';
import {UserState} from '../../state/reducers/userReducers';
import {RootStateOrAny, useSelector} from 'react-redux';
import {mapStatus} from './index';
import CustomModal from '../../components/CustomModal';

const SingleOrder= function({match: {params: {orderId}}}) {

  const api = useApi();
  const notify = useNotify();

  const user: UserState = useSelector((state: RootStateOrAny)=> state.user)
  const orderDataFetcher = (orderId) => api.orders.getSingle(orderId).then(({data})=> data);
  const {data: orderData, error: fetchOrderError, mutate} = useSWR<OrderType>(
    user?.isLoggedIn ? [`/order/${orderId}`, orderId]: null,
    (url, orderId) => orderDataFetcher(orderId),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);

  if (!user?.isLoggedIn){
    return (
      <Layout>
        <EmptyState
          icon={DeadEyes2}
          title={'You must be lost'}
          message={'You have to be logged in to view this'}
        />
      </Layout>
    )
  }

  if (fetchOrderError){
    return (
      <Layout>
        <EmptyState
          icon={DeadEyes}
          message={'Something went wrong. Our best engineers have been informed and are working on it as you read this.'}
          title={"Oops. That's an error"}/>
      </Layout>
    )
  }

  if (!orderData) {
    return (
      <Loading/>
    )
  }

  async function cancelOrder({orderId}) {
    setIsLoading(true);
    try {
      const {data} = await api.orders.cancel({
        id: orderId,
      });
      // mutate so that changes show up immediately
      await mutate(data, false);
      notify.success("Your order has been cancelled.")
    }catch (e){
      const message = extractErrorMessage(e);
      notify.error(message);
    }
    setIsLoading(false);
  }


  return (
    <>
      <Layout
        internal
        style={{maxWidth: 600, margin: '0 auto'}}>
        <div style={{marginTop: 128}}>
          <div>
            <h2>Your Order</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <h4>
                Order no:
              </h4>
              <p>
                {orderData.orderNo}
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <h4>
                Payment type:
              </h4>
              <p>
                {
                  !orderData.paymentType ? 'Not selected' :
                    orderData.paymentType === 'pay-on-delivery' ? 'Pay on delivery' :
                      'Pay online'
                }
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <h4>
              Status:
            </h4>
            <OnHover>
              {
                mapStatus(orderData.status, {
                  pendingConfirmation: orderData.paymentType === 'pay-on-delivery' ? null :
                    // if the user opted to pay online, 'pendingConfirmation' means we've received their
                    // payment
                    'We have received your payment. We\'ll call you in an hour or two to confirm this order.',
                })
              }
            </OnHover>
          </div>
          <div>
            <Cart
              bordered={true}
              hideCloseButton={true}
              title={true}
              //@ts-ignore
              source={orderData.cart}
              hideCheckoutButton={
                orderData.status === 'pendingConfirmation' ||
                orderData.status === 'delivered' ||
                orderData.status === 'cancelled'
              }
              checkoutButtonText={'Complete this order'}
            />
          </div>
          <div>
            <h4>Other options</h4>
            {
              (
                orderData.status !== 'incomplete' &&
                orderData.status !== 'inTransit' &&
                orderData.status !== 'cancelled'
              ) && (
                <Button
                  onClick={() => setIsCancelOrderModalOpen(true)}
                  isColor={'ghost'}
                >
                  Cancel this order
                </Button>
              )
            }
            <div>
              {
                orderData.status === 'cancelled' && (
                  <Help>
                    <Button
                      style={{borderBottom: '1px solid lightgray'}}
                      isColor={'ghost'}>
                      Delete this order
                    </Button>
                  </Help>
                )
              }
            </div>
            <div>
              {
                orderData.status === 'delivered' && (
                  <Help>
                    <Button
                      style={{borderBottom: '1px solid lightgray'}}
                      isColor={'ghost'}>
                      File a new claim
                    </Button>
                  </Help>
                )
              }
            </div>
          </div>
        </div>
        <CustomModal
          isActive={isCancelOrderModalOpen}
          onClose={() => setIsCancelOrderModalOpen(false)}>
          <div>
            <h2>Cancel this order?</h2>
            <p>
              You are about to cancel your order. This action can not be reversed.
            </p>
            <p>
              Do you want to proceed?
            </p>
            <div>
              <Button
                style={{marginRight: 12}}
                isColor={'primary'}
                isLoading={isLoading}
                onClick={async () => {
                  try {
                    await cancelOrder({
                      orderId,
                    });
                    setIsCancelOrderModalOpen(false);
                    setIsLoading(false);
                  } catch (e) {
                    const message = extractErrorMessage(e);
                    notify.error(message);
                  }
                }}>
                Cancel your order
              </Button>
              <Button>
                Exit
              </Button>
            </div>
          </div>
        </CustomModal>
      </Layout>
    </>
  );
};

const OnHover = styled.div`
  &:hover {
    cursor: help;
  }
`

export default SingleOrder;

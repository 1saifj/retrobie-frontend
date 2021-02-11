import React, {useState} from 'react';
import {useAuth} from '../../network';
import Layout from '../../components/Layout';
import Cart from '../../components/cart';
import useSWR from 'swr/esm/use-swr';
import Loading from '../../components/loading';
import {Button, Help, Tag} from 'bloomer';
import {capitalize, extractErrorMessage} from '../../helpers';
import styled from 'styled-components';
import {Tooltip} from 'react-tippy';
import {OrderStatus, OrderType} from '../../types';
import {EmptyState} from '../../components';
import {DeadEyes, DeadEyes2} from '../../constants/icons';
import {useNotify} from '../../hooks';
import {UserState} from '../../state/reducers/userReducers';
import {RootStateOrAny, useSelector} from 'react-redux';

export default function({match: {params: {orderId}}}) {

  const api = useAuth();
  const notify = useNotify();


  const user: UserState = useSelector((state: RootStateOrAny)=> state.user)
  const orderDataFetcher = (orderId) => api.orders.getSingle(orderId).then(({data})=> data);
  const {data: orderData, error: fetchOrderError, mutate} = useSWR<OrderType>(
    user?.isLoggedIn ? [`/order/${orderId}`, orderId]: null,
    (url, orderId) => orderDataFetcher(orderId),
  );

  const [isLoading, setIsLoading] = useState(false);

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

  function mapStatus(status: OrderStatus) {
    if (!status) return <Tag>Undefined</Tag>;

    switch (status) {
      case 'cancelled':
        return (
          <Tooltip
            theme={'light'}
            position={'right'}
            title={'You cancelled this order. It will not be processed.'}
          >
            <Tag isColor={'danger'}>Cancelled</Tag>
          </Tooltip>
        );
      case 'delivered':
        return <Tag isColor={'success'}>{capitalize(status)}</Tag>;
      case 'inTransit':
        return (
          <Tooltip
            theme={'light'}
            position={'right'}
            title={'This order has been picked up and is on its way.'}
          >
            <Tag>In transit</Tag>
          </Tooltip>
        )
      case 'incomplete':
      case 'pendingPayment':
        return (
          <Tooltip
            theme={'light'}
            position={'right'}
            title={'You have not paid for this order. It will not be processed.'}
          >
            <Tag>Incomplete</Tag>
          </Tooltip>
        );
      default:
        return <Tag>{capitalize(status)}</Tag>;
      case 'pendingConfirmation':
        return (
          <Tooltip
            theme={'light'}
            position={'right'}
            title={'Your payment has been received. We will call you to confirm delivery details.'}
          >
            <Tag isColor={'info'}>Pending Confirmation</Tag>
          </Tooltip>
        );
    }
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
                mapStatus(orderData.status)
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
                  onClick={async () => await cancelOrder({
                    orderId,
                  })}
                  isLoading={isLoading}
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
      </Layout>
    </>
  );
};

const OnHover = styled.div`
  &:hover {
    cursor: help;
  }
`
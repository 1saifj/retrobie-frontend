import { Button } from 'bloomer';
import React from 'react';
import {EmptyState, Layout, Loading} from '../../components';
import {GrimacingEmoji, SecurityGuard, SmilingWithEyesEmoji} from '../../constants/icons';
import useSWR from 'swr/esm/use-swr';
import {OrderStatus, PaymentStatus} from '../../types';
import {UserState} from '../../state/reducers/userReducers';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useApi} from '../../hooks';
import NotFound from '../../components/not-found';

const OrderCompletedPage = function(props) {

  const orderId = props.match.params.orderId;

  const user: UserState = useSelector((state: RootStateOrAny) => state.user);
  const api = useApi();

  const orderDataFetcher = (key, orderId) => api.orders.checkStatus(orderId).then(({data}) => data);
  const {data: orderStatusResult, error: fetchOrderStatusError} = useSWR<{
    paymentStatus: PaymentStatus,
    orderStatus: OrderStatus,
    referenceNo: string
  }>(user.isLoggedIn ? [`orders/${orderId}/status`, orderId]: null, orderDataFetcher)


  if (!user.isLoggedIn){
    return (
      <Layout>
        <EmptyState
          icon={SecurityGuard}
          centerAlign={true}
          title={'You\'re not allowed view this.'}
          message={'You need to be logged in to view this page.'}
        />
      </Layout>
    );
  }

  if (fetchOrderStatusError){
    return (
      <Layout>
        <EmptyState
          centerAlign={true}
          icon={GrimacingEmoji}
          iconWidth={52}
          title={'Yikes that\'s an error'}
          message={'Something went wrong while fetching your order status. Please try again in a short while.'}
        />
      </Layout>
    );
  }

  if (!orderStatusResult){
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  if (orderStatusResult?.orderStatus === "pendingPayment")
    return (
      <Layout>
        <div>
          <EmptyState
            icon={'https://ik.imagekit.io/t25/development/order-completed_5XPuIXI9k.png'}
            centerAlign={false}
            message={() => (
              <div>
                <p>
                  Thanks for making an order with us. It means a lot.
                </p>
                <p>
                  We will call you in an hour or two to confirm the delivery
                  details. Otherwise, feel free to leave this page or click the button below to track your
                  order status.
                </p>
                <p>
                  Feel free to reach us on our socials if the experience was smooth, or
                  spread the word to your friends <img
                  style={{width: 20, verticalAlign: 'sub'}}
                  alt={'smiling with eyes emoji'}
                  src={SmilingWithEyesEmoji} />
                </p>
              </div>
            )}
            title={'Your order has been completed'}
            prompt={() => (
              <Button
                style={{width: '100%'}}
                isColor={'primary'}>
                Track your order
              </Button>
            )}
          />
        </div>
      </Layout>
    );

  return (
    <NotFound message={"We're not sure what you're looking for, but it isn't here."}/>
  )
}

export default OrderCompletedPage;

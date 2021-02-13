import React from 'react';
import styled from 'styled-components';
import {Tag} from 'bloomer';
import {Link} from 'react-router-dom';
import {capitalize} from '../../helpers';
import useSWR from 'swr/esm/use-swr';
import {useAuth} from '../../hooks';
import {EmptyState, Layout, Loading, RetroImage} from '../../components';
import {OrderType} from '../../types';
import {DeadEyes, EmptyBox, GrimacingEmoji} from '../../constants/icons';
import {UserState} from '../../state/reducers/userReducers';
import {RootStateOrAny, useSelector} from 'react-redux';

const OrderItem = styled.div`
  padding: 12px 24px;
  margin-bottom: 8px;
  border: 1px solid lightgray;
  border-radius: 2px;
  transition: all 0.25s ease-in-out;
  display: flex;
  gap: 4px;
  
  &:hover {
    cursor: pointer;
  }
`

const AllOrders = function() {

  const api = useAuth();

  const user: UserState = useSelector((state: RootStateOrAny) => state.user)

  const myOrderFetcher = () => api.orders.mine('CartProducts').then(({data})=> {
    if (data) {
      return data.map((order) => {
        const {cartItems, ...rest} = order.cart;
        return {
          ...order,
          cart: {
            ...rest,
            items: cartItems
          },
        };
      });
    }
  });
  const {data: userOrders, error: fetchOrdersError} = useSWR<OrderType[]>(
    user?.isLoggedIn ? '/orders/mine': null,
    myOrderFetcher
  );

  if (!user.isLoggedIn){
    return (
      <Layout>
        <EmptyState
          icon={GrimacingEmoji}
          title={`We don't know each other like that`}
          message={'You have to be logged in to view this page.'}
        />
      </Layout>
    )
  }

  if (fetchOrdersError){
    return (
      <Layout>
        <EmptyState
          icon={DeadEyes}
          message={'Something went wrong. Our best engineers have been informed and are working on it as you read this.'}
          title={"Oops. That's an error"}/>
      </Layout>
    )
  }


  if (!userOrders) {
    return (
      <Loading/>
    )
  }

  if (!userOrders.length) {
    return (
      <Layout>
        <EmptyState
          icon={EmptyBox}
          iconWidth={56}
          centerAlign={true}
          title={"You haven't made any orders yet"}
          message={'Make a few orders and check back later.'}
        />
      </Layout>
    )
  }

  function mapStatus(status) {
    if (!status) return <Tag>Undefined</Tag>;

    switch (status) {
      case 'cancelled':
        return <Tag isColor='danger'>Cancelled</Tag>;
      case 'fulfilled':
        return <Tag isColor={'success'}>Fulfilled</Tag>;
      case 'incomplete':
        return <Tag>Incomplete</Tag>;
      case 'pendingPayment':
        return <Tag>Not yet paid</Tag>;
      default:
        return <Tag>{capitalize(status)}</Tag>;
      case 'finalized':
        return <Tag isColor={'info'}>Finalized</Tag>;
    }
  }

  return (
    <div>
      <Layout
        internal
        style={{width: '80%', margin: '0 auto', marginTop: 148}}>
        <div style={{margin: "24px 48px"}}>
          <div>
            <h2>Your Orders</h2>
          </div>
          <div>
            {
              userOrders?.length  && userOrders.map((order: OrderType) => {
                if (order.cart) {
                  return (
                    <>
                      <Link to={`/orders/mine/${order.uuid}`}>
                        <OrderItem>
                          <div>
                            {
                              order.cart.count === 0 ? (
                                <RetroImage
                                  alt={`${order.cart.items[0].productName} thumbail`}
                                  src={order.cart?.items?.[0].thumbnailUrl}/>
                              ) : (
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))'}}>
                                  {
                                    // only map the first 4 items
                                    order.cart.items.slice(0, 4).map(item=> (
                                      <RetroImage
                                        style={{width: 80}}
                                        src={item.thumbnailUrl}
                                        alt={`${item.productName} thumbnail`}/>
                                    ))
                                  }
                                </div>
                              )
                            }

                          </div>
                          <div style={{display: 'flex', gap: 48, alignItems: 'center'}}>
                            <div style={{flex: '1 0 250px'}}>
                              {
                                // map the first 4 products and grab their names
                                order.cart.items?.slice(0, 4).map((item)=> item.productName)
                                  .map((productName, index)=> (
                                    <p>
                                      <strong>
                                        {/*make sure everything but the last item has a comma*/}
                                        {productName} {index !== order.cart.items.length - 1 && ", "}
                                      </strong>
                                    </p>
                                  ))
                              }

                              <p>
                                {
                                  //only show the quantity if there's one item
                                  order.cart.count === 1 && (
                                    <span>
                                      X {order.cart.items[0].quantity}
                                    </span>
                                  )
                                }
                              </p>
                            </div>
                            <div>
                              <p>Order no: {order.orderNo}</p>
                              <p>{mapStatus(order.status)}</p>
                            </div>
                          </div>
                        </OrderItem>
                      </Link>
                    </>
                  );

                }

                return <p>Loading...</p>
              })
            }
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AllOrders;
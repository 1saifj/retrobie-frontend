import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Card, Tag} from 'bloomer';
import {OrderType} from '../../../../types';
import {useDispatch} from 'react-redux';
import {useAuth} from '../../../../network';
import {Link} from 'react-router-dom';

const OrderItem = styled(Card)`
  padding: 12px 24px;
  margin-bottom: 8px;
  border-radius: 2px;
  transition: all 0.25s ease-in-out;
  display: flex;
  gap: 24px;
  
  &:hover {
    cursor: pointer;
    transform: translateY(-4px);
  }
`

export default function() {

  const api = useAuth();

  const [userOrders, setUserOrders] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(api.orders.mine('CartProducts'))
      // @ts-ignore
      .then(response=> {
        if (response?.data) {
          const mappedOrders = response.data.map((order) => {
            const {cartItems, ...rest} = order.cart;
            return {
              ...order,
              cart: {
                ...rest,
                items: cartItems
              },
            };
          });
          setUserOrders(mappedOrders);
        }
      })
  }, []);

  function mapStatus(status) {
    if (!status) return <Tag>Undefined</Tag>;

    switch (status) {
      case 'cancelled':
        return <Tag isColor='danger'>Cancelled</Tag>;
      case 'fulfilled':
        return <Tag isColor={'success'}>Fulfilled</Tag>;
      case 'created':
      default:
        return <Tag>Created</Tag>;
      case 'finalized':
        return <Tag isColor={'info'}>Finalized</Tag>;
    }
  }

  return (
    <>
      <div>
        {
          userOrders?.length  && userOrders?.map((order: OrderType) => {
            if (order.cart) {
              if (order.cart?.count === 1){
                return (
                  <>
                    <Link to={`/orders/mine/${order.uuid}`}>
                      <OrderItem>
                        <div>
                          <img
                            src={order.cart?.items?.[0].parentProduct.images[0].thumbnailUrl}/>
                        </div>
                        <div style={{display: 'flex', gap: 48, alignItems: 'center'}}>
                          <div>
                            <p>
                              <strong>
                                {order.cart.items?.[0].parentProduct.name}
                              </strong>
                            </p>
                            <p>
                            <span>
                              X {order.cart.items[0].quantity}
                            </span>
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

              return <span>Too many products</span>
            }

            return <p>Loading...</p>
          })
        }
      </div>
    </>
  );
};
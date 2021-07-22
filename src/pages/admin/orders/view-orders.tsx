import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import useSWR from 'swr';
import {useApi} from '../../../network';
import {Loading} from '../../../components';
import {OrderType} from '../../../types';
import {formatNumberWithCommas} from '../../../helpers';

export default function AdminOrders() {
  const api = useApi();
  const [allOrders, setAllOrders] = useState<Array<OrderType>>([]);

  const allOrdersFetcher = () => api.orders.getAll().then(({data}) => data);
  const {data: allOrdersData} = useSWR('/orders/all', allOrdersFetcher);

  useEffect(() => {
    setAllOrders(allOrdersData);
  }, [allOrdersData]);


  if (!allOrdersData) {
    return (
      <Loading/>
    )
  }

  function getPaidOrders() {
    return allOrders?.filter(order => order.status === "pendingConfirmation");
  }

  function getPendingPaymentOrders() {
    return allOrders?.filter(order => order.status === "pendingPayment");
  }

  function getIncompleteOrders() {
    return allOrders?.filter(order => order.status === "incomplete");
  }

  return (
    <>
      <div>
        <div>
          <div>
            <h2>Pending payment orders</h2>
            {getPendingPaymentOrders()?.length ? (
              getPendingPaymentOrders().map((order, index) => (
                <SingleOrder key={order.uuid}>
                  <Link to={`orders/${order.uuid}`}>
                    <div>
                      <p>Order # {index}</p>
                      <p>Order value: {order.cart.total}</p>
                    </div>
                  </Link>
                </SingleOrder>
              ))
            ) : (
              <div>
                <p>No pending payment orders</p>
              </div>
            )}
          </div>
          <div>
            <h2>Paid orders</h2>
            {getPaidOrders()?.length ? (
              getPaidOrders().map((order, index) => (
                <SingleOrder key={order.uuid}>
                  <Link to={`orders/${order.uuid}`}>
                    <div>
                      <p>Order # {index}</p>
                      <p>Order value: {order.cart.total}</p>
                    </div>
                  </Link>
                </SingleOrder>
              ))
            ) : (
              <div>
                <p>No completed orders</p>
              </div>
            )}
          </div>
          <div>
            <h2>Incomplete orders</h2>
            {getIncompleteOrders()?.map((order, index) => (
              <SingleOrder key={order.uuid}>
                <Link to={`orders/${order.uuid}`}>
                  <div>
                    <p>Order # {index}</p>
                    <p>Order value: {formatNumberWithCommas(order.cart.total)}</p>
                  </div>
                </Link>
              </SingleOrder>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const SingleOrder = styled.div`
  border: 1px solid darkblue;
  padding: 18px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

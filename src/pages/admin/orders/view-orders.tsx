import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import useSWR from 'swr';
import {useAuth} from '../../../network';
import {Loading} from '../../../components';
import {OrderType} from '../../../types';
import {formatNumberWithCommas} from '../../../helpers';

export default function AdminOrders() {
  const api = useAuth();
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

  function getCompletedOrders() {
    return allOrders?.filter(order => order.status === "pending_confirmation");
  }

  function getIncompleteOrders() {
    return allOrders?.filter(order => order.status === "incomplete");
  }

  return (
    <>
      <div>
        <div>
          <div>
            <h2>Completed orders</h2>
            {getCompletedOrders()?.length ? (
              getCompletedOrders().map((order, index) => (
                <SingleOrder key={order.uuid}>
                  <Link to={`orders/single/${order.uuid}`}>
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
                <Link to={`orders/single/${order.uuid}`}>
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

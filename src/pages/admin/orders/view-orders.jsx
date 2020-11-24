import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {useQuery} from 'react-query';
import useApi from '../../../network/useApi';
import useSWR from 'swr';

export default function AdminOrders() {
  const api = useApi();
  const [allOrders, setAllOrders] = useState([]);

  const {data: allOrdersResponse} = useSWR('/orders/all', api.orders.getAll);

  useEffect(() => {
    setAllOrders(allOrdersResponse?.data);
  }, [allOrdersResponse]);

  function getCompletedOrders() {
    return allOrders?.filter(order => order.completed);
  }

  function getIncompleteOrders() {
    return allOrders?.filter(order => !order.completed);
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
                    <p>Order value: {order.cart.total}</p>
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

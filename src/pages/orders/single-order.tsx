import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useAuth} from '../../network';
import Layout from '../../components/Layout';

export default function({match: {params: {orderId}}}) {

  const api = useAuth();
  const dispatch = useDispatch();

  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    dispatch(api.orders.getSingle(orderId))
      // @ts-ignore
      .then(({data})=> {
        setOrderData(data);
      })
  }, []);
  return (
    <>
      {/*@ts-ignore*/}
      <Layout style={{padding: "12px 48px"}}>
        <pre>
          {JSON.stringify(orderData, null, 3)}
        </pre>
      </Layout>
    </>
  );
};
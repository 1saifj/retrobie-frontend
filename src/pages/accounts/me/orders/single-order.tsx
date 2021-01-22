import React from 'react';
import {useAuth} from '../../../../network';
import Layout from '../../../../components/Layout/index';
import Cart from '../../../../components/cart';
import useSWR from 'swr/esm/use-swr';
import Loading from '../../../../components/loading';
import {Button, Help, Tag} from 'bloomer';
import {capitalize} from '../../../../helpers';
import styled from 'styled-components';
import {Tooltip} from 'react-tippy';

export default function({match: {params: {orderId}}}) {

  const api = useAuth();

  const orderDataFetcher = (orderId) => api.orders.getSingle(orderId).then(({data})=> data);
  const {data: orderData} = useSWR(['order/data', orderId], (url , orderId)=> orderDataFetcher(orderId))

  if (!orderData) {
    return (
      <Loading/>
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
      case 'finalized':
        return <Tag isColor={'info'}>Finalized</Tag>;
    }
  }

  return (
    <>
      {/*@ts-ignore*/}
      <Layout style={{maxWidth: 600, margin: '0 auto'}}>
        <div style={{marginTop: 128}}>
          <div>
            <h2>Your Order</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4
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
            gap: 4
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
              source={orderData.cart}
              hideCheckoutButton={false}
              checkoutButtonText={"Complete this order"}
            />
          </div>
          <div>
            <Help>
              If not completed, this order will be deleted automatically after a week.{" "}
              <Button
                style={{borderBottom: '1px solid lightgray'}}
                isColor={'ghost'}>
                Delete it now
              </Button>
            </Help>
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
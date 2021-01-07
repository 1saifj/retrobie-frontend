import React, {useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import styled from 'styled-components';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {addDashes, formatNumberWithCommas} from '../../helpers';
import EmptyState from '../../components/empty/EmptyState';
import {ErrorIconDark, NormalCart} from '../../constants/icons';
import {Button} from 'bloomer';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import RadioField from '../../components/input/RadioField';
import LipaNaMpesa from '../../assets/images/logos/lipa-na-mpesa.png';
import MpesaLogo from '../../assets/images/logos/mpesa.svg';
import PeaceSign from '../../assets/images/emoji/peace-sign.png';
import PointingDown from '../../assets/images/emoji/backhand-index-pointing-down.png';
import IndexFinger from '../../assets/images/emoji/backhand-index-pointing-up.png';
import {ChevronRight} from 'react-feather';
import {notify} from '../../helpers/views';
import TextField from '../../components/input/TextField';
import SimpleMap from '../../components/map/SimpleMap';
import Loading from '../../components/loading';
import {useAuth} from '../../network';
import PayWithMpesaOnlineModal from './PayWithMpesaOnlineModal';
import {ThunkDispatch} from 'redux-thunk';
import {UserState} from '../../state/reducers/userReducers';
import {AnyAction} from 'redux';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import {AddressType, CheckoutType, OrderType} from '../../types';
import useSwr from 'swr'
import useSWR from 'swr/esm/use-swr';
import {saveCheckoutAddressAction, saveShippingQuoteAction, setZoomLevelAction} from '../../state/actions';

const CompleteOrderValidationSchema = Yup.object({
  deliveryLocation: Yup.string().required(),
  paymentMethod: Yup.string().required(),
});

export default function Shipping(props) {
  const api = useAuth();
  const dispatch: ThunkDispatch<UserState, any, AnyAction> = useDispatch();
  const userInfoFetcher = ()=> api.accounts.me().then(({data}) => data);
  const {data: userInfo, error} = useSwr('me', userInfoFetcher)

  const paramOrderId = props.match.params.orderId;
  const [[deliveryLng, deliveryLat], setDeliveryLocation] = useState([null, null]);
  const [payNowOrOnDelivery, setPayNowOrOnDelivery] = useState<"pay-on-delivery"|"pay-now">(null);
  // @ts-ignore
  const [completedOrder, setCompletedOrder] = useState({});
  const checkout: CheckoutType = useSelector((state: RootStateOrAny) => state.user.checkout);
  const {total: checkoutTotal, delivery: checkoutDelivery} = checkout;
  const [payOnlineOrBuyGoods, setPayOnlineOrBuyGoods] = useState<"pay-online"|"buy-goods">(null);
  const [isPayOnlineModalOpen, setPayOnlineModalOpen] = useState(false);

  const orderDataFetcher = (orderId) => api.orders.getSingle(orderId).then(({data})=> data);
  const {data: orderInfo} = useSWR(['order/data', paramOrderId], (url , orderId)=> orderDataFetcher(orderId))

  useEffect(() => {

  }, []);

  function flip(value?) {
    setPayOnlineOrBuyGoods(value)
  }

  if (!checkout.items?.length) {
    console.log("Current checkout ")
    return (
      <EmptyState
        title={'Your Cart is Empty'}
        icon={NormalCart}
        message={'Do some shopping and try that again.'}
        prompt={() => (
          <Button
            isColor="primary"
            onClick={() => props.history.push('/')}
            style={{marginTop: '12px', width: '250px'}}
          >
            Start Shopping
          </Button>
        )}
      />
    );
  }

  if (!paramOrderId) {
    return (
      <EmptyState
        message={'Invalid order. Please try that again.'}
        title={'Invalid order'}
        icon={ErrorIconDark}
      />
    )
  }

  if (!orderInfo) {
    return <Loading message={'Please wait...'}/>;
  }

  function completeOrder(order) {
    if (!order?.payNowOrOnDelivery) {
      notify('info', 'Please select a payment method to proceed');
    }
  }

  async function getDeliveryQuote(address: AddressType){
    return api.deliveries.getQuote({
      location: {
        lat: address.lat,
        long: address.lng,
        name: address.location,
      },
      recipient: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        phoneNumber: userInfo.phoneNumber,
      },
    });
  }

  function setZoomLevel(level){
    dispatch(setZoomLevelAction({level}));
  }

  async function onLocateUser(address: AddressType){
    saveCheckout(address);
    try {
      const {data} = await getDeliveryQuote(address);
      dispatch(saveShippingQuoteAction(data))
    }catch (e){
      notify('error', 'Could not get shipping quote')
    }
  }

  function saveCheckout({lat, lng, location, placeId}: AddressType){
    setDeliveryLocation([lng, lat]);
    dispatch(saveCheckoutAddressAction({
        address: {
          placeId,
          location,
          lat,
          lng,
        },
      }),
    );

  }

  return (
    <Layout>
      {/*only one child*/}
      <CompleteOrderRoot>
        <div>
          <h2>Complete your order</h2>
          <h3>Select a Delivery Location</h3>
          <Formik
            initialValues={{}}
            validationSchema={CompleteOrderValidationSchema}
            onSubmit={() => {

            }}
          >
            {({}) => (
              <Form>
                <div>
                  <div>
                    <p>
                      Use the button below to detect your current location, or drag the red marker
                      to your desired delivery location
                    </p>
                    <SimpleMap
                      initialZoom={checkout?.meta?.zoomLevel}
                      onZoom={(level => {
                        setZoomLevel(level)
                      })}
                      initialLocation={{
                        location: checkout?.delivery?.address.location,
                        value: {
                          placeId: checkout?.delivery?.address.placeId,
                          lat: checkout?.delivery?.address?.lat || deliveryLng,
                          lng: checkout?.delivery?.address?.lng || deliveryLat,
                        },
                      }}
                      help={`Note: the marker does not have to be 100% accurate -
                             just close enough to know your general location.`}
                      onLocateUser={(
                        [lng, lat],
                        item,
                      ) => onLocateUser(
                        {
                          lat, lng,
                          location: item?.location,
                          placeId: item?.value.placeId,
                        },
                      )}/>
                    <div>
                      <div>
                        <div>
                          <h3>Detailed information</h3>
                          <p>
                            Fill in the following form if the above map doesn't work,
                            or if you wish to add any information that will make finding your location easier.
                          </p>
                        </div>
                        <TextField
                          label={'Estate'}
                          placeholder={'eg. TRM'}
                          name={'nearby'}
                          type={'text'}/>
                        <TextField
                          label={'Delivery address'}
                          placeholder={'Estate name / Building name / Block no. / Apartment no.'}
                          name={'place'}
                          type={'textarea'}/>
                      </div>

                    </div>


                  </div>

                  <hr/>
                  <div>
                    <h3>Choose a Payment Option</h3>
                    <p>Would you like to pay now or, after we've delivered your stuff?</p>
                    <div className="payment-options">
                      <div>
                        <RadioField
                          name={'payment-method'}
                          isGroup={true}
                          inline
                          bordered
                          onChange={value => {
                            setPayNowOrOnDelivery(value);
                            setCompletedOrder({
                              payNowOrOnDelivery,
                            });
                          }}
                          options={[
                            {
                              value: 'pay-now',
                              label: 'Pay now',
                            },
                            {
                              value: 'pay-on-delivery',
                              label: 'Pay on Delivery',
                            },
                          ]}
                        />
                      </div>
                    </div>

                    <hr/>
                    <div>
                      <div>
                        <h3>Confirm your order</h3>
                      </div>
                      <SwitchTransition mode={'out-in'}>
                        <CSSTransition
                          timeout={250}
                          key={payNowOrOnDelivery}
                          classNames="fade"
                        >
                          <div>
                            {
                              !payNowOrOnDelivery &&
                              <p>
                                Select a payment method {' '}
                                <img
                                  src={IndexFinger}
                                  alt={'finger pointing up emoji'}
                                  style={{width: 16}}
                                />{' '}
                                to confirm your order
                              </p>
                            }
                            {
                              payNowOrOnDelivery === 'pay-now' && (
                                <div>
                                  <SwitchTransition mode={'out-in'}>
                                    <CSSTransition
                                      timeout={250}
                                      key={payOnlineOrBuyGoods}
                                      classNames="fade"
                                    >
                                      <div>
                                        <div className={'pay-online'}>
                                          <div
                                            className={'header'}
                                            onClick={() => flip('pay-online')}
                                          >
                                            <div>
                                              <h4>Option 1: Pay Online</h4>
                                              <p>Receive a prompt on your phone and enter your M-Pesa PIN.</p>
                                            </div>
                                            <ChevronRight
                                              style={{
                                                transform: payOnlineOrBuyGoods === 'pay-online' ? 'rotate(90deg)': '0'
                                              }}
                                              className={'chevron'}/>
                                          </div>
                                          <div>
                                            {payOnlineOrBuyGoods === 'pay-online' && (
                                              <div className={'pay-online'}>
                                                <Button
                                                  isColor="primary"
                                                  onClick={() => setPayOnlineModalOpen(true)}
                                                >
                                                  Pay with &nbsp;
                                                  <img
                                                    style={{width: 80}}
                                                    alt={'mpesa logo'}
                                                    src={MpesaLogo}
                                                  />{' '}
                                                  &nbsp; Online
                                                </Button>
                                                <div className={'steps'}>
                                                  <h4>Steps</h4>
                                                  <ol>
                                                    <li>
                                                      You will automatically receive a prompt at your phone number:
                                                      <b> +254-{addDashes(userInfo?.phoneNumber)}</b>&nbsp;
                                                    </li>
                                                    <li>
                                                      Enter your PIN number to confirm payment of the requested
                                                      amount.
                                                    </li>
                                                    <li>
                                                      <b>Your order will be confirmed immediately</b> after the
                                                      payment is received.
                                                    </li>
                                                    <li>
                                                      Sit back and relax.
                                                      <img
                                                        src={PeaceSign}
                                                        style={{width: 16}}
                                                        alt={'peace'}
                                                      />{' '}
                                                      We'll take care of the rest.
                                                    </li>
                                                  </ol>
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                        </div>

                                        <hr/>

                                        <div className={'buy-goods'}>
                                          <div
                                            className={'header'}
                                            onClick={() => flip('buy-goods')}
                                          >
                                            <div>
                                              <h4>Option 2: Buy Goods Till Number</h4>
                                              <p>Enter the till number yourself</p>
                                            </div>
                                            <ChevronRight
                                              style={{
                                                transform: payOnlineOrBuyGoods === 'buy-goods' ? 'rotate(90deg)': '0'
                                              }}
                                              className={'chevron'}/>
                                          </div>
                                          <SwitchTransition mode={'out-in'}>
                                            <CSSTransition
                                              timeout={250}
                                              key={payOnlineOrBuyGoods}
                                              classNames="fade"
                                            >
                                              <div>
                                                {payOnlineOrBuyGoods === 'buy-goods' && (
                                                  <div className={'lipa-na-mpesa'}>
                                                    <img
                                                      title="mpesa"
                                                      src={LipaNaMpesa}
                                                      alt="mpesa logo"
                                                      style={{display: 'block', margin: '0 auto'}}
                                                    />

                                                    <div
                                                      style={{
                                                        textAlign: 'center',
                                                      }}
                                                    >
                                                      <h2
                                                        style={{
                                                          color: 'white',
                                                        }}
                                                      >
                                                        Buy Goods Till Number
                                                      </h2>
                                                      <div className={'boxes'}>
                                                        <div>
                                                          <div>1</div>
                                                        </div>
                                                        <div>
                                                          <div>4</div>
                                                        </div>
                                                        <div>
                                                          <div>4</div>
                                                        </div>
                                                        <div>
                                                          <div>5</div>
                                                        </div>
                                                        <div>
                                                          <div>9</div>
                                                        </div>
                                                        <div>
                                                          <div>1</div>
                                                        </div>
                                                      </div>
                                                      <div>
                                                        <h3
                                                          style={{
                                                            color: 'white',
                                                            marginTop: 0,
                                                          }}
                                                        >
                                                          RETROBIE LTD
                                                        </h3>
                                                      </div>
                                                    </div>

                                                    <div className={'steps'}>
                                                      <h4>Steps</h4>
                                                      <div>
                                                        <ol>
                                                          <li>Open the M-Pesa app</li>
                                                          <li>
                                                            Tap on <b>Lipa Na M-Pesa</b>
                                                          </li>
                                                          <li>
                                                            Tap on <b>Buy Goods and Services</b>
                                                          </li>
                                                          <li>
                                                            Enter the till number above.
                                                            <img
                                                              src={IndexFinger}
                                                              alt={'finger pointing up emoji'}
                                                              style={{width: 16}}
                                                            />
                                                          </li>
                                                          <li>Enter your M-Pesa PIN</li>
                                                          <li>
                                                            Click the button below to
                                                            complete your order.
                                                            <img
                                                              src={PointingDown}
                                                              style={{
                                                                width: 16,
                                                                verticalAlign: 'middle',
                                                              }}
                                                              alt={'peace'}
                                                            />{' '}
                                                            We'll let you know (via email) when
                                                            the payment comes through.
                                                          </li>
                                                        </ol>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </CSSTransition>
                                          </SwitchTransition>
                                          <hr/>
                                        </div>
                                      </div>
                                    </CSSTransition>
                                  </SwitchTransition>

                                </div>
                              )}

                            {
                              payNowOrOnDelivery === 'pay-on-delivery' && (
                                <div>
                                  <p>
                                    Click on the button below
                                    <img
                                      src={PointingDown}
                                      style={{
                                        width: 16,
                                        verticalAlign: 'middle',
                                      }}
                                      alt={'emoji pointing down'}
                                    />{' '}
                                    to complete your order. <b>We'll call you</b> to confirm the delivery
                                    details.
                                  </p>
                                </div>
                              )}
                          </div>

                        </CSSTransition>
                      </SwitchTransition>

                    </div>
                    <Totals>
                      <div>
                        <h3>The maths</h3>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                      }}>
                        <div>
                          <p>Checkout</p>
                          <p>Shipping</p>
                        </div>
                        <div>
                          <p>
                            <b>
                              Ksh. {formatNumberWithCommas(checkout.total)}
                            </b>
                          </p>
                          {
                            checkoutDelivery?.cost ? (
                              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span>
                                  <b>
                                    Ksh.
                                  </b>
                                </span>
                                <span>
                                    <b>
                                      {formatNumberWithCommas(checkoutDelivery.cost)}
                                    </b>
                                </span>
                              </div>
                            ) : (
                              <p>
                                Not yet calculated
                              </p>
                            )
                          }
                        </div>
                      </div>
                      <div className={'subtotal'}>
                        <h4>Total</h4>
                        <h3>Ksh.{" "}
                          {
                            checkoutDelivery?.cost ?
                              formatNumberWithCommas(checkoutTotal + checkoutDelivery?.cost) :
                              formatNumberWithCommas(checkoutTotal)
                          }
                        </h3>
                      </div>
                    </Totals>
                  </div>

                  {
                    payNowOrOnDelivery === 'pay-now' &&
                    payOnlineOrBuyGoods === 'pay-online' ?
                      (
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 24}}>
                          <div style={{width: '100%', textAlign: 'center'}}>
                            <Button
                              isColor="primary"
                              disabled
                              style={{width: '100%', fontWeight: 'bold'}}
                            >
                              Your order will be confirmed automatically
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {
                            payNowOrOnDelivery === 'pay-on-delivery' ||
                            payOnlineOrBuyGoods === 'buy-goods'
                              ?
                              <div style={{display: 'flex', justifyContent: 'center', marginTop: 24}}>
                                <Button
                                  isColor="primary"
                                  onClick={() => completeOrder({})}
                                  style={{width: '100%', fontWeight: 'bold'}}
                                >
                                  Complete your order
                                </Button>
                              </div> :
                              <div/>
                          }
                        </div>
                      )

                  }
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <PayWithMpesaOnlineModal
          isActive={isPayOnlineModalOpen}
          onClose={() => setPayOnlineModalOpen(false)}
          meta={{phoneNumber: userInfo?.phoneNumber, orderNo: orderInfo.orderNo}}/>
      </CompleteOrderRoot>
    </Layout>
  );
}

const Totals = styled.div`

  .subtotal {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

`

const CompleteOrderRoot = styled.div`
  display: grid;
  justify-content: center;
  margin-top: 24px;

  & > div {
    max-width: 650px;
    padding: 0 24px;

    @media screen and (max-width: 360px) {
      padding: 0 18px;
    }
  }

  .pay-online,
  .buy-goods {
    .steps {
      margin: 0 auto;
      line-height: 24px;
    }

    .chevron {
      transition: all ease-in-out 0.25s;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all ease-in-out 0.25s;
      margin-bottom: 24px;
      justify-content: space-between;

      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }

      h4,
      p {
        margin: 0;
        margin-bottom: 6px;
      }
    }
  }

  .lipa-na-mpesa {
    padding: 24px;
    border-radius: 2px;
    background: #66ad45;
    h4 {
      margin: 0;
    }

    li,
    b,
    h4 {
      color: #fff;
    }
  }

  .boxes {
    display: flex;
    justify-content: center;
    margin: 24px 0;
    gap: 8px;

    & > div {
      border-radius: 2px;
      // we use a hack to make sure
      // this div is always 'square'
      height: 0;
      padding-top: 5%;
      padding-bottom: 12%;
      font-size: 32px;
      width: 25%;
      background: white;
      font-weight: bold;
      flex-basis: 70px;

      @media screen and (max-width: 460px) {
        padding-bottom: 18%;
      }
    }
  }

  .payment-options {
    display: flex;

    .payment--parent {
      margin-right: 8px;
      border: 1px solid lightgray;
      padding: 4px 12px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      transition: all 0.25s ease-in-out;

      &:hover {
        cursor: pointer;
        border-color: #7a7a7a;
      }

      .radio {
        margin-right: 8px;
      }
    }

    img {
      max-width: 120px;
      object-fit: contain;
      border-radius: 4px;
      padding: 0 12px;
      transition: all 0.25s ease-in-out;

      &:hover {
        cursor: pointer;
      }
    }
  }
`;

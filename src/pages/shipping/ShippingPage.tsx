import React, {useState} from 'react';
import Layout from '../../components/Layout';
import styled from 'styled-components';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {extractErrorMessage, formatNumberWithCommas} from '../../helpers';
import {EmptyState} from '../../components';
import {ErrorIconDark, GrimacingEmoji, HomeDelivery, NormalCart, PickupDelivery} from '../../constants/icons';
import {Button} from 'bloomer';
import {Form, Formik} from 'formik';
import RadioField from '../../components/input/RadioField';
import PointingDown from '../../assets/images/emoji/backhand-index-pointing-down.png';
import IndexFinger from '../../assets/images/emoji/backhand-index-pointing-up.png';
import {ChevronRight} from 'react-feather';
import SimpleMap from '../../components/map/SimpleMap';
import Loading from '../../components/loading';
import {useApi} from '../../network';
import PayWithMpesaOnlineModal from './PayWithMpesaOnlineModal';
import {ThunkDispatch} from 'redux-thunk';
import {UserState} from '../../state/reducers/userReducers';
import {AnyAction} from 'redux';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import {AddressType, CheckoutType, OrderStatus, PaymentStatus} from '../../types';
import useSWR from 'swr/esm/use-swr';
import {
  deleteCartAction,
  saveCheckoutAddressAction,
  saveShippingQuoteAction,
  setZoomLevelAction,
} from '../../state/actions';
import {useNotify} from '../../hooks';
import ServerError from '../../assets/images/vectors/dead.svg';
import LipaNaMpesaSection from './components/LipaNaMpesaSection';
import humps from '../../helpers/humps';
import posthog from 'posthog-js';

// const CompleteOrderValidationSchema = Yup.object({
//   deliveryLocation: Yup.string().required(),
//   paymentType: Yup.string().required(),
// });

export default function Shipping(props) {
  const api = useApi();

  const paramOrderId = props.match.params.orderId;

  const userState: UserState = useSelector((state: RootStateOrAny)=> state.user)

  const dispatch: ThunkDispatch<UserState, any, AnyAction> = useDispatch();
  const userInfoFetcher = ()=> api.accounts.me().then(({data}) => data);
  const {data: userInfo, error: fetchUserError} = useSWR(userState.isLoggedIn ? 'me': null, userInfoFetcher)

  const orderDataFetcher = (key, orderId) => api.orders.checkStatus(orderId).then(({data}) => data);
  const {data: orderStatusResult, error: fetchOrderStatusError} = useSWR<{
    paymentStatus: PaymentStatus,
    status: OrderStatus,
    referenceNo: string
  }>(userState.isLoggedIn ? [`orders/${paramOrderId}/status`, paramOrderId] : null, orderDataFetcher);


  const [payNowOrOnDelivery, setPayNowOrOnDelivery] = useState<'payOnDelivery' | 'payNow'>(null);

  const [shippingMethod, setShippingMethod] = useState<'pickupAtLocation' | 'homeOrOfficeDelivery'>(null);

  // @ts-ignore
  const [, setCompletedOrder] = useState({});
  const checkout: CheckoutType = useSelector((state: RootStateOrAny) => state.user.checkout);
  const [payOnlineOrBuyGoods, setPayOnlineOrBuyGoods] = useState<'pay-online' | 'buy-goods'>(null);
  const [isPayOnlineModalOpen, setPayOnlineModalOpen] = useState(false);
  const [isFetchQuoteLoading, setIsFetchQuoteLoading] = useState(false);

  const notify = useNotify();

  function flip(func, state, value) {
    if (state !== value) {
      func(value);
    } else {
      func(null);
    }
  }

  if (!userState.isLoggedIn) {
    return (
      <Layout>
        <EmptyState
          iconWidth={52}
          icon={GrimacingEmoji}
          centerAlign={true}
          title={"We don't know each other like that."}
          message={"You need to be logged in to view this page. Please log in to proceed"}/>
      </Layout>
    )
  }

  if (!orderStatusResult && !fetchUserError && !fetchOrderStatusError) {
    return <Loading message={'Please wait...'}/>;
  }

  if (!checkout.items?.length) {
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

  if (fetchOrderStatusError || fetchUserError){
    return (

      <Layout>
        <EmptyState
          icon={ServerError}
          title={'Sorry about that! An error occurred'}
          message={()=> (
            <div>
              <p>
                It's not you. It's us.
              </p>
              <p>
                Something went wrong while trying to process your cart.
                Our best engineers have been notified about it, and are on the case.
              </p>
            </div>
          )}
          prompt={()=> (
            <Button
              style={{width: "100%"}}
              isColor={'primary'}>
              Try again
            </Button>
          )}
        />
      </Layout>

    )
  }


  if (orderStatusResult.status !== 'pendingPayment') {
    return (
      <div>
        <p>Other status: {orderStatusResult.status}</p>
      </div>
    );
  }

  async function completeOrder(order: {
    orderId: string,
    paymentType: 'payNow' | 'payOnDelivery',
    address: AddressType
  }) {
    if (!order?.paymentType) {
      notify.info('Please select a payment method to proceed');
      return undefined;
    }

    if (!order?.address){
      notify.info('Please select a delivery location to proceed');
      return undefined;
    }

    try {
      const {data} = await dispatch(api.orders.complete({
        address: {
          latLng: [order.address.lat, order.address.lng],
        },
        paymentType: order.paymentType,
        orderId: order.orderId,
      }));

      notify.success(data.message);
      dispatch(deleteCartAction());

      posthog.capture('completed order', {
        order_id: data.uuid,
        delivery_method: shippingMethod,
        checkout_total: checkout.total,
        payment_type: order.paymentType,
      });
      props.history.push(`/checkout/shipping/order-completed/${data.uuid}`);

    }catch (e){
      const message = extractErrorMessage(e);
      notify.error(message);
    }

  }

  async function getDeliveryQuote(address: AddressType){
    setIsFetchQuoteLoading(true);
    return await api.deliveries.getQuote({
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
    // address.lat && address.lng will be null
    // when the marker is being cleared
    if (address.lat && address.lng) {
      try {
        const {data} = await getDeliveryQuote(address);
        dispatch(saveShippingQuoteAction(data));
        setIsFetchQuoteLoading(false);
      }catch (e){
        notify.error('Could not get shipping quote')
      }
    }else {
      dispatch(saveShippingQuoteAction({cost: null, courierOrderNo: null}))
    }
  }

  function saveCheckout({lat, lng, location, placeId}: AddressType){
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
    <Layout hideNav>
      {/*only one child*/}
      <CompleteOrderRoot>
        <div>
          <h1>Complete your order</h1>
          <div>
            <h2>A. Choose a shipping method</h2>
            <p>
              Your order can either be delivered to your home/office, or
              picked up in the CBD on a convenient date.
            </p>
          </div>

          {
            <div>

              {
                (
                  <>
                    {/*
                      For now, this Formik is basically useless. If we decide
                      to add back the alternative form-filling functionality though,
                      it will be pretty handy.
                    */}
                    <Formik initialValues={{
                      shippingMethod: {
                        method: '',
                        value: '',
                      },
                      paymentMethod: '',
                    }}
                      /*
                                  validate={(values) => {
                                    const errors = {
                                      deliveryAddress: '',
                                      constituency: '',
                                      wardOrLocalArea: '',
                                    };

                                    const lat = checkout?.delivery?.address?.lat;
                                    const lng = checkout?.delivery?.address?.lng;

                                    // if the user has not used the map to provide
                                    // their location
                                    if (!lat || !lng) {
                                      // check if they have provided
                                      //their constituency, wardOrLocalArea and deliveryAddress
                                      if (!values.deliveryAddress) {
                                        errors.deliveryAddress = 'This field is required';
                                      }
                                      if (!values.constituency) {
                                        errors.constituency = 'This field is required';
                                      }
                                      if (!values.wardOrLocalArea) {
                                        errors.wardOrLocalArea = 'This field is required';
                                      }

                                      return errors;
                                    } else {
                                      // if lat & lang are provided, no other fields are needed
                                      return {};
                                    }
                                  }}
                      */
                            onSubmit={async (values, {setSubmitting}) => {
                              setSubmitting(true);

                            }}
                    >
                      {({setFieldValue, values}) => (
                        <Form>

                          <div>
                            <DeliveryMethodSection>
                              <div>
                                <hr />
                                <header onClick={() => flip(setShippingMethod, shippingMethod, 'homeOrOfficeDelivery')}>
                                  <div>
                                    <div className="sub-title">
                                      <img src={HomeDelivery} alt={'home delivery icon'} />

                                      <h3>
                                        Home or Office Delivery.
                                      </h3>
                                    </div>

                                    <p>
                                      Use the button below to detect your current location, or drag the red marker
                                      to your desired delivery location
                                    </p>
                                  </div>

                                  <ChevronRight
                                    style={{
                                      transform: shippingMethod === 'homeOrOfficeDelivery' ? 'rotate(90deg)' : '0',
                                    }}
                                    className={'chevron'} />
                                </header>
                                {
                                  shippingMethod === 'homeOrOfficeDelivery' && (
                                    <div>
                                      <p>
                                        Note: Mobile device location is generally more accurate than
                                        in large computers. If you're having trouble, log in and complete this
                                        order on a mobile device.
                                      </p>
                                      <SimpleMap
                                        initialZoom={checkout?.meta?.zoomLevel}
                                        onZoom={(level => {
                                          setZoomLevel(level);
                                        })}
                                        initialLocation={{
                                          location: checkout?.delivery?.address.location,
                                          value: {
                                            placeId: checkout?.delivery?.address.placeId,
                                            lat: checkout?.delivery?.address?.lat,
                                            lng: checkout?.delivery?.address?.lng,
                                          },
                                        }}
                                        help={`Note: if the marker is not accurate, drag and drop it to your preferred location.`}
                                        onLocateUser={async (
                                          [lng, lat],
                                          item,
                                        ) => {
                                          const address = {
                                            lat, lng,
                                            location: item?.location,
                                            placeId: item?.value.placeId,
                                          };
                                          setFieldValue('shippingMethod', {
                                            method: 'homeOrOfficeDelivery',
                                            value: address,
                                          });
                                          await onLocateUser(address);
                                        }} />
                                      {/*<div>
                    <div>
                      <div>
                        <h3>Option 2: Enter your delivery information manually.</h3>
                        <p>
                          Fill in the following form if the above map doesn't work,
                          or if you wish to add any information that will make finding your location easier.
                        </p>
                        <p>
                          Please note:
                        </p>
                        <Help>
                          Tip: If you don't know your constituency, try searching for
                          your ward or a well-known local area. For example,
                          searching for "Fedha" will bring up
                          "Embakasi Central", searching for
                          "Eastleigh" will bring up "Kamkunji" and
                          "Karen" or "Dam Estate" will bring up "Lang'ata",... etc.
                        </Help>
                      </div>
                      <Columns>
                        <Column>
                          <label>Constituency</label>
                          <SelectField
                            error={errors.constituency}
                            onBlur={handleBlur}
                            isAsync={true}
                            onChange={(value) => {
                              if (value) {
                                setFieldValue('constituency', value.constituency);

                                const {wards, local_places} = value;
                                const result = [].concat(wards).concat(local_places)
                                  .map(item => {
                                    return {
                                      label: item,
                                      value: item,
                                    };
                                  });
                                setWardsAndLocalAreas(result);
                              } else {
                                setFieldValue('constituency', null);
                                setWardsAndLocalAreas([]);
                              }
                            }}
                            isClearable={true}
                            loadOptions={async (inputValue) => {
                              try {

                                const {data} = await api.deliveries.getLocations({q: inputValue});
                                // don't sort. They're returned
                                // sorted according to relevance
                                return data;
                              } catch (e) {
                                notify.error('Could not fetch delivery locations.');
                              }
                            }}
                            loadingMessage={'Please wait...'}
                            getOptionValue={(option) => {
                              return option.constituency;
                            }}
                            getOptionLabel={(option) => {
                              return option.constituency;
                            }}
                            placeholder={'Search for a place'}/>
                        </Column>
                        <Column>
                          <label>Ward/Local area</label>
                          <SelectField
                            error={values.constituency ? errors.wardOrLocalArea : null}
                            isAsync={false}
                            loadingMessage={'Please wait...'}
                            // this input is disabled if a constituency has not been selected
                            disabled={!values.constituency}
                            isClearable={true}
                            onChange={(value) => {
                              setFieldValue('wardOrLocalArea', value);
                              // todo: once a ward/local area has been selected
                              //   we should send a request to the server
                              //   to request the lat and lng of the representative
                              //   place in order to estimate shipping costs
                            }}
                            filterOption={(option, input) => {
                              return option.value
                                ?.toLowerCase()
                                .startsWith(input) || option.value
                                ?.toLowerCase()
                                .includes(input);
                            }}
                            options={wardsAndLocalAreas}
                            placeholder={'Search or select...'}/>
                        </Column>
                      </Columns>
                      <TextField
                        label={'Street'}
                        placeholder={"eg. Lang'ata Road"}
                        name={'street'}
                        type={'text'}/>
                      <TextField
                        label={'Delivery address'}
                        placeholder={'Estate name / Building name / Block no. / Apartment no.'}
                        name={'deliveryAddress'}
                        type={'textarea'}/>
                    </div>

                  </div>*/}


                                    </div>
                                  )
                                }
                                <hr />
                              </div>

                              <div>
                                <header onClick={() => flip(setShippingMethod, shippingMethod, 'pickupAtLocation')}>
                                  <div>
                                    <div className="sub-title">
                                      <img src={PickupDelivery} alt={'home delivery icon'} />

                                      <h3>
                                        Pick up at location.
                                      </h3>

                                    </div>
                                    <div>
                                      <p>
                                        Pick up your order at a physical location within the CBD.
                                      </p>
                                    </div>
                                  </div>

                                  <ChevronRight
                                    style={{
                                      transform: shippingMethod === 'pickupAtLocation' ? 'rotate(90deg)' : '0',
                                    }}
                                    className={'chevron'} />
                                </header>

                                {
                                  shippingMethod === 'pickupAtLocation' && (
                                    <>
                                      <div>
                                        <p>We'll call you to confirm where.</p>
                                        <RadioField
                                          bordered={true}
                                          isGroup={true}
                                          inline={true}
                                          onChange={(value) => {
                                            setFieldValue('shippingMethod', {
                                              method: 'pickupAtLocation',
                                              value,
                                            });
                                          }}
                                          options={[
                                            {
                                              label: 'Monday - Between 12:00-1:30PM',
                                              value: 'monday',
                                            },
                                            {
                                              label: 'Wednesday - Between 12:00-1:30PM',
                                              value: 'wednesday',
                                            },
                                            {
                                              label: 'Friday - Between 12:00-1:30PM',
                                              value: 'friday',
                                            },
                                            {
                                              label: 'Saturday - Between 11:00-2:00PM',
                                              value: 'saturday',
                                            },
                                          ]} />
                                      </div>
                                    </>
                                  )
                                }
                              </div>
                            </DeliveryMethodSection>

                            <hr />
                            <div>
                              <h2>B. Choose a Payment Option</h2>
                              <p>Would you like to pay now or, after we've delivered your stuff?</p>
                              <div className="payment-options">
                                <div>
                                  <RadioField
                                    isGroup={true}
                                    inline
                                    bordered
                                    onChange={value => {
                                      // @ts-ignore
                                      setPayNowOrOnDelivery(value);
                                      setFieldValue('paymentMethod', value);
                                      setCompletedOrder({
                                        payNowOrOnDelivery,
                                      });
                                    }}
                                    options={[
                                      {
                                        value: 'payNow',
                                        label: 'Pay now',
                                      },
                                      {
                                        value: 'payOnDelivery',
                                        label: 'Pay on Delivery',
                                      },
                                    ]}
                                  />
                                </div>
                                <hr />

                              </div>

                              <div>

                                <SwitchTransition mode={'out-in'}>
                                  <CSSTransition
                                    timeout={250}
                                    key={payNowOrOnDelivery}
                                    classNames="fade"
                                  >
                                    <div>
                                      {
                                        !payNowOrOnDelivery &&
                                        (
                                          <>
                                            <hr />
                                            <div>
                                              <h2>C. Confirm Your Order</h2>
                                            </div>

                                            <p>
                                              Select a payment method {' '}
                                              <img
                                                src={IndexFinger}
                                                alt={'finger pointing up emoji'}
                                                style={{width: 16}}
                                              />{' '}
                                              to confirm your order
                                            </p>
                                            <hr />

                                          </>
                                        )
                                      }
                                      {
                                        payNowOrOnDelivery === 'payNow' && (
                                          <div>
                                            <SwitchTransition mode={'out-in'}>
                                              <CSSTransition
                                                timeout={250}
                                                key={payOnlineOrBuyGoods}
                                                classNames="fade"
                                              >
                                                <div>
                                                  {/*<div className={'pay-online'}>*/}
                                                  {/*  <div*/}
                                                  {/*    className={'header'}*/}
                                                  {/*    onClick={() => flip('pay-online')}*/}
                                                  {/*  >*/}
                                                  {/*    <div>*/}
                                                  {/*      <h4>Option 1: Pay Online</h4>*/}
                                                  {/*      <p>Receive a prompt on your phone and enter your M-PESA PIN.</p>*/}
                                                  {/*    </div>*/}
                                                  {/*    <ChevronRight*/}
                                                  {/*      style={{*/}
                                                  {/*        transform: payOnlineOrBuyGoods === 'pay-online' ? 'rotate(90deg)' : '0',*/}
                                                  {/*      }}*/}
                                                  {/*      className={'chevron'}/>*/}
                                                  {/*  </div>*/}
                                                  {/*  <div>*/}
                                                  {/*    {payOnlineOrBuyGoods === 'pay-online' && (*/}
                                                  {/*      <div className={'pay-online'}>*/}
                                                  {/*        <Button*/}
                                                  {/*          isColor="primary"*/}
                                                  {/*          onClick={() => setPayOnlineModalOpen(true)}*/}
                                                  {/*        >*/}
                                                  {/*          Pay with &nbsp;*/}
                                                  {/*          <img*/}
                                                  {/*            style={{width: 80}}*/}
                                                  {/*            alt={'mpesa logo'}*/}
                                                  {/*            src={MpesaLogo}*/}
                                                  {/*          />{' '}*/}
                                                  {/*          &nbsp; Online*/}
                                                  {/*        </Button>*/}
                                                  {/*        <div className={'steps'}>*/}
                                                  {/*          <h4>Steps</h4>*/}
                                                  {/*          <ol>*/}
                                                  {/*            <li>*/}
                                                  {/*              You will automatically receive a prompt at your phone number:*/}
                                                  {/*              <b> +254-{addDashes(userInfo?.phoneNumber)}</b>&nbsp;*/}
                                                  {/*            </li>*/}
                                                  {/*            <li>*/}
                                                  {/*              Enter your PIN number to confirm payment of the requested*/}
                                                  {/*              amount.*/}
                                                  {/*            </li>*/}
                                                  {/*            <li>*/}
                                                  {/*              <b>Your order will be confirmed immediately</b> after the*/}
                                                  {/*              payment is received.*/}
                                                  {/*            </li>*/}
                                                  {/*            <li>*/}
                                                  {/*              Sit back and relax.*/}
                                                  {/*              <img*/}
                                                  {/*                src={PeaceSign}*/}
                                                  {/*                style={{width: 16}}*/}
                                                  {/*                alt={'peace'}*/}
                                                  {/*              />{' '}*/}
                                                  {/*              We'll take care of the rest.*/}
                                                  {/*            </li>*/}
                                                  {/*          </ol>*/}
                                                  {/*        </div>*/}
                                                  {/*      </div>*/}
                                                  {/*    )}*/}
                                                  {/*  </div>*/}

                                                  {/*</div>*/}

                                                  <hr />

                                                  <div className={'buy-goods'}>
                                                    <div
                                                      className={'header'}
                                                      onClick={() => flip(setPayOnlineOrBuyGoods, payOnlineOrBuyGoods, 'buy-goods')}
                                                    >
                                                      <div>
                                                        <h4>Option 1: Buy Goods Till Number</h4>
                                                        <p>Enter the till number yourself</p>
                                                      </div>
                                                      <ChevronRight
                                                        style={{
                                                          transform: payOnlineOrBuyGoods === 'buy-goods' ? 'rotate(90deg)' : '0',
                                                        }}
                                                        className={'chevron'} />
                                                    </div>
                                                    <SwitchTransition mode={'out-in'}>
                                                      <CSSTransition
                                                        timeout={250}
                                                        key={payOnlineOrBuyGoods}
                                                        classNames="fade"
                                                      >
                                                        <div>
                                                          <hr />

                                                          {payOnlineOrBuyGoods === 'buy-goods' && (
                                                            <>
                                                              <LipaNaMpesaSection />
                                                              <hr />
                                                            </>
                                                          )}

                                                          <div>
                                                            <h2>C. Confirm Your Order Details</h2>
                                                          </div>

                                                          <div>
                                                            <div style={{
                                                              display: 'flex',
                                                              gap: '1rem',
                                                              alignItems: 'center',
                                                            }}>
                                                              <h4>Shipping method: </h4>
                                                              <div style={{display: 'flex'}}>
                                                                <p>{
                                                                  humps.titleCase(humps.depascalize(values.shippingMethod.method)) || 'Please select a shipping method'
                                                                }</p>
                                                              </div>
                                                            </div>

                                                            <div style={{
                                                              display: 'flex',
                                                              gap: '1rem',
                                                              alignItems: 'center',
                                                            }}>
                                                              <h4>Payment method: </h4>
                                                              <p>{humps.titleCase(humps.depascalize(values.paymentMethod))}</p>
                                                            </div>

                                                          </div>

                                                        </div>
                                                      </CSSTransition>
                                                    </SwitchTransition>
                                                  </div>
                                                </div>
                                              </CSSTransition>
                                            </SwitchTransition>

                                          </div>
                                        )}

                                      {
                                        payNowOrOnDelivery === 'payOnDelivery' && (
                                          <div style={{marginBottom: '1rem'}}>
                                            <hr />
                                            <div>
                                              <h2>C. Confirm Your Order Details</h2>
                                            </div>

                                            <div>
                                              <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                                <h4>Shipping method: </h4>
                                                <div style={{display: 'flex'}}>
                                                  <p>{
                                                    humps.titleCase(humps.depascalize(values.shippingMethod.method)) || 'Please select a shipping method'
                                                  }</p>
                                                </div>
                                              </div>

                                              <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                                <h4>Payment method: </h4>
                                                <p>{humps.titleCase(humps.depascalize(values.paymentMethod))}</p>
                                              </div>
                                            </div>
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
                                            <hr />

                                          </div>
                                        )}
                                    </div>

                                  </CSSTransition>
                                </SwitchTransition>

                              </div>
                              <Totals>
                                <div>
                                  <h3>The Maths</h3>
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
                                      checkout.delivery?.cost ? (
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <span>
                                <b>
                                  Ksh.
                                </b>
                              </span>
                                          &nbsp;
                                          <span>
                                  <b>
                                    {formatNumberWithCommas(checkout.delivery?.cost)}
                                  </b>
                              </span>
                                        </div>
                                      ) : isFetchQuoteLoading ? (
                                        <p>Please wait...</p>
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
                                  <h3>Ksh.{' '}
                                    {
                                      checkout.delivery?.cost ?
                                        formatNumberWithCommas(checkout.total + checkout.delivery?.cost) :
                                        formatNumberWithCommas(checkout.total)
                                    }
                                  </h3>
                                </div>
                              </Totals>
                            </div>

                            <div id={'footer'}>
                              {
                                payNowOrOnDelivery === 'payOnDelivery' ||
                                payOnlineOrBuyGoods === 'buy-goods' ?
                                  (
                                    <div style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      marginTop: 24,
                                    }}>
                                      <Button
                                        isColor="primary"
                                        onClick={async () => await completeOrder({
                                          orderId: paramOrderId,
                                          paymentType: payNowOrOnDelivery,
                                          address: checkout.delivery?.address,
                                        })}
                                        disabled={!values.shippingMethod.method}
                                        style={{width: '100%', fontWeight: 'bold'}}
                                      >
                                        {
                                          !values.shippingMethod.method ? 'SELECT A SHIPPING METHOD'
                                            : 'COMPLETE YOUR ORDER'
                                        }
                                      </Button>
                                    </div>
                                  )
                                  : <span />
                              }
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </>
                )
              }
            </div>
          }
        </div>

        <PayWithMpesaOnlineModal
          isActive={isPayOnlineModalOpen}
          onClose={() => setPayOnlineModalOpen(false)}
          meta={{
            orderId: paramOrderId,
            phoneNumber: userInfo?.phoneNumber,
            referenceNo: orderStatusResult.referenceNo,
            paymentStatus: orderStatusResult.paymentStatus,
          }}
          onPaymentInitiated={() => {
          }}
        />
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

`;

const DeliveryMethodSection = styled.div`
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all ease-in-out 0.25s;
      margin-bottom: 24px;
      justify-content: space-between;
      
      .sub-title {
        display: flex;
        align-items: end;
        width: 100%;
        margin-bottom: 0.5rem;
        
        img {
          max-width: 2rem;
          margin-right: 0.5rem;
        }
        
        h3 {
          margin: 0;
        }
      }
      
      h3,
      h4,
      p {
        margin: 0 0 6px;
        transition: all ease-in-out 0.25s;
      }
  
      &:hover {
        cursor: pointer;
        
        h3,
        h4,
        p {
          color: var(--color-primary);
        }
      }
  }

`;

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
      
      h4,
      p {
        margin: 0 0 6px;
        transition: all ease-in-out 0.25s;
      }

      &:hover {
        cursor: pointer;
        
        h4,
        p {
          color: var(--color-primary);
        }
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

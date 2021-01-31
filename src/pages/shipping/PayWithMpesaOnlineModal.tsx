import React, {useState} from 'react';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {Button, Help} from 'bloomer';
import {addDashes, extractErrorMessage, formatNumberWithCommas} from '../../helpers';
import MpesaLogo from '../../assets/images/logos/mpesa.svg';
import CustomModal from '../../components/CustomModal';
import {useAuth} from '../../network';
import {AxiosResponse} from 'axios';
import {AddressType, CheckoutType, PaymentStatus} from '../../types';
import Notification from '../../components/notification';
import {useNotify} from '../../hooks';

export default function PayWithMpesaOnlineModal(
  {
    isActive,
    onClose,
    meta: {
      phoneNumber,
      referenceNo,
      paymentStatus
    },
    onPaymentInitiated
  }: {
    isActive: boolean,
    onClose: ()=> void,
    onPaymentInitiated: ()=> void,
    meta: {
      phoneNumber: string,
      referenceNo: string,
      // we will retrieve a payment status from the server
      paymentStatus?: PaymentStatus
    }
  },
) {
  const checkout: CheckoutType = useSelector((state: RootStateOrAny) => state.user.checkout);
  const api = useAuth();
  const dispatch = useDispatch();
  const notify = useNotify();
  const [isPaymentLoading, setPaymentLoading] = useState(false);
  const [isCompleteOrderLoading, setIsCompleteOrderLoading] = useState(false);

  // We track whether this payment has been initiated locally
  // because of swr might take a while to re-query the server for a
  // payment status.
  // Additionally, using local state alone isn't enough
  // because if the user refreshes the page, they would have to
  // re-initiate the transaction
  const [isPaymentInitiated, setPaymentInitiated] = useState(false);

  async function initiateOnlinePayment(cartId: string) {
    setPaymentLoading(true);
    try {
      // @ts-ignore
      const response = await dispatch<AxiosResponse<{message: string, id: string, referenceNo: string}>>(api.payments.initiateMpesaOnlinePayment({cartId}));

      setPaymentLoading(false);

      if (response.data) {
        onPaymentInitiated();
        setPaymentInitiated(true);
        notify.success('Your payment is being processed. Please enter your Mpesa PIN when prompted.');
      }
    }catch (e){
      setPaymentLoading(false);

      console.log('An error occurred ', e);
      const message = extractErrorMessage(e);
      notify.error(message);
    }
  }

  async function completeOrder(cartId: string, address: AddressType){
    setIsCompleteOrderLoading(true);
    try {
      setIsCompleteOrderLoading(false);
      await dispatch(api.orders.complete({
          cartId,
          address: {
            latLng: [address.lat, address.lng],
          },
        }),
      );
    }catch (e){
      setIsCompleteOrderLoading(false);
      const message = extractErrorMessage(e);
      notify.error(message);
    }
  }

  return (
    <div>
      <CustomModal
        closeOnClickBackground={false}
        onClose={() => {
          if (!isPaymentLoading) return onClose();
        }}
        isActive={isActive}>
        <div>
          <h3>
            Pay with &nbsp;
            <img
              style={{
                width: 80,
                verticalAlign: 'middle',
              }}
              alt={'mpesa logo'}
              src={MpesaLogo}
            />{' '} Online
          </h3>
          {
            // if paymentStatus does not exist,
            // the user has not attempted to initiate the payment before
            (isPaymentInitiated || (
              paymentStatus &&
              paymentStatus !== 'errored' &&
              paymentStatus !== 'cancelled'
            )) ? (
              <div>
                {
                  (paymentStatus === 'initiated' || isPaymentInitiated) ? (
                    <div>
                      <Notification
                        message=''
                        title={'Transaction initiated'}
                        type={'info'}/>
                    </div>
                  ) : paymentStatus === 'processed' ? (
                    <div>
                      <Notification
                        title={'Your payment has been processed.'}
                        type={'success'}/>
                    </div>
                  ) : <span/>

                }

                <div style={{marginBottom: '1rem'}}>
                  <div>
                    <p>
                      The number{' '}
                      <b> +254-{addDashes(phoneNumber)}</b>&nbsp;
                      will receive a charge of{' '}
                      <strong>Ksh. {formatNumberWithCommas(checkout.total)}</strong>. {' '}
                      Enter your M-Pesa PIN to complete the transaction.
                    </p>
                  </div>
                  <div>
                    <h4 style={{marginBottom: 0}}>For extra security</h4>
                    <p>
                      Cross-reference the payment number <b>{referenceNo}</b>.
                    </p>
                  </div>
                </div>

                <div>
                  <Button
                    style={{width: '100%'}}
                    isOutlined={true}
                    isLoading={isPaymentLoading || isCompleteOrderLoading}
                    isColor={'primary'}
                    onClick={async () => {
                      await completeOrder(checkout.id, checkout.delivery.address);
                    }}
                  >
                    Complete your order
                  </Button>
                  {
                    paymentStatus !== 'processed' && (
                      <Help style={{display: 'flex', gap: 6}}>
                        Didn't receive a prompt?
                        <Button
                          style={{borderBottom: '1px solid lightgray'}}
                          isColor={'ghost'}
                          isLoading={isPaymentLoading}
                          onClick={() => initiateOnlinePayment(checkout.id)}
                        >
                          Try again
                        </Button>
                      </Help>
                    )
                  }
                </div>
              </div>
            ) : (
              //
              <div>

                {
                  paymentStatus === 'errored' ? (
                    <div>
                      <Notification
                        message='Something went wrong while trying to process your transaction. Please try again.'
                        title={'An error occurred'}
                        type={'error'}/>
                    </div>
                  ) : paymentStatus === 'cancelled' ? (
                    <div>
                      <Notification
                        message=''
                        title={'Your previous transaction was cancelled'}
                        type={'warning'}/>
                    </div>
                  ) : <span/>
                }

                <p>
                  You will receive a prompt on your phone:
                  <b> +254-{addDashes(phoneNumber)}</b>&nbsp;
                  {/*TODO: don't forget to charge both total + shipping*/}
                  for a charge of <strong>Ksh. {formatNumberWithCommas(checkout.total)}</strong>
                </p>

                <div className={'buttons'} style={{marginTop: '1rem'}}>
                  <Button
                    isColor="primary"
                    isLoading={isPaymentLoading}
                    onClick={async () => initiateOnlinePayment(checkout.id)}
                  >
                    Pay now
                  </Button>
                  <Button
                    disabled={isPaymentLoading}
                    onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </div>
            )
          }

        </div>
      </CustomModal>
    </div>
  );
};
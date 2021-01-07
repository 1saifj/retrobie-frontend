import React, {useState} from 'react';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {Button} from 'bloomer';
import {addDashes, extractErrorMessage, formatNumberWithCommas} from '../../helpers';
import MpesaLogo from '../../assets/images/logos/mpesa.svg';
import CustomModal from '../../components/CustomModal';
import {useAuth} from '../../network';
import {notify} from '../../helpers/views';

export default function PayWithMpesaOnlineModal({isActive, onClose, meta: {phoneNumber, orderNo}}) {
  const checkout = useSelector((state: RootStateOrAny) => state.user.checkout);
  const api = useAuth();
  const dispatch = useDispatch();
  const [paymentLoading, setPaymentLoading] = useState(false);

  async function initiateOnlinePayment(data) {
    notify('loading', "Please wait...", {})
    setPaymentLoading(true);
    return dispatch(api.payments.initiateMpesaOnlinePayment(data));
  }
  return (
    <div>
      <CustomModal
        closeOnClickBackground={false}
        onClose={()=> {
          if (!paymentLoading) return onClose();
        }}
        isActive={isActive}>
        <div>
          <h3>
            Pay with &nbsp;
            <img
              style={{
                width: 80,
                verticalAlign: 'middle'
              }}
              alt={'mpesa logo'}
              src={MpesaLogo}
            />{' '} Online
          </h3>
          <div className={'steps'}>
            <p>
              You will automatically receive a prompt on your phone:
              <b> +254-{addDashes(phoneNumber)}</b>&nbsp;
              for a charge of <strong>Ksh. {formatNumberWithCommas(checkout.total)}</strong>
            </p>
            <h4 style={{marginBottom: 0}}>For extra security</h4>
            <p>
              Cross-reference the order number <b>{orderNo}</b>.
            </p>
          </div>
          <div className={'buttons'} style={{marginTop:'1.5rem'}}>
            <Button
              isColor="primary"
              isLoading={paymentLoading}
              onClick={async () => {
                try {
                  await initiateOnlinePayment({
                    cartId: checkout.id,
                  });
                  setPaymentLoading(false);
                  notify('success', "Your payment is being processed")
                }catch (e){
                  setPaymentLoading(false);
                  const message = extractErrorMessage(e);
                  notify('error', message);
                }
              }}
            >
              Pay now
            </Button>
            <Button onClick={onClose}>
              Cancel
            </Button>
          </div>

        </div>
      </CustomModal>
    </div>
  )
}
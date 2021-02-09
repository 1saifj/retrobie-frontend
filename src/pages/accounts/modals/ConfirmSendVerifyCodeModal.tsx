import { Button } from 'bloomer';
import React from 'react';
import CustomModal from '../../../components/CustomModal';


const ConfirmSendVerifyCodeModal = ({isActive, onClose, onConfirm, email})=> {

  return (
    <div>
      <CustomModal
        isActive={isActive}
        onClose={onClose}>
        <div>
          <div>
            <h2>You are about to send a confirmation email.</h2>
            <p>
              You will receive an email with a 6-digit code at <strong>{email}</strong>.
            </p>
            <p>
              Do you want to proceed?
            </p>
          </div>
          <div style={{marginTop: 24}}>
            <Button
              style={{marginRight: 24}}
              onClick={onConfirm}
              isColor={'primary'}>
              Confirm
            </Button>
            <Button
              onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

export default ConfirmSendVerifyCodeModal;
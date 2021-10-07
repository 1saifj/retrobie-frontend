import CustomModal from '../../../components/CustomModal';
import React from 'react';
import RegisterUser from '../../accounts/register';

const RegisterModal = function(props: {
  isActive: boolean,
  onClose
}){
  return (
    <div>
      <CustomModal
        closeOnClickBackground
        isActive={props.isActive}
        onClose={props.onClose}>
        <div>
          <RegisterUser hideFooter={true} />
        </div>
      </CustomModal>
    </div>
  );
}

export default RegisterModal;

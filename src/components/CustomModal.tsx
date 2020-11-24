import React from 'react';
import {Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';


export default function CustomModal({isActive, onClose, children}){

  return (
    <Modal isActive={isActive}>
      <ModalBackground onClick={onClose}/>
      <ModalContent>
        <div style={{background: 'white', padding: "24px 48px", borderRadius: 4}}>
          {children}
        </div>
      </ModalContent>
      <ModalClose onClick={onClose}/>
    </Modal>
  )
}
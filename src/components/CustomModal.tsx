import React, {ReactElement} from 'react';
import {Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';


export default function CustomModal(
  {
    isActive,
    onClose,
    children,
    closeOnClickBackground
  }: {
    isActive: boolean,
    onClose: (e: React.MouseEvent<any>)=> void,
    children: ReactElement,
    closeOnClickBackground?: boolean
  }){

  return (
    <Modal isActive={isActive}>
      <ModalBackground onClick={!closeOnClickBackground ? undefined: onClose}/>
      <ModalContent>
        <div style={{background: 'white', borderRadius: 4}}>
          {children}
        </div>
      </ModalContent>
      <ModalClose onClick={onClose}/>
    </Modal>
  )
}
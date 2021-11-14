import React, {ReactElement} from 'react';
import {Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import '../../assets/style/bulma-fx';

export default function CustomModal(props: {
    isActive: boolean,
    onClose: (e: React.MouseEvent<any>) => void,
    children: ReactElement,
    closeOnClickBackground?: boolean
  }){

  return (
    <Modal isActive={props.isActive} className={'modal-fx-3dFlipVertical'}>
      <ModalBackground onClick={!props.closeOnClickBackground ? undefined: props.onClose}/>
      <ModalContent>
        <div style={{background: 'white', borderRadius: 4}}>
          {props.children}
        </div>
      </ModalContent>
      <ModalClose onClick={props.onClose}/>
    </Modal>
  )
}

import React, {useState} from 'react';
import {Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {formatBytes} from '../helpers';

const ActualContent = styled.div`
  background: whitesmoke;
  border-radius: 4px;
  padding: 12px 24px;
`;

export default function SelectedImageModal(props) {

  function onClose() {
    if (props.onClose && typeof props.onClose === 'function') {
      props.onClose();
    }
  }

  return (
    <Modal isActive={props.showModal}>
      <ModalBackground onClick={onClose} />
      <ModalContent>
        <ActualContent>
          <div>
            {
              props.images?.map((image, index) => {
                if (image.file) {
                  const img = new Image();
                  img.src = image.src;
                  return (
                    <div key={index.toString()}>
                      <img src={image.src} alt={''} />
                      {
                        image.file && <div style={{textAlign: 'center', padding: '12px 24px'}}>
                          <small>
                            <b>File name</b>: {image.file.name}
                          </small>
                          <small>
                            <b>File size</b>: {formatBytes(image.file.size)}
                          </small>
                          <div>
                            <small>
                              <b>Dimensions</b>: {`${img.width}x${img.height}`}
                            </small>
                          </div>
                        </div>
                      }
                    </div>

                  );
                }
              })
            }
          </div>
        </ActualContent>
        <ModalClose type={'button'} onClick={onClose} />
      </ModalContent>
    </Modal>

  );
};

SelectedImageModal.propTypes = {
  showModal: PropTypes.bool,
  onClose: PropTypes.func,
  images: PropTypes.array,
};

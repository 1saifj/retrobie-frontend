import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import {axis} from '../../../network';
import {notify} from '../../../helpers/views';
import {Button} from 'bloomer';
import CreateProductModal from './modals/CreateProductModal';
import SelectedImageModal from '../brands/modals/SelectedImageModal';

/**
 * Stuff
 * todo: (in no particular order) - clear form when product is created successfully (or redirect to new page)
 */

function AdminProducts(props) {

  const [showSelectedImageModal, setShowSelectedImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  return (
    <div>
      <Button />

      <CreateProductModal
        isActive={true}
        onClickSelectedImage={images => {
          setShowSelectedImageModal(true);
          setSelectedImages(images);
        }}
        onClose={() => {
          setShowSelectedImageModal(false);
        }}
      />
      <SelectedImageModal
        showModal={showSelectedImageModal}
        images={selectedImages}
        onClose={() => {
          setShowSelectedImageModal(false);
        }}
      />
    </div>
  );
}

const FormItemsParent = styled.div`
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 48px 60px;
  margin-top: 48px;
  max-width: 1200px;

  a {
    text-decoration: none;
  }

  h4 {
    margin-top: 0;
    margin-bottom: 0;
  }

  .rdw-option-wrapper,
  .rdw-dropdown-wrapper {
    transition: all 0.25s ease-in-out;
  }

  .rdw-dropdownoption-default {
    color: #767676;
    font-size: 14px;
  }

  .rdw-dropdown-wrapper:hover,
  .rdw-option-wrapper:hover {
    box-shadow: none !important;
    border: 1px solid gray;
  }
`;

function mapStateToProps(state) {
  return {state};
}

export default connect(mapStateToProps)(AdminProducts);

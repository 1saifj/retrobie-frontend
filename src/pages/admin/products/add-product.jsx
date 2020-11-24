import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import {axis} from '../../../network';
import {notify} from '../../../helpers/views';
import {Button} from 'bloomer';
import CreateProductModal from '../brands/modals/CreateProductModal';
import SelectedImageModal from '../brands/modals/SelectedImageModal';

/**
 * Stuff
 * todo: (in no particular order) - clear form when product is created successfully (or redirect to new page)
 */

function AdminProducts(props) {
  const [imagesToUpload, setImagesToUpload] = useState([]);
  const [imageUploadDetails, setImageUploadDetails] = useState({identifier: '', images: []});
  const [productId, setProductId] = useState('');
  const [folder, setFolder] = useState('');

  const [showSelectedImageModal, setShowSelectedImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    //Once the page mounts, check localStorage for a product that was created but not submitted
    //If such a product exists, we have to either explicitly delete it before creating a new one
    // or complete it and post it
    let inCompleteProductJson = localStorage.getItem('incomplete_product');
    let inCompleteProduct = inCompleteProductJson ? JSON.parse(inCompleteProductJson) : {};

    if (!inCompleteProduct.identifier) {
      //If an incomplete product exists, we'll use its identifier for requests
      //Otherwise, we create a new uuid and save the updated object
      inCompleteProduct.identifier = uuid();
      localStorage.setItem('incomplete_product', JSON.stringify(inCompleteProduct));
    } else {
      //If we find an identifier, and the images were uploaded
      if (inCompleteProduct.imagesUploaded) {
        let friendlyId = inCompleteProduct.identifier;
        axis
          .get(`/products/${friendlyId}/images`)
          .then(response => {
            this.setState({
              ...this.state,
              imageUploadDetails: {
                ...this.state.imageUploadDetails,
                images: response.data,
              },
            });
          })
          .catch(err => {
            notify('error', 'An error occurred.');
          });
      }
    }

    //Add the identifier to state
    setImageUploadDetails(prevState => ({...prevState, identifer: inCompleteProduct.identifier}));
  }, []);

  function handleChange(values) {
    setImagesToUpload(values);
  }

  function handleUpload(event) {
    if (!this.uploadPicturesForm.check()) {
      return;
    }
    this.uploader.start();
  }

  function handleReupload(file) {
    this.uploader.start(file);
  }

  function handleSuccessfulUpload(response, file) {
    //Once the file has been uploaded successfully
    let incompleteProductJson = localStorage.getItem('incomplete_product');
    let incompleteProduct = JSON.parse(incompleteProductJson);
    incompleteProduct.imagesUploaded = true;
    localStorage.setItem('incomplete_product', JSON.stringify(incompleteProduct));

    notify('success', 'Uploaded successfully.');
    //Get the following paths
    // let {fileId, filePath, name, thumbnailUrl, url} = response;
    // let newState = Object.assign({}, this.state);

    // let serverUpdatedObject = {
    //     fileId,
    //     filePath,
    //     name,
    //     thumbnailUrl,
    //     url,
    //     folder: this.state.formValue.folder
    // };

    // newState.imageUploadDetails.images.push(serverUpdatedObject);
    // this.setState(newState);

    // let inCompleteProductJson = localStorage.getItem('incomplete_product');
    // //It will always exist because an object is always created once the page mounts
    // let inCompleteProduct = JSON.parse(inCompleteProductJson);
    // if (!inCompleteProduct.images) inCompleteProduct.images = [];

    // inCompleteProduct.images.push(serverUpdatedObject);
    // localStorage.setItem('incomplete_product', JSON.stringify(inCompleteProduct));

    // axis.post(`/products/new/skeleton`, {
    //     ...serverUpdatedObject,
    //     identifier: inCompleteProduct.identifier
    // }).then(response=> {
    //     this.setState({
    //         ...this.state,
    //         productId: response.data.id
    //     })
    // })
  }

  function handleSubmitMainForm() {
    this.uploadDetailsForm.state.formValue.friendly_id = this.state.imageUploadDetails.identifier;
    const rawContentState = this.uploadDetailsForm.state.formValue.long_description;
    //Convert raw content to html
    // this.uploadDetailsForm.state.formValue.long_description = draftToHtml(rawContentState);

    if (!this.uploadDetailsForm.check()) {
      console.log(this.uploadDetailsForm.state);

      notify('error', 'Please fix the errors before proceeding.');
      return;
    }

    axis
      .post('/products/create', {...this.uploadDetailsForm.state.formValue})
      .then(response => {
        console.log(response.data);
        //Remove saved product
        localStorage.removeItem('incomplete_product');
        localStorage.removeItem('incomplete_form');
      })
      .catch(err => {
        console.error(err);
      });
  }

  function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const changeFormValue = formValue => {
    setImageUploadDetails(formValue);
  };
  const storageNotEmpty =
    localStorage.getItem('incomplete_form') &&
    Object.keys(localStorage.getItem('incomplete_form')).length;
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

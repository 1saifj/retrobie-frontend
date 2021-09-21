import React, {useRef, useState} from 'react';
import {CircularProgressbar} from 'react-circular-progressbar';
import {Button, Delete} from 'bloomer';
import styled from 'styled-components';
import {LocalImageType, UploadedImageType} from '../ImageUploader';
import SelectedImageModal from '../../../pages/admin/brands/modals/SelectedImageModal';
import {useDispatch} from 'react-redux';
import {useApi} from '../../../hooks';
import {imageUploadedAction} from '../../../state/actions';
import {generateRandomString} from '../../../helpers';
import humps from '../../../helpers/humps';


function SelectedImagesPreview({folder, uploaderId, onUpload, allowMultiple, isSelectDisabled}) {

  const dispatch = useDispatch();
  const api = useApi();

  const inputRef = useRef(null);

  const [showSelectedImageModal, setShowSelectedImageModal] = useState(false);
  const [selectedImagesState, setSelectedImagesState] = useState<Array<LocalImageType>>([]);

  // only one image can be uploaded at a time.
  // this is the image that's being uploaded
  const [uploadingImage, setUploadingImage] = useState({md5: null});
  const [uploadingPercent, setUploadingPercent] = useState(0);

  const onClickSelectedImage = () => setShowSelectedImageModal(true);

  function saveUploadedImageToState({image}) {
    return dispatch(imageUploadedAction({image, uploaderId}));
  }

  async function onDelete(image) {
    const selectedForDeleteIndex = selectedImagesState
      .findIndex(single => single.md5 === image.md5);

    const selected = [...selectedImagesState];
    selected.splice(selectedForDeleteIndex, 1);
    setSelectedImagesState(selected);
  }

  /**
   * Every time a file is selected, we want to load the images from storage and store them
   * in an internal state. If the page is refreshed, the state is reset and the selected images
   * are lost.
   *
   * When the images are uploaded
   **/
  async function onChange(e) {
    const addedFiles: Array<File> = [...e.target.files];
    const selectedImages: Array<LocalImageType> = [...selectedImagesState];

    if (FileReader && addedFiles.length) {
      for (let i = 0; i < addedFiles.length; i++) {
        const currentFile = addedFiles[i];
        const md5 = humps.md5(currentFile.name);
        // If this file does not already exists in our list, add it.

        const newSource = URL.createObjectURL(addedFiles[i]);

        selectedImages.push({
          id: generateRandomString(8),
          uploaded: false,
          src: newSource,
          file: currentFile,
          md5,
        });

        setSelectedImagesState(selectedImages);

      }
    }
  }

  async function upload(selectedFiles: Array<LocalImageType>) {
    let selectedImages = [...selectedFiles];

    for (let i = 0; i < selectedImages.length; i++) {
      const currentImage = selectedImages[i];

      // get an image signature from out servers
      const {data: signatureData} = await dispatch<any>(api.imageKit.getSignature());

      if (signatureData) {
        const formData = new FormData();
        // Append all the keys-values provided by the api
        Object.keys(signatureData).forEach(key => {
          formData.append(key, signatureData[key]);
        });
        formData.append('file', currentImage.file);
        formData.append('fileName', currentImage.file.name);
        formData.append('folder', folder);

        try {
          setUploadingImage({md5: currentImage.md5});

          const {data: uploadData} = await dispatch<any>(api.imageKit.upload(formData, {
              onUploadProgress: (progressEvent) => {
                const uploadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadingPercent(uploadPercent);
              },
            }),
          );

          setUploadingPercent(0);
          if (uploadData) {
            const uploadedImage: UploadedImageType = {
              id: currentImage.id,
              md5: currentImage.md5,
              fileId: uploadData.fileId,
              thumbnailUrl: uploadData.thumbnailUrl,
              url: uploadData.url,
              uploaded: true,
              createdAt: new Date().toISOString(),
            };

            // remove the uploaded item from the list of selected images
            selectedImages.splice(i, 1);
            // decrement the index to re-index the array.
            i--;
            setSelectedImagesState(selectedImages);

            await onUpload?.(null, {uploadedImage, uploaderId});
            setUploadingImage({md5: null});
            saveUploadedImageToState({image: uploadedImage});
          } else {
            console.log('No upload data');
          }
        } catch (e) {
          console.log('Encountered error. Not uploading image.', e);
          setUploadingImage({md5: null});
        }
      } else {
        console.log('No signature data');
        // const message = extractErrorMessage(rest);
        // notify('error', );
      }
    }
  }

  const isUploading = () => uploadingImage.md5 !== null;


  return (
    <>
      {
        selectedImagesState.length ? (
          <div className={'preview'}>
            <div className={'header'}>
              <h4>Selected images</h4>
            </div>
            <div className={'preview--files'}>
              {
                selectedImagesState?.map((image) => (
                  <SelectedImage>
                    {
                      uploadingImage.md5 === image.md5 && (
                        <div style={{
                          position: 'absolute',
                          height: '100%',
                          width: '100%',
                          zIndex: 1,
                          background: 'rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                          <CircularProgressbar
                            value={uploadingPercent}
                            text={`${uploadingPercent !== 100 ? uploadingPercent : 'Finishing up...'}%`} />;
                        </div>
                      )
                    }
                    <div style={{position: 'relative'}}>
                      <Delete onClick={() => onDelete(image)} />
                      <img src={image.src}
                           alt={''}
                           onClick={onClickSelectedImage}
                      />
                    </div>
                  </SelectedImage>
                ))
              }
            </div>
            {
              (
                <div style={{textAlign: 'right'}}>
                  <Button
                    isColor={'info'}
                    isSize={'small'}
                    isLoading={isUploading()}
                    disabled={isUploading()}
                    onClick={async () => await upload(selectedImagesState)}
                  >
                    Upload
                  </Button>
                </div>
              )
            }


            <SelectedImageModal
              showModal={showSelectedImageModal}
              images={selectedImagesState}
              onClose={() => {
                setShowSelectedImageModal(false);
              }}
            />

          </div>
        ) : <span />
      }

      <input type="file"
             style={{display: 'none'}}
             multiple={allowMultiple}
             ref={inputRef}
             name={'file'}
             onChange={onChange}
      />

      <div>
        <Button
          isColor={'primary'}
          isSize={'small'}
          disabled={isSelectDisabled}
          onClick={() => inputRef.current.click()}
        >
          {allowMultiple ? 'Add new images' : 'Select a new image'}
        </Button>
      </div>
    </>
  );
}

export default SelectedImagesPreview;


const SelectedImage = styled.div`
  position: relative;
  
  .CircularProgressbar {
    width: 75%;
    margin: 0 auto;
    
    .CircularProgressbar-text, .CircularProgressbar-path {
       stroke: var(--color-primary);
       fill: var(--color-primary-dark);
    }
  }
  


   img {
     max-width: 150px;
     
     &:hover {
      cursor:pointer;
     }
   }
`;

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {generateRandomString} from '../../helpers';
import styled from 'styled-components';
import {Button, Delete} from 'bloomer';
import {useAuth} from '../../network';
import MD5 from 'md5';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {useNotify} from '../../hooks';
import {env} from '../../config';
import {imageUploadedAction} from '../../state/actions';
import {MetaState} from '../../state/reducers/metaReducers';

type LocalImageType = {
    // a random string
    id: string,
    uploaded: false,
    src: string,
    file: File,
    md5: string,
}

export type UploadedImageType = {
    // a random string
    id: string,
    uploaded: true,
    md5: string,
    url: string;
    fileId: string;
    thumbnailUrl: string
}

const SelectedImage = styled.div`

   img {
     max-width: 150px;
     
     &:hover {
      cursor:pointer;
     }
   }
`


function CustomImageUploader(
  {
    onInit,
    initialImages,
    instantUpload,
    isSelectDisabled,
    deferredUpload,
    onUpload,
    onDeleteUploadedImage,
    onClickSelectedImage,
    allowMultiple,
    folder,
    id,
    onBeforeChange,
    onUploadProgress,
  }: {

    // useful for showing images that have been uploaded to the image server
    // but likely not to our own
    onInit?: (images: Array<UploadedImageType>) => void,
    initialImages?: UploadedImageType[],
    instantUpload?: boolean,
    isSelectDisabled?: boolean,
    deferredUpload?: boolean,
    folder: string,
    onUpload: (err, {images, uploaderId}: {images: Array<UploadedImageType>, uploaderId: string}) => void,
    onDeleteUploadedImage?: ({fileId})=> Promise<void>
    onClickSelectedImage?: (e) => void,
    allowMultiple: boolean,
    id: string,
    onBeforeChange?: (e) => void,
    onUploadProgress?: ({percentCompleted, fileId}: {percentCompleted: number, fileId: string}) => void

  }) {

  const api = useAuth();
  const dispatch = useDispatch();
  const notify = useNotify();

  const inputRef = useRef(null);

  const uploaderId = `retro-image-uploader-${id}`;

  const metaState: MetaState = useSelector((state: RootStateOrAny) => state.meta);
  const uploadedImages: UploadedImageType[] = metaState.components.imageUploader[uploaderId];

  const uploadedImagesArray = useMemo(
    () => uploadedImages?.length ?
      // show the uploaded images or props.initialImages else []
      // presumably, uploaded images and initial images will be the same.
      uploadedImages : initialImages ? initialImages : [],
    [uploadedImages, initialImages],
  );

  const [selectedImagesState, setSelectedImagesState] = useState<Array<LocalImageType>>([]);

  const uploadedImagesLength = uploadedImagesArray?.length;
  useEffect(() => {
    onInit?.(uploadedImagesArray);
  }, [uploaderId, uploadedImagesLength]);

  async function onChange(e) {
    const addedFiles: Array<File> = e.target.files;
    const files: Array<File> = [...addedFiles];
    const selectedImages: Array<LocalImageType> = [];

    if (FileReader && files.length) {
      for (let i = 0; i < files.length; i++) {
        const currentFile = files[i];
        const md5 = MD5(currentFile.name);
        // If this file does not already exists in our list, add it.
        const objectAlreadySelected = selectedImages.filter(obj => obj.md5 === md5).length;
        const objectUploaded = uploadedImagesArray?.filter(obj => obj.md5 === md5).length;

        if (objectUploaded) {
          notify.info(`An image you've selected has already been uploaded`);
          continue;
        }

        if (!objectAlreadySelected) {
          const newSource = URL.createObjectURL(files[i]);

          selectedImages.push({
            id: generateRandomString(8),
            uploaded: false,
            src: newSource,
            file: currentFile,
            md5,
          });

          setSelectedImagesState(selectedImages);
          if (instantUpload && !deferredUpload) {
            await upload(selectedImages);
          }
        } else {
          console.log('Already selected. Not adding');
        }

      }
    }
  }

  async function onDelete(image) {
    if (image.uploaded || image.fileId) {
      await onDeleteUploadedImage?.({
        fileId: image.fileId
      })
    } else {
      const selectedForDeleteIndex = selectedImagesState
        .findIndex(single => single.md5 === image.md5);

      const selected = [...selectedImagesState];
      selected.splice(selectedForDeleteIndex, 1);
      setSelectedImagesState(selected);
    }
  }


  async function upload(files: Array<LocalImageType>) {
    let selectedImages = [...selectedImagesState];
    const uploaded = [...uploadedImagesArray];
    // for each of the files to be uploaded
    // we loop backwards because of 'splice', used below,
    for (let i = files.length - 1; i >= 0; i--) {
      console.log("Attempting to upload file at index: ", i)
      const currentFile = files[i];

      // get an image signature from out servers
      const {data: signatureData} = await dispatch<any>(api.imageKit.getSignature());

      if (signatureData) {
        const formData = new FormData();
        // Append all the keys-values provided by the api
        Object.keys(signatureData).forEach(key => {
          formData.append(key, signatureData[key]);
        });
        formData.append('file', currentFile.file);
        formData.append('fileName', currentFile.file.name);
        const environment = env.getEnvironment();
        formData.append('folder', environment === 'production' ? folder : `${environment}/${folder}`);

        const {data: uploadData} = await dispatch<any>(api.imageKit.upload(formData, {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              if (typeof onUploadProgress === 'function') {
                onUploadProgress({
                  percentCompleted,
                  fileId: currentFile.md5,
                });
              }
            },
          }),
        );

        if (uploadData) {
          const uploadedData: UploadedImageType = {
            id: currentFile.id,
            md5: currentFile.md5,
            fileId: uploadData.fileId,
            thumbnailUrl: uploadData.thumbnailUrl,
            url: uploadData.url,
            uploaded: true,
          };

          // remove the uploaded item from the list of selected images
          selectedImages.splice(i, 1);
          setSelectedImagesState(selectedImages);

          uploaded.push(uploadedData);

          await onUpload?.(null, {images: uploaded, uploaderId});
          dispatch(imageUploadedAction({image: uploadedData, uploaderId}));

        } else {
          console.log('No upload data');
        }
      } else {
        console.log('No signature data');
        // const message = extractErrorMessage(rest);
        // notify('error', );
      }
    }
  }

  return (
    <>
      <Root>
        {
          uploadedImagesArray?.length ? (
            <div className={'preview'}>
              <div className={'header'}>
                <h4>Uploaded images</h4>
              </div>
              <div className={'preview--files'}>
                {
                  uploadedImagesArray?.map((image, index) => (
                    <div key={String(index)}>
                      <div style={{position: 'relative'}}>
                        <Delete onClick={() => onDelete(image)} />
                        {/*<Delete onClick={()=> onDelete(image)}/>*/}
                        <img style={{maxWidth: 150}} src={image.thumbnailUrl} alt={''} />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : (
            <div style={{marginBottom: 12}}>
              <p>
                No uploaded images
              </p>
            </div>
          )
        }
        {
          selectedImagesState.length ? (
            <div className={'preview'}>
              <div className={'header'}>
                <h4>Selected images</h4>
              </div>
              <div className={'preview--files'}>
                {
                  selectedImagesState?.map((image, index) => (
                    <SelectedImage>
                      <div style={{position: 'relative'}}>
                        <Delete onClick={() => onDelete(image)} />
                        <img src={image.src}
                             alt={''}
                             onClick={() => {
                               if (typeof onClickSelectedImage == 'function') {
                                 onClickSelectedImage([selectedImagesState[index]]);
                               }
                             }}
                        />
                      </div>
                    </SelectedImage>
                  ))
                }
              </div>
              {
                !deferredUpload && (
                  <div style={{textAlign: 'right'}}>
                    <Button isColor={'info'}
                            isSize={'small'}
                            onClick={async () => {
                              await upload(selectedImagesState);
                            }}
                    >
                      Upload
                    </Button>
                  </div>
                )
              }
            </div>
          ) : <span />
        }
        <input type="file"
               style={{display: 'none'}}
               multiple={allowMultiple}
               ref={inputRef}
               name={'file'}
               onChange={async (e) => {
                 if (typeof onBeforeChange === 'function') {
                   onBeforeChange(e);
                 }
                 await onChange(e);
               }}
        />
        <div>
          <Button
            isColor={'primary'}
            isSize={'small'}
            disabled={isSelectDisabled}
            onClick={() => {
              inputRef.current.click();
            }}
          >
            {allowMultiple ? 'Select images' : 'Select image'}
          </Button>
        </div>
      </Root>
    </>
  );
}

const Root = styled.div`
    padding: 12px 0;
    padding-bottom: 24px;
    .preview {
      border: 1px solid #cccccc;
      border-radius: 4px;
      padding: 8px 12px;
      margin-bottom: 12px;
      
      .header {
        padding-top: 24px;
        padding-left: 12px;
      }
      
      .preview--files {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        justify-items: center;
        grid-row-gap: 24px;
        margin-top: 24px;
        
        & > div {
          display: grid;
          align-items: center;
        }
        
        .delete {
            position: absolute;
            right: -7px;
            top: -8px;
            z-index: 1;
        }
        
        img {
          border-radius: 4px;
        }
      }
    }
`


export default CustomImageUploader;
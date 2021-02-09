import React, {useEffect, useMemo, useRef, useState} from 'react';
import {generateRandomString} from '../../helpers';
import styled from 'styled-components';
import {Button, Delete} from 'bloomer';
import {useAuth} from '../../network';
import MD5 from 'md5';
import {useDispatch} from 'react-redux';
import {useNotify} from '../../hooks';
import {env} from '../../config';

type LocalImageType = {
    // a random string
    id: string,
    uploaded: false,
    src: string,
    file: File,
    md5: string,
}

type UploadedImageType = {
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

function CustomImageUploader(
  {
      onInit,
      initialImages,
      instantUpload,
      deferredUpload,
      onUpload,
      onClickSelectedImage,
      allowMultiple,
      folder,
      id,
      onBeforeChange,
      onUploadProgress
  }: {
      onInit?: (images: Array<UploadedImageType>)=> void,
      initialImages?: UploadedImageType[],
      instantUpload?: boolean,
      deferredUpload?: boolean,
      folder: string,
      onUpload: (err, images: Array<UploadedImageType>)=> void,
      onClickSelectedImage?: (e)=> void,
      allowMultiple: boolean,
      id: string,
      onBeforeChange?: (e)=> void,
      onUploadProgress?: (progress: number)=> void

  }) {

    const api = useAuth();
    const dispatch = useDispatch();
    const notify = useNotify();

    const inputRef = useRef(null);
    // Only load these variables if 'componentName' is defined
    const uploadedImagesStorageName = `custom_uploader/${id}`;
    const uploadedImagesStorageJSON = localStorage.getItem(uploadedImagesStorageName);
    const uploadedImagesArray = useMemo(
      () => uploadedImagesStorageJSON ?
        // show the uploaded images or props.initialImages else []
        // presumably, uploaded images and initial images will be the same.
        JSON.parse(uploadedImagesStorageJSON) : initialImages ? initialImages : [],
      [uploadedImagesStorageJSON, initialImages],
    );

    const [selectedImagesState, setSelectedImagesState] = useState<Array<LocalImageType>>([]);
    const [uploadedImagesState, setUploadedImagesState] = useState<Array<UploadedImageType>>(uploadedImagesArray);

    const uploadedImagesArrayLength = uploadedImagesArray?.length;

    useEffect(() => {
        if (typeof onInit === 'function') {
            onInit(uploadedImagesArray);
        }
        setUploadedImagesState(uploadedImagesArray);
    }, [
      id,
      uploadedImagesArrayLength
    ]);

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
                const objectUploaded = uploadedImagesState.filter(obj => obj.md5 === md5).length;

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
                console.log("Already selected. Not adding")
              }

            }
        }
    }

    function removeItemFromArray<T>(array: T[], predicate: (item) => boolean) {
        const clonedArray: T[] = JSON.parse(JSON.stringify(array));
        const doneUploadingIndex = clonedArray.findIndex(predicate);
        clonedArray.splice(doneUploadingIndex, 1);
        return clonedArray;
    }

    async function onDelete(image) {
        if (image.uploaded) {
            notify.info('Not yet implemented');
        } else {
            const selectedForDeleteIndex = selectedImagesState
              .findIndex(single => single.md5 === image.md5);

            const selected = [...selectedImagesState];
            selected.splice(selectedForDeleteIndex, 1);
            setSelectedImagesState(selected);
        }
    }

    async function upload(files: Array<LocalImageType>) {
        let selectedImages = [];
        const uploaded = [...uploadedImagesState];
        for (let i = 0; i < files.length; i++) {
            const currentFile = files[i];

            const {data: signatureData} = await dispatch<any>(api.imageKit.getSignature());

            if (signatureData) {
                const formData = new FormData();
                // Append all the keys-values provided by the api
                Object.keys(signatureData).forEach(key => {
                    formData.append(key, signatureData[key]);
                });
                formData.append('file', currentFile.file);
                formData.append('fileName', currentFile.file.name);
                const environment = env.getEnvironment()
                formData.append('folder', environment === 'production' ? folder: `${environment}/${folder}`);

                const {data: uploadData} = await dispatch<any>(api.imageKit.upload(formData, {
                  // TODO: We should account for the 'current'
                  //  upload, rather than use a general callback like this.
                  onUploadProgress: (progressEvent)=> {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    if (typeof onUploadProgress === 'function') {
                      onUploadProgress(percentCompleted);
                    } else {
                      if (percentCompleted < 100) {
                        notify.progress(percentCompleted, {toastId: currentFile.id});
                      } else {
                        notify.dismiss(currentFile.id);
                      }
                    }
                  }
                }));

                if (uploadData) {
                    const uploadedData: UploadedImageType = {
                        id: currentFile.id,
                        md5: currentFile.md5,
                        fileId: uploadData.fileId,
                        thumbnailUrl: uploadData.thumbnailUrl,
                        url: uploadData.url,
                        uploaded: true,
                    };

                    // Delete uploaded item from uploading queue
                    selectedImages = removeItemFromArray(selectedImagesState, item => item.id === currentFile.md5);
                    setSelectedImagesState(selectedImages);

                    uploaded.push(uploadedData);
                    setUploadedImagesState(uploaded);

                    localStorage.setItem(uploadedImagesStorageName, JSON.stringify(uploaded));

                    // Delete from selected items
                    let selected = [...selectedImagesState];
                    selected = removeItemFromArray(selected, item => item.id === currentFile.id);
                    setSelectedImagesState(selected);

                    if (typeof onUpload === 'function') {
                        await onUpload(null, uploaded);
                    }

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
          uploadedImagesState?.length ? (
            <div className={'preview'}>
              <div className={'header'}>
                <h4>Uploaded images</h4>
              </div>
              <div className={'preview--files'}>
                {
                  uploadedImagesState?.map((image, index) => (
                    <div key={String(index)}>
                      <div style={{position: 'relative'}}>
                        {/*<Delete onClick={()=> onDelete(image)}/>*/}
                        <img style={{maxWidth: 150}} src={image.thumbnailUrl} alt={''}/>
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
                        <Delete onClick={() => onDelete(image)}/>
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
          ) : <span/>
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
          <Button isColor={'primary'}
                  isSize={'small'}
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

export default CustomImageUploader;
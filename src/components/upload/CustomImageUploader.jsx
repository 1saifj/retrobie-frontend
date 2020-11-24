import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {cleanString, extractErrorMessage, generateRandomString} from '../../helpers';
import styled from 'styled-components';
import {Button, Delete} from 'bloomer';
import {notify} from '../../helpers/views';
import {useApi} from '../../network';
import MD5 from 'uuid/dist/esm-node/md5';

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
      
      .preview--files {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        justify-items: center;
        grid-row-gap: 24px;
        
        & > div {
          display: grid;
          align-items: center;
        }
        
        .delete {
            position: absolute;
            right: -22px;
            top: -15px;
        }
        
        img {
          border-radius: 4px;
        }
      }
    }
`

function CustomImageUploader({onInit, initialImages}, ...props) {
    const api = useApi();
    CustomImageUploader.UPLOADED_IMAGES_PREFIX = "custom_image_uploader";

    const inputRef = useRef(null)
    const componentName = cleanString(props.name, "_");
    const uploadedImagesPrefix = "custom_image_uploader";
    // Only load these variables if 'componentName' is defined
    const uploadedImagesStorageName = componentName ? `${componentName}_${uploadedImagesPrefix}` : undefined;
    const uploadedImagesStorageJSON = localStorage.getItem(uploadedImagesStorageName);
    const uploadedImagesArray = useMemo(
      ()=> uploadedImagesStorageJSON ?
        // show the uploaded images or props.initialImages else []
        // presumably, uploaded images and initial images will be the same.
        JSON.parse(uploadedImagesStorageJSON) : initialImages ? initialImages : [],
      [uploadedImagesStorageJSON, initialImages]
    );

    const [selectedImagesState, setSelectedImagesState] = useState([]);
    const [uploadedImagesState, setUploadedImagesState] = useState(uploadedImagesArray);

    useEffect(() => {
        if (onInit && typeof onInit === "function") {
            onInit(uploadedImagesArray)
        }
        setUploadedImagesState(uploadedImagesArray);
    }, [componentName, uploadedImagesArray, onInit]);

    async function onChange(e) {
        const addedFiles = e.target.files;
        const files = [...addedFiles];
        const selectedImages = [];

        if (FileReader && files.length) {
            for (let i = 0; i < files.length; i++) {
                const currentFile = files[i];
                const md5 = MD5(currentFile.name);
                // If this file does not already exists in our list, add it.
                const objectAlreadySelected = selectedImages.filter(obj => obj.md5 === md5).length;
                const objectUploaded = uploadedImagesState.filter(obj => obj.md5 === md5).length;

                if (objectUploaded) {
                    notify("info", "An image you've selected has already been uploaded")
                    continue;
                }

                if (!objectAlreadySelected) {
                    const newSource = URL.createObjectURL(files[i]);

                    selectedImages.push({
                        id: generateRandomString(8),
                        uploaded: false,
                        src: newSource,
                        file: currentFile,
                        md5
                    });

                    setSelectedImagesState(selectedImages);
                    if (props.instantUpload && !props.deferredUpload) {
                        await upload(selectedImages);
                    }
                }

            }
        }
    }

    function removeItemFromArray(array, predicate) {
        const clonedArray = JSON.parse(JSON.stringify(array));
        const doneUploadingIndex = clonedArray.findIndex(predicate);
        clonedArray.splice(doneUploadingIndex, 1);
        return clonedArray;
    }

    async function onDelete(image) {
        if (image.uploaded) {
            notify("info", "Not yet implemented")
        } else {
            const selectedForDeleteIndex = selectedImagesState
                .findIndex(single => single.md5 === image.md5);

            const selected = [...selectedImagesState];
            selected.splice(selectedForDeleteIndex, 1);
            setSelectedImagesState(selected);
        }
    }

    async function upload(files) {
        let selectedImages = [];
        const uploaded = [...uploadedImagesState];
        for (let i = 0; i < files.length; i++) {
            const currentFile = files[i];
            const { data } = await api.imageKit.getSignature();

            const formData = new FormData();
            // Append all the keys-values provided by the api
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
            formData.append('file', currentFile.file);
            formData.append('fileName', currentFile.file.name);

            try {

                const { data } = await api.imageKit.upload(formData);

                const uploadedData = {
                    id: currentFile.id,
                    md5: currentFile.md5,
                    fileId: data.fileId,
                    thumbnailUrl: data.thumbnailUrl,
                    url: data.url,
                    uploaded: true
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

                if (props.onUpload && typeof props.onUpload === "function") {
                    await props.onUpload(null, uploaded);
                }


            } catch (e) {
                if (props.onUpload && typeof props.onUpload === "function") {
                    await props.onUpload(e, null);
                }
                const message = extractErrorMessage(e);
                notify('error', message);
            }

        }


    }

    return (
        <>
            <Root>
                {
                    uploadedImagesState?.length ? (
                        <div className={'preview'}>
                            <h4>Uploaded images</h4>
                            <div className={'preview--files'}>
                                {
                                    uploadedImagesState?.map(image => (
                                        <div>
                                            <div style={{ position: 'relative' }}>
                                                {/*<Delete onClick={()=> onDelete(image)}/>*/}
                                                <img style={{ maxWidth: 150 }} src={image.thumbnailUrl} alt={''} />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ) : <span />
                }
                {
                    selectedImagesState.length ? (
                        <div className={'preview'}>
                            <h4>Selected images</h4>
                            <div className={'preview--files'}>
                                {
                                    selectedImagesState?.map((image, index) => (
                                        <SelectedImage>
                                            <div style={{ position: 'relative' }}>
                                                <Delete onClick={() => onDelete(image)} />
                                                <img src={image.src || image.url}
                                                    alt={''}
                                                    onClick={() => {
                                                        if (props.onClickSelectedImage &&
                                                            typeof props.onClickSelectedImage == "function"
                                                        ) {
                                                            props.onClickSelectedImage([selectedImagesState[index]]);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </SelectedImage>
                                    ))
                                }
                            </div>
                            {
                                !props.deferredUpload && (
                                    <div style={{ textAlign: 'right' }}>
                                        <Button isColor={'info'}
                                            isSize={'small'}
                                            onClick={async () => {
                                                await upload(selectedImagesState)
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
                    style={{ display: 'none' }}
                    multiple={props.allowMultiple}
                    ref={inputRef}
                    name={props.name | "file"}
                    onChange={async (e) => {
                        if (props.onBeforeChange && typeof props.onBeforeChange === "function") {
                            props.onBeforeChange(e);
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
                        Select images
                    </Button>
                </div>
            </Root>
        </>
    );
}

CustomImageUploader.propTypes = {
    /*
        A unique id to for this uploader.
        it should preferably be a product/brand's name/slug.
        It will be stored in localStorage and used to maintain a level
        of uniqueness for images uploaded for each product/brand
    */
    name: PropTypes.string.isRequired,

    /**
     * TODO: A deferred upload is delayed until a trigger is called. It disables the upload button.
     */
    deferredUpload: PropTypes.bool,

    allowMultiple: PropTypes.bool,
    /**
     * Called just before onChange(e)
     */
    onBeforeChange: PropTypes.func,
    /**
     * Whether images should be instantly uploaded after
     *  they are selected.
     */
    instantUpload: PropTypes.bool,
    /**
     * Called when the delete button is clicked on a selected image
     */
    onDelete: PropTypes.func,
    /**
     * Called when a selected image is clicked.
     */
    onClickSelectedImage: PropTypes.func,
    onClickUpload: PropTypes.func,
    /**
     * Called when the upload has completed with (err, currentUpload, allUploads)
     */
    onUpload: PropTypes.func,
    /**
     * Called when the component mounts with any inital images
     */
    onInit: PropTypes.func,

    initialImages: PropTypes.array,
}

export default CustomImageUploader;
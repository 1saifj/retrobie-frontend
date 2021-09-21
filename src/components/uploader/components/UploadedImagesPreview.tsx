import {Button, Delete} from 'bloomer';
import React, {useEffect, useState} from 'react';
import {deleteAllImagesForUploaderAction, deleteUploadedImageAction} from '../../../state/actions';
import {extractErrorMessage} from '../../../helpers';
import {useApi, useNotify} from '../../../hooks';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {MetaState} from '../../../state/reducers/metaReducers';
import {UploadedImageType} from '../ImageUploader';
import {UploaderState} from '../../../state/reducers/uploaderReducers';

function UploadedImagesPreview({uploaderId, initialImages}) {

  const api = useApi();
  const dispatch = useDispatch();
  const notify = useNotify();

  const uploaderState: UploaderState = useSelector((state: RootStateOrAny) => state.uploader);
  const uploadedImages: UploadedImageType[] = uploaderState[uploaderId];

  const [images, setImages] = useState<UploadedImageType[]>([]);

  useEffect(() => {
    if (initialImages?.length) {
      setImages(initialImages);
    } else if (uploadedImages?.length) {
      setImages(uploadedImages);
    } else {
      setImages([]);
    }

  }, [
    // listen for any changes in the uploader component.
    // Note that this is only added to listen for changes to uploadedImages
    uploaderState,
    uploadedImages,
    // if a new set of initial images is supplied,
    // we need to re-render them
    initialImages,
    // every time the uploaderId is changed, we lookup
    // a new set of uploaded images
    uploaderId,
  ]);

  const onDelete = async (image) => {
    try {
      await api.products.deleteImage({fileId: image.fileId});

      dispatch(deleteUploadedImageAction({uploaderId, fileId: image.fileId}));

      notify.success('Image deleted');
    } catch (e) {
      const message = extractErrorMessage(e);
      notify.error(message);
    }
  };

  function deleteImagesForUploaderId() {
    return dispatch(deleteAllImagesForUploaderAction({uploaderId}));
  }

  return (
    <>
      <div>
        {
          images?.length ? (
            <div className={'preview'}>
              <div className={'header'}>
                <h4>Uploaded images</h4>
              </div>
              <div>
              </div>
              <div className={'preview--files'}>
                {
                  images?.map((image, index) => (
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
              <div>
                <Button
                  isColor={'warning'}
                  isSize={'small'}
                  onClick={deleteImagesForUploaderId}
                >
                  Clear images for this id
                </Button>
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


      </div>
    </>
  );
}

export default UploadedImagesPreview;

import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {RootStateOrAny, useSelector} from 'react-redux';
import {MetaState} from '../../state/reducers/metaReducers';
import 'react-circular-progressbar/dist/styles.css';
import humps from '../../helpers/humps';
import UploadedImagesPreview from './components/UploadedImagesPreview';
import SelectedImagesPreview from './components/SelectedImagesPreview';
import {env} from '../../config';
import {UploaderState} from '../../state/reducers/uploaderReducers';

export type LocalImageType = {
  // a random string
  id: string,
  uploaded: false,
  src: string,
  file: File,
  md5: string,
  isUploading?: boolean
  error?: string
  uploadPercent?: number
}

export type UploadedImageType = {
  // a random string
  id: string,
  uploaded: boolean,
  md5: string,
  url: string;
  fileId: string;
  thumbnailUrl: string
  error?: string
  createdAt?: string
}



interface CustomImageUploaderParams {
  initialImages?: UploadedImageType[];
  isSelectDisabled?: boolean;
  folder: string;
  onUpload: (err, {uploadedImage, uploaderId}: {uploadedImage: UploadedImageType; uploaderId: string}) => void;
  allowMultiple: boolean;
  id: string;
  onIdGenerated?: ({uploaderId, uploadedImages}) => void
}


function ImageUploader(props: CustomImageUploaderParams) {


  let {
    id,
    folder,
    onUpload,
    initialImages,
    isSelectDisabled,
    onIdGenerated,
    allowMultiple,
  } = props;

  if (!id) id = 'empty';


  const generateId = (id: string) => humps.generateUploaderId(id);

  const uploaderId = useMemo(() => generateId(id), [id]);

  const uploaderState: UploaderState = useSelector((state: RootStateOrAny) => state.uploader);
  const uploadedImages: UploadedImageType[] = uploaderState[uploaderId];

  if (!folder) {
    folder = 'uncategorized';
  }

  if (!env.isProduction()) {
    folder = 'development/' + folder;
  }

  useEffect(() => {
    onIdGenerated?.({uploaderId, uploadedImages});
  }, [uploaderId]);


  return (
    <>
      <Root>
        Uploader id: {uploaderId}
        <UploadedImagesPreview
          uploaderId={uploaderId}
          initialImages={initialImages}
        />

        <SelectedImagesPreview
          uploaderId={uploaderId}
          onUpload={onUpload}
          isSelectDisabled={isSelectDisabled}
          allowMultiple={allowMultiple}
          folder={folder} />

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
`;


export default ImageUploader;

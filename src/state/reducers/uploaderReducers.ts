import {ADD_IMAGE_TO_STATE, REMOVE_ALL_UPLOADED_IMAGES, REMOVE_UPLOADED_IMAGE} from '../actions/constants';
import {UploadedImageType} from '../../components/uploader/ImageUploader';

export type UploaderState = {
  [id: string]: Array<UploadedImageType>
}

const initialState: UploaderState = {};


const uploaderReducers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_IMAGE_TO_STATE:
      let imageUploadedState = Object.assign({}, state);
      const {uploaderId, image: uploadedImage}: {image: UploadedImageType, uploaderId: string} = action.payload;

      const thisUploader = imageUploadedState[uploaderId];
      if (!thisUploader) {
        imageUploadedState[uploaderId] = [];
      }
      imageUploadedState[uploaderId].push(uploadedImage);

      console.log('New uploader state: ', imageUploadedState);
      return imageUploadedState;

    case REMOVE_UPLOADED_IMAGE:
      let imageUploadResetState = Object.assign({}, state);
      const {uploaderId: id, fileId}: {fileId: string, uploaderId: string} = action.payload;
      imageUploadResetState[id] =
        imageUploadResetState[id]?.filter(st => {
          return st.fileId !== fileId;
        });
      return imageUploadResetState;
    case REMOVE_ALL_UPLOADED_IMAGES:
      let removeAllImagesState = Object.assign({}, state);
      const {uploaderId: rId}: {uploaderId: string;} = action.payload;
      removeAllImagesState[rId] = [];
      return removeAllImagesState;
    default:
      return state;
  }
};

export default uploaderReducers;

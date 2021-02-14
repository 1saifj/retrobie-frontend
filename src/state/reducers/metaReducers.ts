import {IMAGE_UPLOADED, REMOVE_UPLOADED_IMAGE, TOGGLE_SIDEBAR} from '../actions/constants';
import {UploadedImageType} from '../../components/upload/CustomImageUploader';

export type MetaState = {
  isSidebarOpen: boolean,
  theme: 'light' | 'dark',
  components: {
    imageUploader: {
      [uploaderId: string]: UploadedImageType[]
    }
  }
}

const initialState: MetaState = {
  isSidebarOpen: false,
  theme: 'light',
  components: {
    imageUploader: {

    }
  }
};

const metaReducers = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      let toggleSidebarState = Object.assign({}, state);
      toggleSidebarState.isSidebarOpen = action.payload.open;
      return toggleSidebarState;
    case IMAGE_UPLOADED:
      let imageUploadedState = Object.assign({}, state);
      const {uploaderId, image: uploadedImage}: {image: UploadedImageType, uploaderId: string} = action.payload;
      // todo: make sure there are no duplicates within an uploader
      //  ie: check uploaderId for the existence of images with similar ids
      //   before pushing them
      const thisUploader = imageUploadedState.components.imageUploader[uploaderId];
      if (!thisUploader){
        imageUploadedState.components.imageUploader[uploaderId] = [];
      }
      imageUploadedState.components.imageUploader[uploaderId].push(uploadedImage);
      return imageUploadedState;

    case REMOVE_UPLOADED_IMAGE:
      let imageUploadResetState = Object.assign({}, state);
      const {uploaderId: id}: {image: UploadedImageType, uploaderId: string} = action.payload;
      imageUploadResetState.components.imageUploader[id] = undefined;
      return imageUploadResetState;
    default:
      return state;
  }
};

export default metaReducers;
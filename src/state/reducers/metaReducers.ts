import {
  ADD_IMAGE_TO_STATE,
  REMOVE_ALL_UPLOADED_IMAGES,
  REMOVE_UPLOADED_IMAGE,
  TOGGLE_SIDEBAR,
} from '../actions/constants';
import {UploadedImageType} from '../../components/uploader/ImageUploader';

export type MetaState = {
  isSidebarOpen: boolean,
  theme: 'light' | 'dark',
}

const initialState: MetaState = {
  isSidebarOpen: false,
  theme: 'light',
};

const metaReducers = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      let toggleSidebarState = Object.assign({}, state);
      toggleSidebarState.isSidebarOpen = action.payload.open;
      return toggleSidebarState;
    default:
      return state;
  }
};

export default metaReducers;

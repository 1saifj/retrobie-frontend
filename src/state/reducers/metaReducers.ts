import {TOGGLE_SIDEBAR} from '../actions/constants';

const initialState = {
  isSidebarOpen: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      let toggleSidebarState = Object.assign({}, state);
      toggleSidebarState.isSidebarOpen = action.payload.open;
      return toggleSidebarState;
    default:
      return state;
  }
};

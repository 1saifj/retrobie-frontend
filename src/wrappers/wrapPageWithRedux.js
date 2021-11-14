import React from 'react';
import {Provider} from 'react-redux';
import configureStore from '../state';

const {store} = configureStore();

const wrapWithRedux = ({element}) => <Provider store={store}>{element}</Provider>;

export default wrapWithRedux;

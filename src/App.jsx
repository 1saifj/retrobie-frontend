import React from 'react';
import Landing from './pages/landing';
import './assets/style/index.scss';


const App = ({history}) => {
    return (
        <>
            <Landing history={history}/>
        </>
    );
};

export const CloseButton = ({closeToast}) => (
    <button className="delete" onClick={closeToast}/>
);

export default App;

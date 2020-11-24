import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {colorPrimary} from '../../constants/theme';
import {Transition} from 'react-transition-group';


function Loading(props) {
    const [mounted, setMounted] = useState(false);

    const defaultStyle = {
        transition: `opacity 250ms ease-in-out`,
        opacity: 1,
    };

    const transitionStyles = {
        entering: {opacity: 1},
        entered: {opacity: 1},
        exiting: {opacity: 0},
    };

    useEffect(() => {
        setMounted(true);
    });
    return (
        <>
            <Transition in={mounted} timeout={100}>
                {
                    state => (
                        <div style={{...defaultStyle, ...transitionStyles[state]}}>
                            <LoadingComponent minor={props.minor}>
                                <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                                    <div className="loader"/>
                                    {
                                        props.message !== false &&
                                        <p>{props.message ? props.message : "Loading, please wait..."}</p>
                                    }
                                </div>
                            </LoadingComponent>
                        </div>
                    )
                }
            </Transition>
        </>
    );
}

Loading.propTypes = {
    minor: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export default Loading;

const LoadingComponent = styled.div`
    height: ${p => p.minor ? "" : "100vh"} ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    font-family: Josefin Sans, Helvetica, Helvetica Neue, Arial, sans-serif;
    
    .loader,
    .loader:after {
      border-radius: 50%;
      width: 5em;
      height: 5em;
    }
    
    .loader {
      font-size: 3px;
      position: relative;
      text-indent: -9999em;
      border-top: 2px solid ${colorPrimary};
      border-right: 2px solid ${colorPrimary};
      border-bottom: 2px solid #ffffff;
      border-left: 2px solid #ffffff;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load8 250ms infinite linear;
      animation: load8 250ms infinite linear;
      margin: 12px;
    }
    @-webkit-keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
`;

import React from 'react';
import PropTypes from 'prop-types';
import './animated-logo.scoped.css';
import styled from 'styled-components';

const NAV_ANIMATION_PLAYED = 'NAV_ANIMATION_PLAYED';

const AnimatedLogo = props => {
    const navAnimationPlayed = sessionStorage.getItem(NAV_ANIMATION_PLAYED);

    return (
        <>
            {
                props.plain || Boolean(navAnimationPlayed) ?
                    <PlainLogo>
                        <div style={{color: props.color}} className="text">
                            RETROBIE
                        </div>
                    </PlainLogo>
                    :
                    <div className="stage" onAnimationEnd={()=> sessionStorage.setItem(NAV_ANIMATION_PLAYED, 'true')}>
                        <div className="wrapper">
                            <div className="slash"/>
                            <div className="sides">
                                <div className="side"/>
                                <div className="side"/>
                                <div className="side"/>
                                <div className="side"/>
                            </div>
                            <div className="text">
                                <div className="text--backing" style={{color: props.color}}>RETROBIE</div>
                                <div className="text--left">
                                    <div className="inner" style={{color: props.color}}>RETROBIE</div>
                                </div>
                                <div className="text--right">
                                    <div className="inner" style={{color: props.color}}>RETROBIE</div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

AnimatedLogo.propTypes = {
    plain: PropTypes.bool,
    color: PropTypes.string
};

const PlainLogo = styled.div`
    position: relative;
    color: #fff;
    font-size: 2.5rem;
    letter-spacing: 0.25rem;
    padding-top: 0.65rem;
    padding-right: 0.36rem;
    padding-bottom: 0.2rem;
    
    div {
      color: inherit;
    }
`;

export default AnimatedLogo;

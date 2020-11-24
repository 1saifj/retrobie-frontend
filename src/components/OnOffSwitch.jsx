import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

const OnOffSwitch = props => {
    const [checked, setChecked] = useState(false);
    return (
        <>
            <div style={{display: 'flex'}}>
                <OnOffSwitchParent onText={props.onText} offText={props.offText}>
                    <p className={'label'}>{props.label}</p>
                    <input onChange={(e) => {
                        if (props.onChange && typeof props.onChange === 'function') {
                            props.onChange(e.target.checked);
                        }
                        setChecked(e.target.checked);
                    }}
                           type="checkbox"
                           id="switch"/><label style={{marginTop: 0}}
                    htmlFor="switch">Toggle</label>
                </OnOffSwitchParent>
                <div style={{
                    alignSelf: 'center',
                    marginLeft: '-70px',
                    zIndex: 1,
                    marginBottom: '-20px'}}>
                    <p style={{
                        marginTop: '4px',
                        color: '#444',
                        fontWeight: '700',
                        fontFamily: '"Myriad Pro", serif',
                        marginLeft: '8px',
                        fontSize: '14px'
                    }}>
                        {checked ? props.onText : props.offText}
                    </p>
                </div>
            </div>
        </>
    );
};

OnOffSwitch.propTypes = {
    onText: PropTypes.string.isRequired,
    offText: PropTypes.string.isRequired,
    onChange: PropTypes.func
};

export default OnOffSwitch;

const OnOffSwitchParent = styled.div`
input[type=checkbox]{
  height: 0;
  width: 0;
  visibility: hidden;
  display:none;
}

label {
  cursor: pointer;
  text-indent: -9999px;
  width: 90px;
  height: 35px;
  background: grey;
  display: block;
  border-radius: 100px;
  position: relative;
}

label:after {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

input:checked + label {
  background: var(--color-primary);
}

input:checked + label:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
}

label:active:after {
  width: 48px;
}

// centering
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
`

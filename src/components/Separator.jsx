import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

const SeparatorCSS = styled.div`
.separator {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 24px 0;
}
.separator::before, .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #cccccc;
}
.separator::before {
    margin-right: .25em;
}
.separator::after {
    margin-left: .25em;
}

`
export default function Separator(props) {

  return (
    <SeparatorCSS>
      <div className="separator">{props.text}</div>
    </SeparatorCSS>
  );
}

Separator.propTypes = {
  text: PropTypes.string
}
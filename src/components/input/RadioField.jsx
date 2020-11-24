import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Radio} from 'bloomer';

const RadioParent = styled.div`
  display: flex;
  align-items: center;
  border: ${
  props =>
    props.bordered && props.selected ? '2px solid var(--color-primary)' :
      props.bordered ? '2px solid lightgray' : ''
  };
  border-radius: 2px;
  padding: 8px 12px;
  transition: all ease-in-out 0.25s;
  
  &:hover {
    cursor:pointer;
  }
  
  .radio {
    display: flex;
    align-items: center;
  }
  .radio span {
    margin-left: 8px;
  }
`;

const RadioGroupParent = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  gap: 8px;
  flex-wrap: wrap;

  & > div {
    flex: 1 1 100px;
  }
`

export default function RadioField(props) {

  const [selectedGroupItem, setSelectedGroupItem] = useState('');

  function onChange(value) {
    if (typeof props.onChange === 'function') {
      props.onChange(value);
    }
  }

  if (!props.isGroup)
    return (
      <>
        <RadioParent onChange={(e) => onChange(e.target.value)}>
          <Radio name={props.name} value={props.value} />
        </RadioParent>
      </>
    );

  return (
    <>
      <RadioGroupParent
        style={{ display: props.inline ? 'flex' : 'block' }}
      >
        {
          props.options?.map(item => (
            <>
              <div>
                <RadioParent
                  bordered={props.bordered}
                  selected={selectedGroupItem === item.value}
                  onClick={(e) => {
                    setSelectedGroupItem(item.value);
                    if (props.onChange && typeof props.onChange === 'function') {
                      onChange(item.value);
                    }

                  }}
                >
                  <Radio name={props.name}
                    value={item.value}
                    checked={selectedGroupItem === item.value}
                  >
                    <span style={{ width: 'max-content' }}>{item.label}</span>
                  </Radio>
                </RadioParent>
              </div>

            </>
          ))
        }
      </RadioGroupParent>
    </>
  )

};

RadioField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  isGroup: PropTypes.bool,
  inline: PropTypes.bool,
  bordered: PropTypes.bool,
  options: PropTypes.array,
  onChange: PropTypes.func,
  help: PropTypes.string
}

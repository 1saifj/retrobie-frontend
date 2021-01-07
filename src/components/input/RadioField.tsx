import React, {useState} from 'react';
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

export default function RadioField(
  {
    onChange,
    name,
    bordered,
    isGroup,
    value,
    inline,
    options
  }: {
    onChange: Function,
    name?: string,
    bordered?: boolean,
    isGroup?: boolean,
    value?: string,
    inline?: boolean,
    options: Array<{label: string, value: string}>
  }) {

  const [selectedGroupItem, setSelectedGroupItem] = useState('');

  if (!isGroup)
    return (
      <>
        <RadioParent onChange={(e) => onChange(e.target.value)}>
          <Radio name={name} value={value} />
        </RadioParent>
      </>
    );

  return (
    <>
      <RadioGroupParent
        style={{ display: inline ? 'flex' : 'block' }}
      >
        {
          options?.map(item => (
            <>
              <div>
                <RadioParent
                  bordered={bordered}
                  selected={selectedGroupItem === item.value}
                  onClick={() => {
                    setSelectedGroupItem(item.value);
                    if (typeof onChange === 'function') {
                      onChange(item.value);
                    }
                  }}
                >
                  <Radio
                    name={name}
                    value={item.value}
                    readOnly
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

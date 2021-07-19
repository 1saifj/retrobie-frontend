import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Radio} from 'bloomer';
import {useField} from 'formik';

const RadioParent = styled.div<{bordered?: boolean; selected?: boolean}>`
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
    flex: 1 1 50px;
  }
`

interface RadioOptionValue {
  label: string;
  value: string;
}

interface RadioFieldProps {
  onChange?: (value: string, index?: number)=> void,
  name?: string,
  bordered?: boolean,
  isGroup?: boolean,
  value?: string,
  inline?: boolean,
  selectedGroupItems?: Array<RadioOptionValue>
  options: Array<RadioOptionValue>
}

export default function RadioField(props: RadioFieldProps) {

  const [field] = useField(props.name);

  const [selectedGroupItems, setSelectedGroupItems] = useState<RadioOptionValue[]>(props.selectedGroupItems);

  const selectedItemsLength = props.selectedGroupItems?.length;

  useEffect(()=> {
    setSelectedGroupItems(props.selectedGroupItems ?? [])
  }, [selectedItemsLength])

  if (!props.isGroup)
    return (
      <>
        <RadioParent
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.onChange?.(e.target.value)
              field.onChange(e);
            }}>
          <Radio name={props.name} value={props.value} />
        </RadioParent>
      </>
    );


  if (!selectedGroupItems) return <span/>

  return (
    <>
      <RadioGroupParent
        style={{ display: props.inline ? 'flex' : 'block' }}
      >
        {
          props.options?.map((item, index) => (
            <>
              <div>
                <RadioParent
                  bordered={props.bordered}
                  selected={Boolean(selectedGroupItems?.find(groupItem=> groupItem?.value === item.value))}
                  onClick={(e) => {
                    setSelectedGroupItems(()=> {
                      const newArr = [];
                      newArr[index] = {
                        value: item.value
                      }
                      return newArr;
                    });
                    if (typeof props.onChange === 'function') {
                      props.onChange(item.value, index);
                    }
                    field.onChange({
                      ...e,
                      target: {
                        ...e.target,
                        name: props.name
                      }
                    })
                  }}
                >
                  <Radio
                    name={props.name}
                    value={item.value}
                    readOnly
                    checked={Boolean(selectedGroupItems?.find(groupItem=> groupItem?.value === item.value))}
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

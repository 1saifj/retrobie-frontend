import React, {ReactElement, useEffect, useState} from 'react';
import {useField} from 'formik';
import {Help, Input, Label, TextArea} from 'bloomer';
import styled from 'styled-components';

const TextField: ({label, chars, buttonAction, help, ...props}: {
  label: string | ReactElement;
  name: string;
  placeholder: string;
  chars?: number;
  buttonAction?: Function;
  help?: string;
  [p: string]: any
}) => (JSX.Element) = ({label, chars, buttonAction, help, ...props}) => {
  // @ts-ignore
  const [field, meta] = useField(props);
  const [charRemaining, setRemaining] = useState(chars);
  const [tooHigh, setTooHigh] = useState(false);
  const [isButtonActive, setButtonActive] = useState(true);

  // This is used to add and remove the 'has-error' class name
  const hasError = meta.touched && meta.error;

  useEffect(() => {
    if (props.type === 'textarea') {
      if (field.value) {
        const remaining = chars - field.value.length;
        setRemaining(remaining);

        if (remaining < 0) {
          setTooHigh(true);
        } else {
          setTooHigh(false);
        }
      }
    }
  }, [field.value]);

  // @ts-ignore
  if (props.type === 'textarea') {
    return (
      <>
        <InputParent className={hasError ? 'has-error' : ''} tooHigh={tooHigh}>
          <Label>{label}</Label>
          <TextArea {...field} {...props} />
          <Help>{help}</Help>
          <div className="count" style={{position: 'absolute'}}>
            {charRemaining}
          </div>

          {hasError ? (
            <div className="error">
              <small>{meta.error}</small>
            </div>
          ) : null}
        </InputParent>
      </>
    );
  }

  return (
    <>
      <InputParent className={hasError ? 'has-error' : ''} isButtonActive={isButtonActive}>
        <Label>{label}</Label>
        <div
          className={'parent'}
          style={{background: props.disabled ? 'whitesmoke' : 'transparent'}}
        >
          {props.prefix && (
            <div className={'prefix'}>
              <p>{props.prefix}</p>
            </div>
          )}
          <Input
            {...field}
            {...props}
            onFocus={e=> {
              if (props.onFocus && typeof props.onFocus === 'function') {
                props.onFocus(e);
              }
            }}
            onBlur={e=> {
              field.onBlur(e);
              if (props.onBlur && typeof props.onBlur === 'function') {
                props.onBlur(e);
              }
            }}
            onChange={(e)=> {
              field.onChange(e);
              if (props.onChange && typeof props.onChange === 'function') {
                props.onChange(e);
              }
            }}
            style={{marginLeft: props.prefix ? '-33px' : '0'}}/>
          {props.icon && (
            <img
              src={props.icon}
              alt={'input image'}
              onClick={() => {
                setButtonActive(!isButtonActive);
                buttonAction(isButtonActive);
              }}
            />
          )}
        </div>
        {help && (
          <>
            <Help>{help}</Help>
          </>
        )}

        {hasError ? (
          <div className="error">
            <small>{meta.error}</small>
          </div>
        ) : null}
      </InputParent>
    </>
  );
};

export default TextField;

const InputParent = styled.div<{tooHigh?: boolean; isButtonActive?: boolean}>`
  text-align: left;
  font-weight: bold;
  position: relative;

  .help {
    font-weight: normal;
    margin: 0;
    margin-top: 4px;
  }

  .parent {
    display: flex;
    justify-content: space-between;

    .prefix {
      padding: 10px 16px;
      border-radius: 2px;
      color: #4a4a4a;
      z-index: 1;

      p {
        margin: 0;
        color: #7a7a7a;
        width: max-content;
      }
    }

    img {
      width: 18px;
      margin-left: 12px;
      opacity: ${props => (props.isButtonActive ? 1 : 0.6)};
      transition: opacity 0.25s ease-in-out;

      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }
  }

  input {
    transition: all ease-in-out 0.25s;
  }

  &.has-error {
    input,
    textarea {
      border-color: var(--color-error);
    }
  }

  .description {
    margin-top: 4px;
    margin-left: 8px;

    small {
      color: var(--color-description);
    }
  }

  .count {
    position: absolute;
    bottom: 5px;
    right: 15px;
    font-weight: normal;
    font-size: 14px;
    color: ${p => (p.tooHigh ? 'var(--color-error)' : 'currentColor')};
  }

  .error {
    text-align: left;
    padding: 8px;

    small {
      white-space: pre-line;
      color: var(--color-error);
    }
  }
`;

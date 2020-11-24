import React from 'react';
import {useField} from 'formik';
import {Select} from 'bloomer';

export default function SelectField({options, placeholder, ...props}) {

  const [field, meta, helpers] = useField(props)

  const hasError = meta.touched && meta.error;

  return (
    <>
      <div className={hasError ? 'has-error' : ''}>
        <label>
          {props.label}
        </label>
        <Select
          {...field}
          {...props}
          onChange={(e) => {
            field.onChange(e.target.value);
            helpers.setValue(e.target.value);
          }}
        >
          <option disabled selected>
            {placeholder}
          </option>
          {
            options?.map(item=> (
              <option value={item.value}>
                {item.label}
              </option>
            ))
          }
        </Select>

        {
          hasError ? (
            <div className="error" style={{marginTop: 4, marginLeft: 6}}>
              <small>{meta.error}</small>
            </div>
          ) : null
        }
      </div>
    </>
  );
}
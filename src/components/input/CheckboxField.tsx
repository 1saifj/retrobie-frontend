import React from 'react';
import {useField} from 'formik';


const CheckboxField = (props)=> {

  const [field, meta, errors] = useField(props)

  return (
    <div>
      <label>{props.label}</label>
      <input
        onChange={field.onChange}
        name={props.name}
        className="checkbox input"
        type="checkbox" />
    </div>
  );
}

export default CheckboxField;
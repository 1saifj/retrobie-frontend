import React from 'react';
import {Form, Formik, Field, FieldArray} from 'formik';
import styled from 'styled-components';
import {Button} from 'bloomer';

export default function AddProductType(props) {
  return (
    <AddProductTypeSyled>
      <h4>Create New Product Type</h4>

      <Formik
        initialValues={{
          name: '',
          options: [
            {
              name: '',
              values: [{value: ''}],
            },
          ],
        }}
        onSubmit={async values => {
          await new Promise(r => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({errors, touched, isValidating, values}) => (
          <Form className="product-type-form">
            <label htmlFor="name">Product Type Name</label>
            <Field name="name" id="name" placeholder="eg Sneakers" style={{width: '100%'}} />
            {errors.name && touched.name ? <div className="formErrored">{errors.name}</div> : null}
            <h5>Product Type Options</h5>
            <FieldArray name="options">
              {({insert, remove, push}) => (
                <>
                  <div className="option-values">
                    {values.options.length > 0 &&
                      values.options.map((_, index) => (
                        <div key={index}>
                          <label htmlFor={`options.${index}.name`}>Option Name</label>
                          <Field
                            name={`options.${index}.name`}
                            placeholder="eg Size"
                            type="text"
                            id={`options.${index}.name`}
                            className="options-input"
                          />
                          <h6>Option Values</h6>
                          <FieldArray name={`options.${index}.values`}>
                            {({insert, remove, push}) => (
                              <>
                                <div className="option-value">
                                  {values.options[index].values.length > 0 &&
                                    values.options[index].values.map((_, valueIndex) => (
                                      <div key={valueIndex}>
                                        <label
                                          htmlFor={`options.${index}.values.${valueIndex}.value`}
                                        >
                                          Value
                                        </label>
                                        <Field
                                          name={`options.${index}.values.${valueIndex}.value`}
                                          placeholder="eg 42"
                                          type="text"
                                          id={`options.${index}.values.${valueIndex}.value`}
                                          className="options-input"
                                        />

                                        <Button onClick={() => remove(valueIndex)}>
                                          Delete Value
                                        </Button>
                                      </div>
                                    ))}
                                </div>
                                <Button onClick={() => push({value: ''})}>Add Another Value</Button>
                              </>
                            )}
                          </FieldArray>

                          <div>
                            <Button onClick={() => remove(index)}>Delete This Option</Button>
                          </div>
                        </div>
                      ))}
                  </div>
                  <Button onClick={() => push({name: '', values: [{value: ''}]})}>
                    Add New Option
                  </Button>
                </>
              )}
            </FieldArray>
            <Button type="submit">Create Product Type</Button>
          </Form>
        )}
      </Formik>
    </AddProductTypeSyled>
  );
}

const AddProductTypeSyled = styled.div`
  & .product-type-name {
    display: flex;
    flex-direction: column;
  }

  & .options-input {
    width: 100%;
  }

  & .formErrored {
    color: red;
  }

  & .options {
    border: 1px solid black;
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

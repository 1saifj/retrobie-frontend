import React from 'react';
import {Form, Formik, FieldArray} from 'formik';
import styled from 'styled-components';
import {Button} from 'bloomer';
import * as Yup from 'yup';
import {MIN, REQUIRED} from '../validator/messages';
import {TextField} from '../../../components/input';
import {useAuth, useNotify} from '../../../hooks';
import {useDispatch} from 'react-redux';
import {extractErrorMessage} from '../../../helpers';

const productTypeOptionValueSchema = Yup.object().shape({
  value: Yup.string().required(REQUIRED),
});

const ProductTypeOptionSchema = Yup.object().shape({
  name: Yup.string().required(REQUIRED),
  values: Yup.array().of(productTypeOptionValueSchema).min(1, MIN(1)),
});

const AddProductTypeValidationSchema = Yup.object().shape({
  name: Yup.string().required(REQUIRED).min(2, MIN(2)),
  options: Yup.array().of(ProductTypeOptionSchema).min(1, MIN(1)),
});

export default function AddProductType(props) {
  const api = useAuth();
  const dispatch = useDispatch();
  const notify = useNotify();

  return (
    <AddProductTypeSyled>
      <h4 style={{textAlign: 'center'}}>Create New Product Type</h4>

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
        onSubmit={async (submitValues, {setSubmitting}) => {
          setSubmitting(true);
          const {data, ...rest} = await dispatch<any>(api.productTypes.create(submitValues));

          if (data) {
            setSubmitting(false);
            notify.success(`Successfully created ${submitValues.name}.`);
          } else {
            setSubmitting(false);
            const message = extractErrorMessage(rest);
            notify.error(message || `Could not create ${submitValues.name}.`);
          }
        }}
        validationSchema={AddProductTypeValidationSchema}
      >
        {({values, isSubmitting, isValid}) => (
          <Form className="product-type-form">
            <TextField
              name="name"
              type="text"
              label={<label htmlFor="name">Product Type Name</label>}
              placeholder="eg Sneakers"
            />
            <h5>Product Type Options</h5>
            <FieldArray name="options">
              {({remove, push}) => (
                <>
                  <div className="option-values">
                    {values.options.length > 0 &&
                      values.options.map((_, index, optionsArray) => (
                        <div key={index} className="option-values__parent">
                          <TextField
                            name={`options.${index}.name`}
                            type="text"
                            label={<label htmlFor={`options.${index}.name`}>Option Name</label>}
                            placeholder="eg Size"
                          />
                          <h6>Option Values</h6>
                          <FieldArray name={`options.${index}.values`}>
                            {({remove, push}) => (
                              <>
                                <div className="option-values__wrapper">
                                  {values.options[index].values.length > 0 &&
                                    values.options[index].values.map(
                                      (_, valueIndex, valuesArray) => (
                                        <div key={valueIndex} className="option-values__value">
                                          <div className="option-values__group">
                                            <TextField
                                              name={`options.${index}.values.${valueIndex}.value`}
                                              type="text"
                                              label={
                                                <label
                                                  htmlFor={`options.${index}.values.${valueIndex}.value`}
                                                >
                                                  Value
                                                </label>
                                              }
                                              placeholder="eg 42"
                                            />
                                            <Button
                                              isColor="danger"
                                              onClick={() => remove(valueIndex)}
                                              disabled={valuesArray.length <= 1}
                                            >
                                              X
                                            </Button>
                                          </div>
                                        </div>
                                      )
                                    )}
                                </div>
                                <Button
                                  isColor="info"
                                  className="button--okay"
                                  onClick={() => push({value: ''})}
                                >
                                  Add Another Value
                                </Button>
                              </>
                            )}
                          </FieldArray>
                          <Button
                            disabled={optionsArray.length <= 1}
                            isColor="danger"
                            onClick={() => remove(index)}
                          >
                            Delete This Option
                          </Button>
                        </div>
                      ))}
                  </div>
                  <Button isColor="info" onClick={() => push({name: '', values: [{value: ''}]})}>
                    Add New Option
                  </Button>
                </>
              )}
            </FieldArray>
            <Button
              isColor="success"
              isLoading={isSubmitting}
              disabled={isSubmitting || !isValid}
              type="submit"
            >
              Create Product Type
            </Button>
          </Form>
        )}
      </Formik>
    </AddProductTypeSyled>
  );
}

const AddProductTypeSyled = styled.div`
  .button {
    padding: 0.5rem 1rem;
    font-size; 0.8rem;
  }

  .product-type-name {
    display: flex;
    flex-direction: column;
  }

  .product-type-form {
    button {
      margin: 1rem;
    }
  }

  .options-input {
    width: 100%;
  }

  .option-values {
    border: 1px solid black;
    padding: 1rem;
    margin-bottom: 1rem;

    &__group {
      display: grid;
      grid-template-columns: 80% 1fr;
      grid-template-rows: repeat(3, 2.25rem);
      button {
        padding: 0.25rem 0.75rem;
        margin: 0;
        margin-left: 1rem;
        grid-column: 2 / -1;
        grid-row: 2 / span 1;
      }
    }

    &__parent {
      display: flex;
      flex-direction: column;
      border-bottom: 1px dashed rgba(var(--color-primary), 0.5);

      & > .button {
        margin 0.5rem 1rem;
        min-width: 50%;
        align-self: center;
      }
    }

    &__wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      border: 1px dashed rgba(0, 0, 0, 0.7);
      padding: 1rem;
      margin-bottom: 1rem;

      & > * {
        margin: 0 1rem;
        margin-bottom: 0.75rem;
      }
    }

    &__value {
      flex: 1 1 30%;
    }
  }
`;

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
import {Trash} from 'react-feather';

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
      <h2 style={{textAlign: 'center'}}>Create New Product Type</h2>

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

          try {
            await dispatch<any>(api.productTypes.create(submitValues));
            notify.success(`Successfully created ${submitValues.name}`);
          } catch (error) {
            const message = extractErrorMessage(error);
            notify.error(`Error: ${message}`);
          }
        }}
        validationSchema={AddProductTypeValidationSchema}
      >
        {({values, isSubmitting, isValid}) => (
          <Form className="product-type-form">
            <TextField
              name="name"
              type="text"
              label="Product Type Name"
              placeholder="eg Sneakers"
            />
            <h4>Product Type Options</h4>
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
                            label="Option Name"
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
                                              label="Value"
                                              placeholder="eg 42"
                                            />
                                            <Button
                                              isColor="danger"
                                              onClick={() => remove(valueIndex)}
                                              disabled={valuesArray.length <= 1}
                                            >
                                              <Trash height="1.2rem" />
                                            </Button>
                                          </div>
                                        </div>
                                      )
                                    )}
                                </div>
                                <Button isColor="info" onClick={() => push({value: ''})}>
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
                  <Button
                    style={{width: '100%'}}
                    isColor="info"
                    onClick={() => push({name: '', values: [{value: ''}]})}
                  >
                    Add New Option
                  </Button>
                </>
              )}
            </FieldArray>
            <div>
              <Button
                style={{width: '100%'}}
                isColor="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting || !isValid}
                type="submit"
              >
                Create Product Type
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </AddProductTypeSyled>
  );
}

const AddProductTypeSyled = styled.div`
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
      grid-template-columns: 60% 1fr;
      grid-template-rows: repeat(3, 2.25rem);
      button {
        margin: 0;
        margin-left: 1rem;
        grid-column: 2 / -1;
        grid-row: 2 / span 1;
      }
    }

    &__parent {
      display: flex;
      flex-direction: column;

      & > .button {
        margin 0.5rem 1rem;
        width: 100%;
        align-self: center;
      }
    }

    &__wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      border: 1px dashed var(--color-border-gray);
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

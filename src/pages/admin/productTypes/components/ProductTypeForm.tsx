import {Button} from 'bloomer';
import {FieldArray, Form, Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Trash} from 'react-feather';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import * as Yup from 'yup';
import {TextField} from '../../../../components/input';
import defaultHelpers, {extractErrorMessage} from '../../../../helpers';
import {MIN, REQUIRED} from '../../../../helpers/validationMessages';
import {useApi, useNotify} from '../../../../hooks';

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

export default function ProductTypeForm({formTitle, formAction, ...children}) {
  const {
    formData = {
      name: '',
      options: [
        {
          name: '',
          values: [{value: ''}],
        },
      ],
    },
  } = formAction;

  const api = useApi();
  const dispatch = useDispatch();
  const notify = useNotify();
  const [submitAction, setSubmitAction] = useState('create');

  useEffect(() => {
    const {action} = formAction;
    setSubmitAction(action);
  }, [formAction]);

  return (
    <ProductFormStyled>
      <h2>{formTitle}</h2>

      <div className="product-type-wrapper">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...formData,
          }}
          onSubmit={async (submitValues, {setSubmitting}) => {
            setSubmitting(true);

            try {
              if (submitAction === 'create') {
                await dispatch<any>(api.productTypes.create(submitValues));
                notify.success(`Successfully created ${submitValues.name}`);
              } else if (submitAction === 'view') {
                const diff = defaultHelpers.objectDiffV2(submitValues, formData);
                if(diff){

                  let payload = diff;
                  payload.options = submitValues.options;

                  // fixme: without diffing, this request will result in a lot of
                  //        unnecessary writes on the db.
                  // if (diff.options){
                  //   diff.options.map(option => {
                  //     const optionId = submitValues.options.find(lookup=> option.uuid)
                  //     return {
                  //       ...option,
                  //       values: option.values.filter(value => {
                  //         // remove any empty values
                  //         return !!value
                  //       })
                  //     }
                  //   })
                  // }

                  await api.productTypes.update({uuid: formData.uuid, payload});

                }else {
                  notify.info("No change!")
                }
              }
            } catch (error) {
              const message = extractErrorMessage(error);
              notify.error(`Error: ${message}`);
            }
          }}
          validationSchema={AddProductTypeValidationSchema}
        >
          {({values, isSubmitting, isValid}) => (
            <div className="product-type-form--wrapper">
              <h4>Primary Details</h4>
              <Form className="product-type-form">
                <div className="product-type-form--name">
                  <TextField
                    name="name"
                    type="text"
                    label="Product Type Name"
                    placeholder="eg Sneakers"
                  />
                </div>
                <div className="product-type-form--options">
                  <h4>Product Options</h4>
                  <p className="light">
                    A product type can have one or more multiple options
                  </p>
                  <FieldArray name="options">
                    {({remove, push}) => (
                      <>
                        <div className="option-values">
                          {values.options.length > 0 &&
                            values.options.map((_, index, optionsArray) => (
                              <div key={index} className="option-values__parent">
                                <h4>Option #{index + 1}</h4>
                                <div className="option-values__subheading">
                                  <p>
                                    A product option can have one or multiple values. e.g. Size 8,
                                    Size 9; Color red, Color blue.
                                  </p>
                                  <Button
                                    className="is-tiny"
                                    disabled={optionsArray.length <= 1}
                                    onClick={() => remove(index)}
                                  >
                                    <Trash height="25px" />
                                  </Button>
                                </div>

                                <TextField
                                  className="half-width"
                                  name={`options.${index}.name`}
                                  type="text"
                                  label="Name"
                                  placeholder="eg Size"
                                />
                                <FieldArray name={`options.${index}.values`}>
                                  {({remove, push}) => (
                                    <>
                                      <div className="option-values__wrapper">
                                        {values.options[index].values.length > 0 &&
                                          values.options[index].values.map(
                                            (_, valueIndex, valuesArray) => (
                                              <div
                                                key={valueIndex}
                                                className="option-values__value"
                                              >
                                                <div className="option-values__group">
                                                  <TextField
                                                    name={`options.${index}.values.${valueIndex}.value`}
                                                    type="text"
                                                    label={`Value #${valueIndex + 1}`}
                                                    placeholder="eg 42"
                                                  />
                                                  <Button
                                                    className="is-tiny"
                                                    onClick={() => remove(valueIndex)}
                                                    disabled={valuesArray.length <= 1}
                                                  >
                                                    <Trash height="25px" />
                                                  </Button>
                                                </div>
                                              </div>
                                            )
                                          )}
                                      </div>
                                      <Button
                                        onClick={() => push({value: ''})}
                                      >
                                        Add Value
                                      </Button>
                                    </>
                                  )}
                                </FieldArray>
                              </div>
                            ))}
                        </div>
                        <Button
                          style={{width: '100%'}}
                          onClick={() => push({name: '', values: [{value: ''}]})}
                        >
                          Add New Option
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </div>
                <div
                  className={
                    submitAction === 'view' ? 'product-type-form-submit-delete' : undefined
                  }
                >
                  <Button
                    style={{width: '100%', marginTop: '1rem'}}
                    isColor="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isValid}
                    type="submit"
                    className={submitAction === 'view' ? 'half-width' : undefined}
                  >
                    {submitAction === 'view' ? 'Update' : 'Submit'}
                  </Button>
                  {submitAction === 'view' && (
                    <Button
                      style={{width: '100%', marginTop: '1rem'}}
                      isColor="danger"
                      isOutlined
                      isLoading={isSubmitting}
                      disabled={isSubmitting || !isValid}
                      className={'half-width'}
                      onClick={() => {
                        notify.error('TODO: Admin should be able to delete product type');
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </ProductFormStyled>
  );
}

const ProductFormStyled = styled.div`
  .product-type {
    &-wrapper {
      border: var(--gray-thin-border);
      padding: 2rem;
    }

    &-form {
      &--wrapper {
      }

      &--name {
        border: var(--gray-thin-border);
        padding: 1rem;
      }

      &--options {
        border: var(--gray-thin-border);
        margin-top: 2rem;
        padding: 1rem;
      }

      &-submit-delete {
        display: flex;

        & > * {
          margin: 0 1rem;
        }
      }
    }
  }

  .input-half {
    width: 50%;
  }

  .product-type-name {
    display: flex;
    flex-direction: column;
  }

  .option-values {
    margin: 1rem 0;

    &__subheading {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__group {
      display: grid;
      grid-template-columns: minmax(75%, auto) 1fr;
      grid-template-rows: repeat(3, 2.25rem);
      button {
        margin: 0 auto;
        margin-left: 1rem;
        grid-column: 2 / -1;
        grid-row: 2 / span 1;
      }
    }

    &__parent {
      border: var(--gray-thin-border);
      padding: 1rem;
      margin-bottom: 1rem;

      & > .button {
        width: 100%;
        align-self: center;
      }
    }

    &__wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      border: var(--gray-thin-border);
      padding: 1rem;
      margin: 1rem 0;
    }
  }
`;

import React, {useState} from 'react';
import {Button, Column, Columns} from 'bloomer';
import {FieldArray, Form, Formik} from 'formik';
import '../../../../assets/style/bulma-fx';
import 'react-quill/dist/quill.snow.css';
import CustomModal from '../../../../components/CustomModal';
import CreateVariantComponent from './CreateVariantComponent';
import {useApi, useNotify} from '../../../../hooks';
import useSWR from 'swr/esm/use-swr';
import {ProductTypeType} from '../../../../types';


const CreateVariantModal = (props: {
  onClose: () => void,
  isActive: boolean,
  // required when creating a new variant
  productTypeId?: string;
  productId: string;
}) => {


  const api = useApi();

  const notify = useNotify();

  const allProductTypesFetcher = () => api.productTypes.getAll().then((result) => result.data);
  const {data: allProductTypes} = useSWR<ProductTypeType[]>('/product-type', allProductTypesFetcher);

  return (
    <div>
      <CustomModal
        onClose={() => props.onClose()}
        closeOnClickBackground={true}
        isActive={props.isActive}>
        <div>
          <h2>Create a New Variant</h2>
          <h5>Add a new variant </h5>

          <Formik
            initialValues={{
              variants: [],
              name: '',
              folder: '',
            }}
            onSubmit={async (submitValues, {setSubmitting}) => {

              const variants = submitValues.variants.map((variant: any) => {
                const {options, images, ...rest} = variant;
                return {
                  ...rest,
                  images: images.map(({id, ...rest}) => rest),
                  optionValues: options.map(option => {
                    return {
                      uuid: option.attribute.uuid,
                      value: option.attribute.value,
                    };
                  }),
                  product: {
                    uuid: props.productId,
                  },
                };
              });

              try {
                await api.variants.create({
                  payload: variants,
                });
                notify.success('Created variant successfully');
                props.onClose();
              } catch (e) {
                console.error(e);
                notify.error('Could not create variant due to an error');
              }
            }}
            >
            {({values, setFieldValue, errors, isSubmitting}) => (
              <Form>
                <div>
                  <FieldArray
                    name={'variants'}
                    render={arrayHelpers => (
                      <div>
                        <div>
                          {
                            values.variants?.map((variant, index) => (
                              <div>
                                <CreateVariantComponent
                                  variantIndex={index}
                                  folder={values.folder}
                                  name={variant.name}
                                  onDeleteVariant={(index) => arrayHelpers.remove(index)}
                                  productTypeId={props.productTypeId}
                                  allProductTypes={allProductTypes}
                                  values={values}
                                  setFieldValue={setFieldValue}
                                />
                                </div>
                              ))
                            }
                          </div>

                          <Columns className="mt-2">
                            <Column>
                              <Button
                                onClick={() => arrayHelpers.push({})}
                                style={{width: '100%'}}>
                                Add variant
                              </Button>
                            </Column>
                            <Column>
                              <Button
                                type={'submit'}
                                isColor={'primary'}
                                style={{width: '100%'}}>
                                Create Variant
                              </Button>
                            </Column>
                          </Columns>

                        </div>
                      )}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </CustomModal>
      </div>
    );

};


export default CreateVariantModal;

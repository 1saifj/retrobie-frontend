/**
 * TODO:
 *  - Improve loading, success & error ux
 *  - Get 'add more' working
 */

import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {Button, Column, Columns, Field} from 'bloomer';
import {Form, Formik, useFormikContext} from 'formik';
import TextField from '../../../../components/input/TextField';
import '../../../../assets/style/bulma-fx';
import {v4 as uuidv4} from 'uuid';
import {capitalize, extractErrorMessage, slugify} from '../../../../helpers';
import 'react-quill/dist/quill.snow.css';
import Editor from '../../../../components/editor/Editor';
import ImageUploader from '../../../../components/uploader/ImageUploader';
import {SelectField} from '../../../../components/input';
import {useApi} from '../../../../network';
import {useDispatch} from 'react-redux';
import useSWR from 'swr/esm/use-swr';
import CreatableSelect from 'react-select/creatable';
import {BrandType, CategoryType, ProductTypeType} from '../../../../types';
import {useNotify} from '../../../../hooks';
import CustomModal from '../../../../components/CustomModal';
import styled from 'styled-components';
import CreateProductComponent from './CreateProductComponent';
import {deleteAllImagesForUploaderAction} from '../../../../state/actions';
import humps from '../../../../helpers/humps';


// const MESSAGES = {
//   REQUIRED: 'This field is required.',
//   TOO_SHORT: 'This field is too short.',
//   TOO_LONG: 'This field is too long.',
// };

//todo: add validation to create product page
// const CreateProductValidationSchema = Yup.object().shape({
//   name: Yup.string()
//     .required(MESSAGES.REQUIRED)
//     .min(3, 'This field should be at least 3 characters long'),
//   short: Yup.string()
//     .required(MESSAGES.REQUIRED),
//   long: Yup.string()
//     .required(MESSAGES.REQUIRED),
//   slug: Yup.string()
//     .required(MESSAGES.REQUIRED),
//   folder: Yup.string()
//     .required(MESSAGES.REQUIRED),
//   brand: Yup.string()
//     .required(MESSAGES.REQUIRED),
//   seo: Yup.string()
//     .required(MESSAGES.REQUIRED)
//     .min(80, 'SEO copy should not be less than 80 chars')
//     .max(150, 'SEO copy should not be more than 150 chars'),
//   originalPrice: Yup.number()
//     .required(MESSAGES.REQUIRED),
//   purchasePrice: Yup.number()
//     .min(0, 'Purchase price cannot be less than 0')
//     .required(MESSAGES.REQUIRED),
//   productType: Yup.string()
//     .required(MESSAGES.REQUIRED),
//   inStock: Yup.number()
//     .required(MESSAGES.REQUIRED)
//     .min(0, 'Stock cannot be less than 0'),
//   variants: Yup.array(
//     Yup.object({
//       inStock: Yup.number()
//         .integer()
//         .required("This field is required.")
//     })
//   )
// });

const uuid = uuidv4();

function Monitor() {
  const {values} = useFormikContext<any>();

  useEffect(() => {
    if (values.name) {
      const slug = slugify(values.name, {
        lower: true,
        strict: true,
      });

      if (values.brand) {
        values.folder = `products/${slugify(values.brand.name, {lower: true})}/${slug}/`;
      }

    } else {
      values.folder = '';
    }
  }, [values]);

  return <span />;
}

const CreateProductModal = (props: {
  isActive?: boolean,
  onClose: Function
}) => {
  const api = useApi();
  const dispatch = useDispatch();

  const notify = useNotify();

  const [uploaderId, setUploaderId] = useState(null);

  const allBrandsFetcher = () => api.brands.getAll().then(({data}) => data);
  const {data: allBrands} = useSWR<BrandType[]>('/brands/all', allBrandsFetcher);

  const allProductTypesFetcher = () => api.productTypes.getAll().then(({data}) => data);
  const {data: allProductTypes} = useSWR<ProductTypeType[]>('/product-types', allProductTypesFetcher);

  const allCategoriesFetcher = () => api.category.getAll().then(({data}) => data);
  const {data: allCategories} = useSWR<CategoryType[]>('/categories', allCategoriesFetcher);

  const [allCategoriesState, setAllCategoriesState] = useState([]);

  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    if (allCategories) {
      setAllCategoriesState(allCategories);
    }
  }, [allCategories]);

  const deleteLocallyStoredUploads = ({uploaderId}) => dispatch(deleteAllImagesForUploaderAction({uploaderId}));

  return (
    <div>
      <CustomModal
        closeOnClickBackground={true}
        onClose={() => props.onClose?.()}
        isActive={props.isActive}>
        <CreateProductParent isActive={props.isActive}>
          <h2>Create a new product or variant</h2>
          <Formik
            // validationSchema={CreateProductValidationSchema}
            initialValues={{
              uuid,
              name: '',
              brand: '',
              productTypeId: '',
              images: [],
              folder: '',
              purchasePrice: 0,
              availableOptions: [],
              description: {
                long: '',
                short: '',
                seo: '',
              },
              categories: [],
              variants: [{
                name: '',
                images: [],
                options: [{
                  name: '',
                  uuid: '',
                  attribute: {
                    uuid: '',
                    value: '',
                  },
                }],
              }],
            }}
            onSubmit={async (submitValues, {setSubmitting}) => {

              const values = {
                ...submitValues,
                productType: {
                  uuid: submitValues.productTypeId,
                },
                images: submitValues.images?.map(({id, ...rest}) => ({...rest})),
                description: submitValues.description,
                brands: [
                  submitValues.brand,
                ],
                availableOptions: Object.values( // we only want the values present in the reduced object
                  // the keys are only used to ensure uniqueness
                  submitValues.variants
                    // first flatten the options
                    .flatMap(variant => variant.options)
                    // and map them so that they conform to our API's expectations
                    .reduce((accumulator, currentValue) => {
                      // check if the accumulator object already contains the current option's name
                      if (accumulator[currentValue.name]) {
                        accumulator[currentValue.name].uuid = currentValue.uuid;
                        // if the optionValue doesn't already exist in the accumulator
                        if (
                          !accumulator[currentValue.name]
                            .optionValues
                            .some(item => item.uuid === currentValue.attribute.uuid)
                        ) {
                          accumulator[currentValue.name].optionValues.push(currentValue.attribute);
                        } //  else {
                          //  console.log('Already exists. Not pushing: ', currentValue);
                        //  }
                      } else {
                        accumulator[currentValue.name] = {
                          name: currentValue.name,
                          uuid: currentValue.uuid,
                          optionValues: [currentValue.attribute],
                        };
                      }
                      return accumulator;
                    }, {}),
                ),
                variants: submitValues.variants.map(({options, ...rest}) => ({
                  ...rest,
                  images: rest.images?.map(({id, ...rest}) => rest),
                  optionValues: options.map(option => ({
                    uuid: option.attribute.uuid,
                    value: option.attribute.value,
                  })),
                })),
              };

              // delete values.brand;

              if (!values.images) {
                notify.warning('Please select a few images before proceeding.');
                return;
              }

              setSubmitting(true);

              try {
                await dispatch<any>(api.products.create(values));
                setSubmitting(false);
                // delete the product image
                deleteLocallyStoredUploads({uploaderId});
                // and delete the variant images
                values.variants.forEach(variant => {
                  deleteLocallyStoredUploads({uploaderId: humps.generateUploaderId(variant.name)});
                });
                notify.success('Created product successfully');
              } catch (e) {
                setSubmitting(false);
                const message = extractErrorMessage(e);
                notify.error(message);
              }


            }}
          >
            {({values, isSubmitting, setFieldValue}) => (
              <Form>
                <div className="bordered">
                  <h4>Product images</h4>
                  <ImageUploader
                    allowMultiple={true}
                    id={values.name}
                    folder={values.folder}
                    isSelectDisabled={!values.name}
                    onIdGenerated={({uploaderId, uploadedImages}) => {
                      setUploaderId(uploaderId);
                      setFieldValue('images', uploadedImages);
                    }}
                    onUpload={(err, {uploadedImage}) => {
                      const newImages = values.images?.length ? [...values.images, uploadedImage] : [uploadedImage];
                      setFieldValue('images', newImages);
                    }}
                  />
                </div>

                <div className="bordered">
                  <h4>Basic details</h4>
                  <Field isGrouped style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridGap: '18px',
                  }}>
                    <TextField
                      label={
                        <>
                          What's the <span className="accented">name</span> of this
                          product?
                        </>
                      }
                      placeholder="eg. Air Force 1" type="text"
                      name="name" />

                    <div>
                      <label>
                        What brand is this product assigned to?
                      </label>
                      <Select
                        placeholder="eg. Adidas"
                        options={allBrands?.map(item => ({
                          label: capitalize(item.name),
                          value: {
                            uuid: item.uuid,
                            name: item.name,
                          },
                        }))}
                        onChange={({value}) => setFieldValue('brand', value)}
                        type="text"
                        name="brand" />
                    </div>
                  </Field>
                  <Field>
                    <label>Categories</label>
                    <CreatableSelect
                      isMulti={true}
                      onCreateOption={async (inputValue) => {
                        setCreatingCategory(true);
                        const response = await dispatch<any>(api.category.create({name: inputValue}));
                        if (response.data) {
                          setAllCategoriesState([...allCategoriesState, response.data]);
                        }
                        setCreatingCategory(false);
                      }}
                      isLoading={creatingCategory}
                      placeholder={'eg. Sneakers, Men\'s shoes`'}
                      onChange={selectedCategories => {
                        const mappedCategories = selectedCategories.map(item => ({
                          name: item.label,
                          uuid: item.value,
                        }));
                        setFieldValue('categories', mappedCategories);
                      }}
                      defaultValue={
                        values.categories?.length &&
                        values.categories?.map(item => {
                          return {
                            value: item.uuid,
                            label: item.name,
                          };
                        })
                      }
                      options={allCategoriesState?.map((item: CategoryType) => ({
                        label: item.name,
                        value: item.uuid,
                      }))}
                    />
                  </Field>
                </div>

                <Monitor />
                <div className="bordered">
                  <h4>Product description</h4>
                  <Field>
                    <Editor
                      defaultValue={values.description.long}
                      label={<>Describe this product <span
                        className="accented">in as many or few words</span> as
                        possible.</>}
                      placeholder="Please enter a description"
                      onChange={value => setFieldValue('description.long', value)}
                    />
                    <span id="word-count" />
                  </Field>
                  <Field>
                    <TextField
                      label={<>Describe <span
                        className='accented'>who this product is ideal for</span> in 80
                        chars or
                        less</>}
                      placeholder="Short description"
                      type="textarea"
                      chars={80}
                      name="description.short" />

                  </Field>
                  <Field>
                    <TextField
                      label={<>With suitable keywords, write an <span
                        className="accented">SEO copy</span> for
                        this product in 80 - 150 chars</>}
                      placeholder="Copy"
                      type="textarea"
                      chars={150}
                      name="description.seo" />

                  </Field>
                </div>
                <div style={{marginTop: 12}}>
                  <div className="bordered">
                    <h4>Stock</h4>
                    <Columns>
                      <Column isSize={{desktop: '1/2'}}>
                        <Field>
                          <TextField
                            label={<>
                              What &nbsp;
                              <span className='accented'>
                              price
                              </span> is this product?</>}
                            type="number"
                            placeholder="eg. 4,000"
                            name="originalPrice" />
                        </Field>
                      </Column>
                    </Columns>
                  </div>
                </div>

                <div className="bordered">
                  <h4>Product type</h4>
                  <p>
                    The product type determines what kind of details the
                    variants to be created will contain.
                  </p>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <SelectField
                          isAsync={false}
                          label="What type is this product?"
                          placeholder={'Product Type'}
                          options={allProductTypes?.map(type => {
                            return {
                              value: type.uuid,
                              label: capitalize(type.name),
                            };
                          })}
                          onChange={({value}) => {
                            setFieldValue('productTypeId', value);
                            // push an empty variant to the list to have it render immediately
                            // a product type is selected
                            setFieldValue('variants', [{}]);
                          }}
                        />
                      </Field>
                    </Column>
                  </Columns>
                </div>
                {
                  values.productTypeId && (
                    <CreateProductComponent
                      allProductTypes={allProductTypes}
                      setFieldValue={setFieldValue}
                      values={values} />
                  )
                }
                <div style={{marginTop: 24}}>
                  <Button
                    isLoading={isSubmitting}
                    style={{width: '100%'}}
                    isColor="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CreateProductParent>
      </CustomModal>


    </div>
  );
};

const CreateProductParent = styled.div<{isActive: boolean}>`
  background: white;
  display: ${props => props.isActive ? 'block' : 'none'};
  border-radius: 4px;
  
  .bordered {
    border: 1px solid lightgrey;
    border-radius: 4px;
    padding: 8px 12px;
    transition: all 0.25s ease-in-out;
    margin-top: 12px;
  }
  
  // nested bordered
  .bordered .bordered {
    margin: 12px 12px;
    
    &.small {
      margin: 0;
    }
  }
  
  .product-types {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      gap: 24px;
  }
  
  .product-type {
    margin-bottom: 24px;
    margin-left: 12px;
    margin-right: 12px;
  }
  
  .option {
      display: flex;
      gap: 4px;
  }
  
  .option-value {
    flex: 1 1 80px;
    
    &.active {
      border-color:#444444;
    }
    
    &:hover {
      cursor: pointer;
      border-color: #444444;;
    }
  }
`;

export default CreateProductModal;

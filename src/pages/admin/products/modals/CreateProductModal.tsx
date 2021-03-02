/**
 * TODO:
 *  - Improve loading, success & error ux
 *  - Get 'add more' working
 */

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {Button, Column, Columns, Field, Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import {Form, Formik, useFormikContext} from 'formik';
import TextField from '../../../../components/input/TextField';
import '../../../../assets/style/bulma-fx';
import {v4 as uuidv4} from 'uuid';
import {capitalize, cleanString, extractErrorMessage, slugify} from '../../../../helpers';
import 'react-quill/dist/quill.snow.css';
import Editor from '../../brands/Editor';
import CustomImageUploader from '../../../../components/upload/CustomImageUploader';
import * as Yup from 'yup';
import SelectField from '../../../../components/input/SelectField';
import {useAuth} from '../../../../network';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import useSWR from 'swr/esm/use-swr';
import CreatableSelect from 'react-select/creatable';
import {BrandType, CategoryType} from '../../../../types';
import {MetaState} from '../../../../state/reducers/metaReducers';
import {deleteUploadedImageAction} from '../../../../state/actions';
import {useNotify} from '../../../../hooks';


const conditions = [
    {
        label: 'New',
        value: 'new',
    },
    {
        label: 'Refurbished',
        value: 'refurbished',
    },
    {
        label: 'Slightly Worn',
        value: 'worn',
    },
];


const MESSAGES ={
    REQUIRED: "This field is required.",
    TOO_SHORT: "This field is too short.",
    TOO_LONG: "This field is too long."
}

const CreateProductValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required(MESSAGES.REQUIRED)
    .min(3, 'This field should be at least 3 characters long'),
  short: Yup.string()
    .required(MESSAGES.REQUIRED),
  long: Yup.string()
    .required(MESSAGES.REQUIRED),
  slug: Yup.string()
    .required(MESSAGES.REQUIRED),
  folder: Yup.string()
    .required(MESSAGES.REQUIRED),
  brand: Yup.string()
    .required(MESSAGES.REQUIRED),
  copy: Yup.string()
    .required(MESSAGES.REQUIRED)
    .min(80, 'SEO copy should not be less than 80 chars')
    .max(150, 'SEO copy should not be more than 150 chars'),
  price: Yup.number()
    .required(MESSAGES.REQUIRED),
  purchasePrice: Yup.number()
    .min(0, 'Purchase price cannot be less than 0')
    .required(MESSAGES.REQUIRED),
  productType: Yup.string()
    .required(MESSAGES.REQUIRED)
    .oneOf(['sneaker']),
  sex: Yup.string()
    .required(MESSAGES.REQUIRED)
    .oneOf(['M', 'F', 'U']),
  condition: Yup.string()
    .required(MESSAGES.REQUIRED)
    .oneOf(['new', 'refurbished', 'worn']),
  size: Yup.number()
    .when('productType', {is: 'sneaker', then: Yup.number().required(MESSAGES.REQUIRED)}),
  sizeCountry: Yup.string()
    .when('productType', {is: 'sneaker', then: Yup.string().required(MESSAGES.REQUIRED)}),
  inStock: Yup.number()
    .required(MESSAGES.REQUIRED)
    .min(0, 'Stock cannot be less than 0'),
  uuid: Yup.string()
    .required(MESSAGES.REQUIRED),
});

const uuid = uuidv4();

function Monitor({brand}) {
  const {values} = useFormikContext<any>();

  useEffect(() => {
    if (values.name) {
      values.slug = slugify(values.name, {
        lower: true,
        strict: true,
      });
      if (brand && brand.name) {
        values.brand = brand.name;
        values.folder = `products/${slugify(values.brand, {lower: true})}}/${values.slug}`;
      }

      if (values.brand && values.slug) {
        values.folder = `products/${slugify(values.brand, {lower: true})}/${values.slug}/`;
      }

    } else {
      values.slug = '';
      values.folder = '';
    }
  }, [values, brand]);

  return <span />;
}

const CreateProductModal = props => {
  const api = useAuth();
  const dispatch = useDispatch();
  const thisBrand = props.brand;

  const notify = useNotify();

  const [uploaderId, setUploaderId] = useState(null);

  const metaState: MetaState = useSelector((state: RootStateOrAny) => state.meta);

  const uploadedImages = metaState.components.imageUploader[uploaderId];

    const allBrandsFetcher = () => api.brands.getAll().then(({data}) => data);
    const {data: allBrands} = useSWR<BrandType[]>('/brands/all', allBrandsFetcher);

    const allCategoriesFetcher = () => api.category.getAll().then(({data}) => data);
    const {data: allCategories} = useSWR<CategoryType[]>('/categories', allCategoriesFetcher);

    const [allCategoriesState, setAllCategoriesState] = useState([])

    const [creatingCategory, setCreatingCategory] = useState(false)

    useEffect(()=> {
      if (allCategories){
        setAllCategoriesState(allCategories)
      }
    }, [allCategories])

  return (
    <div>
      <Modal isActive={props.isActive} className={'modal-fx-fadeInScale'}>
        <ModalBackground onClick={() => props.onClose()} />
        <ModalContent>
          <div
            style={{
              background: 'white',
              display: props.isActive ? 'block' : 'none',
              padding: '24px',
              borderRadius: '4px',
            }}>
            <h2>Create a new product or variant</h2>
            <Formik
              initialValues={{
                uuid,
                name: '',
                slug: '',
                brand: '',
                productType: 'sneaker',
                images: [],
                style: '',
                sex: '',
                folder: '',
                condition: '',
                primaryColor: '',
                secondaryColor: '',
                purchasePrice: 0,
                long: '',
                categories: [],
              }}
              validationSchema={CreateProductValidationSchema}
              onSubmit={async (submitValues, {setSubmitting}) => {

                const values = {
                  ...submitValues,
                  admin: {
                    purchasePrice: submitValues.purchasePrice,
                  },
                };

                setSubmitting(true);
                values.images = uploadedImages;

                if (!uploadedImages){
                  notify.warning("Please select a few images before proceeding.")
                  return;
                }

                const {data, ...rest} = await dispatch<any>(api.products.create(values));

                if (data) {
                  setSubmitting(false);
                  dispatch(deleteUploadedImageAction({uploaderId}))
                  notify.success(data.message);
                } else {
                  setSubmitting(false);
                  const message = extractErrorMessage(rest);
                  notify.error(message);
                }

              }}
            >
              {({values, isSubmitting, errors, setFieldValue}) => (
                <Form>
                  <div>
                    <h4>Product images</h4>
                    <CustomImageUploader
                      allowMultiple={true}
                      id={`create-product-uploader`}
                      folder={values.folder}
                      instantUpload={false}
                      isSelectDisabled={!values.brand || !values.name}
                      onUpload={(err, {uploaderId}) => {
                        setUploaderId(uploaderId);
                      }}
                      onClickSelectedImage={(images) => {
                        props.onClickSelectedImage(images);
                      }}
                    />
                  </div>

                  <h4>Basic details</h4>
                  <Field isGrouped style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridGap: '18px',
                  }}>
                    <TextField
                      label={<>What's the <span className="accented">name</span> of this
                        product?</>}
                      placeholder="eg. Air Force 1" type="text"
                      name="name" />
                    <TextField
                      label={<>Specify a <span className="accented">slug</span> to be used for
                        this product.</>}
                      placeholder="eg. air-force-1"
                      type="text"
                      name="slug" />
                  </Field>
                  <Field
                    isGrouped style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridGap: '18px',
                  }}>
                    <div>
                      <label>
                        What brand is this product assigned to?
                      </label>
                      <Select
                        placeholder="eg. Adidas"
                        options={allBrands?.map(item => ({
                          label: capitalize(item.name),
                          value: item.name,
                        }))}
                        onChange={({value})=> setFieldValue('brand', value)}
                        disabled={!!thisBrand}
                        type="text"
                        name="brand" />
                    </div>

                    <TextField label={<>Which <span className="accented">folder </span>
                      will the images be saved in?</>}
                               placeholder="eg. /adidas/adidas-nmd"
                               disabled
                               type="text"
                               name="folder" />
                  </Field>

                  <Monitor brand={thisBrand} />
                  <h4>Product description</h4>
                  <Field>
                    <Editor
                      defaultValue={values.long}
                      label={<>Describe this product <span
                        className="accented">in as many or few words</span> as
                        possible.</>}
                      placeholder="Please enter a description"
                      onChange={value => setFieldValue('long', value)}
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
                      name="short" />

                  </Field>
                  <Field>
                    <TextField
                      label={<>With suitable keywords, write an <span
                        className="accented">SEO copy</span> for
                        this product in 80 - 150 chars</>}
                      placeholder="Copy"
                      type="textarea"
                      chars={150}
                      name="copy" />

                  </Field>
                  <h4>Stock</h4>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <TextField
                          label={<>
                            <span className='accented'>How many products</span> are in stock?</>}
                          type="number"
                          placeholder="eg. 10"
                          name="inStock" />
                      </Field>

                    </Column>
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
                          name="price" />
                      </Field>
                    </Column>
                  </Columns>
                  <h4>Admin details</h4>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <TextField
                          label={<>
                            What was the &nbsp;
                            <span className='accented'>purchase price</span> &nbsp;
                            of this product?</>}
                          type="number"
                          placeholder="eg. 10"
                          name="purchasePrice" />
                      </Field>

                    </Column>
                  </Columns>
                  <h4>Product Details</h4>
                  <Field>
                    <TextField
                      disabled
                      label={
                        <>
                          Don't worry. This is filled&nbsp;
                          <span className='accented'>automatically</span>.
                        </>
                      }
                      placeholder={'uuid'}
                      type="text"
                      name="uuid" />

                  </Field>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <SelectField
                          label={
                            <>What <span
                              className='accented'> type of product </span>
                              is this product?
                            </>}
                          placeholder={'Product Type'}
                          type="text"
                          options={[
                            {
                              value: 'sneaker',
                              label: 'Sneaker',
                            },
                          ]}
                          name="productType" />

                      </Field>

                    </Column>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <TextField
                          label={
                            <>What <span
                              className='accented'>size </span>
                              is this product?
                            </>
                          }
                          placeholder={'eg. 44'}
                          type="number"
                          name="size" />

                      </Field>

                    </Column>
                  </Columns>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <label>
                        Is this product better suited
                        for men or women?
                      </label>
                      <Select
                        defaultValue={{
                          value: 'M',
                        }}
                        value={
                          values.sex && {
                            label: values.sex === 'M' ? 'Men' : 'Women',
                            value: values.sex,
                          }
                        }
                        options={[
                          {
                            value: 'M',
                            label: 'Men',
                          },
                          {
                            value: 'F',
                            label: 'Women',
                          },
                        ]}
                        placeholder={'eg. Men or Women'}
                        onChange={({value}) => setFieldValue('sex', value)}
                      />
                    </Column>

                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <label>
                          <>What <span className='accented'> &nbsp;
                            country's measurement system &nbsp;
                            </span> best suits this product?
                          </>
                        </label>
                        <SelectField
                          name={'sizeCountry'}
                          options={[
                            {
                              value: 'uk',
                              label: 'UK',
                            },
                            {
                              value: 'us',
                              label: 'US',
                            },
                          ]}
                          placeholder={'eg. UK'}
                        />


                      </Field>

                    </Column>
                  </Columns>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <label>
                          What &nbsp;
                          <span className={'accented'}>color</span>
                          &nbsp;
                          is this product
                        </label>
                        <div>
                          <div style={{
                            background: values.primaryColor || '#000',
                            width: 60,
                            height: 60,
                            marginBottom: 4,
                            borderRadius: 4,
                          }} />
                          <input type={'color'}
                                 onChange={(e) => {
                                   setFieldValue('primaryColor', e.target.value);
                                 }}
                          />
                          <small>
                            {errors.primaryColor}
                          </small>
                        </div>

                      </Field>

                    </Column>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <label>
                          <>What <span className='accented'>
                                                            secondary color
                                                        </span> is this product?
                          </>
                        </label>
                        <div style={{
                          background: values.secondaryColor || '#000',
                          width: 60,
                          height: 60,
                          marginBottom: 4,
                          borderRadius: 4,
                        }} />
                        <input type={'color'}
                               onChange={(e) => {
                                 setFieldValue('secondaryColor', e.target.value);
                               }}
                        />

                        <small>
                          {errors.secondaryColor}
                        </small>

                      </Field>


                    </Column>
                  </Columns>

                  <div>
                    <div>
                      <h4>Misc</h4>
                      <Columns>
                        <Column isSize={{desktop: '1/2'}}>
                          <div>
                            <label>This product's current condition</label>
                            <Select
                              defaultValue={
                                values.condition && {
                                  label: capitalize(values.condition),
                                  value: values.condition,
                                }
                              }
                              placeholder="eg. New or Refurbished"
                              options={conditions}
                              onChange={({value}) => setFieldValue('condition', value)}
                            />
                          </div>
                        </Column>
                        <Column isSize={{desktop: '1/2'}}>
                          <label>Shoe style</label>
                          <Select
                            placeholder={'eg. Low Cut or High Cut'}
                            defaultValue={
                              values.style && {
                                label: capitalize(values.style),
                                value: values.style,
                              }
                            }
                            options={[
                              {
                                label: 'High-cut',
                                value: 'high-cut',
                              },
                              {
                                label: 'Mid-cut',
                                value: 'mid-cut',
                              },
                              {
                                label: 'Low-cut',
                                value: 'low-cut',
                              },
                            ]}
                            onChange={style => setFieldValue('style', style.value)}
                          />
                        </Column>
                      </Columns>
                      <Columns>
                        <Column isSize={{desktop: '1/2'}}>
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
                                  slug: item.value,
                                }));
                                setFieldValue('categories', mappedCategories);
                              }}
                              defaultValue={
                                values.categories?.length &&
                                values.categories?.map(item => {
                                  return {
                                    value: cleanString(item.name, '-'),
                                    label: item.name,
                                  };
                                })
                              }
                              options={allCategoriesState?.map((item: CategoryType) => ({
                                label: item.name,
                                value: item.slug,
                              }))}
                            />
                          </Field>
                        </Column>

                      </Columns>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginTop: 24,
                  }}>
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
          </div>
        </ModalContent>
        <ModalClose onClick={() => props.onClose()} />
      </Modal>
    </div>
  );
};

CreateProductModal.propTypes = {
    isActive: PropTypes.bool,
    onCreate: PropTypes.func,
    onError: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    brand: PropTypes.object,
    onClickSelectedImage: PropTypes.func
};

export default CreateProductModal;

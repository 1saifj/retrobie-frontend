/**
 * TODO:
 *  - Improve loading, success & error ux
 *  - Get 'add more' working
 */

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Column, Columns, Field, Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import {Form, Formik, useFormikContext} from 'formik';
import TextField from '../../../../components/input/TextField';
import '../../../../assets/style/bulma-fx';
import {v4 as uuidv4} from 'uuid';
import {capitalize, extractErrorMessage, slugify} from '../../../../helpers';
import 'react-quill/dist/quill.snow.css';
import Editor from '../../brands/Editor';
import CustomImageUploader from '../../../../components/upload/CustomImageUploader';
import * as Yup from 'yup';
import SelectField from '../../../../components/input/SelectField';
import {notify} from '../../../../helpers/views';
import {useAuth} from '../../../../network';
import {useDispatch} from 'react-redux';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const MESSAGES ={
    REQUIRED: "This field is required.",
    TOO_SHORT: "This field is too short.",
    TOO_LONG: "This field is too long."
}

const CreateProductValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required(MESSAGES.REQUIRED)
        .min(3, "This field should be at least 3 characters long"),
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
        .min(80, "SEO copy should not be less than 80 chars")
        .max(120, "SEO copy should not be more than 120 chars"),
    price: Yup.number()
        .required(MESSAGES.REQUIRED),
    productType: Yup.string()
        .required(MESSAGES.REQUIRED)
        .oneOf(['sneaker']),
    sex: Yup.string()
        .required(MESSAGES.REQUIRED)
        .oneOf(["M", "F"]),
    size: Yup.number()
        .when("productType", { is: "sneaker", then: Yup.number().required(MESSAGES.REQUIRED) }),
    sizeCountry: Yup.string()
        .when("productType", { is: "sneaker", then: Yup.string().required(MESSAGES.REQUIRED) }),
    stock: Yup.number()
        .required(MESSAGES.REQUIRED)
        .moreThan(0, "Stock cannot be 0"),
    uuid: Yup.string()
        .required(MESSAGES.REQUIRED)
})

const uuid = uuidv4();

function Monitor({ brand }) {
    const { values } = useFormikContext();

    useEffect(() => {
        if (values.name) {
            values.slug = slugify(values.name).toLowerCase();
            if (brand && brand.name) {
                values.brand = brand.name;
                values.folder = `${brand.name}/${values.slug}`;
            }

            if (values.brand && values.slug) {
                values.folder = `${values.brand.toLowerCase()}/${values.slug}/`;
            }

        } else {
            values.slug = "";
            values.folder = "";
        }
    }, [values, brand]);

    return <span />
}

const CreateProductModal = props => {
    const api = useAuth();
    const dispatch = useDispatch();
    const thisBrand = props.brand;

    const [allBrandsResponse, setAllBrandsResponse] = useState();

    useEffect(()=> {
        dispatch(api.brands.getAll())
          .then((response)=> {
              setAllBrandsResponse(response);
          })
    }, [])

    return (
      <>
          <div>
              <Modal isActive={props.isActive} className={'modal-fx-fadeInScale'}>
                  <ModalBackground onClick={() => props.onClose()}/>
                  <ModalContent>
                      <div style={{
                          background: 'white',
                          display: props.isActive ? 'block' : 'none',
                          padding: '24px',
                          borderRadius: '4px',
                      }}>
                          <h2>Create a new product or variant</h2>
                          <Formik
                            initialValues={{
                                uuid,
                                productType: 'sneaker',
                            }}
                            validationSchema={CreateProductValidationSchema}
                            onSubmit={async (values, {setSubmitting}) => {

                                setSubmitting(true);
                                const uploaderId = `custom_uploader`;
                                values.images = JSON.parse(localStorage.getItem(uploaderId));

                                const {data, ...rest} = await dispatch(api.products.create(values));

                                if (data) {
                                    setSubmitting(false);
                                    localStorage.removeItem(uploaderId);
                                    notify('success', data.message);
                                } else {
                                    setSubmitting(false);
                                    const message = extractErrorMessage(rest);
                                    notify('error', message);
                                }

                            }}
                          >
                              {({values, isSubmitting, errors, setFieldValue}) => (
                                <Form>
                                    <div style={{
                                        display: 'grid',
                                        justifyItems: 'center',
                                    }}>
                                    </div>
                                    <div>
                                        <h4>Product images</h4>
                                        <CustomImageUploader
                                          allowMultiple={true}
                                          // same as uploaderId
                                          name={'create_product'}
                                          instantUpload={false}
                                          onUpload={async (err, currentUpload, allUploads)=> {

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
                                          name="name"/>
                                        <TextField
                                          label={<>Specify a <span className="accented">slug</span> to be used for
                                              this product.</>}
                                          placeholder="eg. air-force-1"
                                          type="text"
                                          name="slug"/>
                                    </Field>
                                    <Field isGrouped style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gridGap: '18px',
                                    }}>
                                        <SelectField
                                          label={<>What <span
                                            className="accented">brand</span> is this product assigned to?</>}
                                          placeholder="eg. Adidas"
                                          options={allBrandsResponse?.data?.map(item => ({
                                              label: capitalize(item.name),
                                              value: item.name,
                                          }))}
                                          disabled={!!thisBrand}
                                          type="text"
                                          name="brand"/>

                                        <TextField label={<>Which <span className="accented">folder </span>
                                            will the images be saved in?</>}
                                                   placeholder="eg. /adidas/adidas-nmd"
                                                   disabled
                                                   type="text"
                                                   name="folder"/>
                                    </Field>

                                    <Monitor brand={thisBrand}/>
                                    <h4>Product description</h4>
                                    <Field>
                                        <Editor defaultValue={values.long}
                                                label={<>Describe this product <span className="accented">in as many or few words</span> as
                                                    possible.</>}
                                                placeholder="Please enter a description"
                                                onChange={value => setFieldValue('long', value)}
                                        />
                                        <span id="word-count"/>
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
                                          name="short"/>

                                    </Field>
                                    <Field>
                                        <TextField
                                          label={<>With suitable keywords, write an <span
                                            className="accented">SEO copy</span> for
                                              this product in 80 - 120 chars</>}
                                          placeholder="Copy"
                                          type="textarea"
                                          chars={120}
                                          name="copy"/>

                                    </Field>
                                    <h4>Stock</h4>
                                    <Columns>
                                        <Column isSize={{desktop: '1/2'}}>
                                            <Field>
                                                <TextField
                                                  label={<>
                                                      <span className='accented'>How many products</span> of this
                                                      brand are available?</>}
                                                  type="number"
                                                  placeholder="eg. 10"
                                                  name="stock"/>
                                            </Field>

                                        </Column>
                                        <Column isSize={{desktop: '1/2'}}>
                                            <Field style={{marginTop: 27}}>
                                                <TextField
                                                  label={<>
                                                      What &nbsp;
                                                      <span className='accented'>
                                                                price
                                                            </span> is this product?</>}
                                                  type="number"
                                                  placeholder="eg. 4,000"
                                                  name="price"/>
                                            </Field>
                                        </Column>
                                    </Columns>
                                    <h4>Product Details</h4>
                                    <Field>
                                        <TextField disabled
                                                   label={<>Don't worry. This is filled <span
                                                     className='accented'>automatically</span>.</>}
                                                   placeholder={'uuid'}
                                                   type="text"
                                                   name="uuid"/>

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
                                                  name="productType"/>

                                            </Field>

                                        </Column>
                                        <Column isSize={{desktop: '1/2'}}>
                                            <Field>
                                                <TextField label={
                                                    <>What <span
                                                      className='accented'>size </span>
                                                        is this product?
                                                    </>
                                                }
                                                           placeholder={'eg. 44'}
                                                           type="number"
                                                           name="size"/>

                                            </Field>

                                        </Column>
                                    </Columns>
                                    <Columns>
                                        <Column>
                                            <Field>
                                                <label style={{display: 'inline-block', marginBottom: 6}}>
                                                    <>Is this shoes better suited for <span
                                                      className='accented'>men or women</span>?
                                                    </>
                                                </label>
                                                <SelectField
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
                                                  className={'react-select'}
                                                  name={'sex'}
                                                  placeholder={'eg. Men'}
                                                />
                                            </Field>

                                        </Column>
                                        <Column isSize={{desktop: '1/2'}}>
                                            <Field>
                                                <label>
                                                    <>What <span className='accented'>
                                                            country's measurement system
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
                                                    }}/>
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
                                                }}/>
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
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                    }}>
                                        <Button style={{width: '100%'}}
                                                isColor="primary"
                                                type="submit"
                                        >
                                            Submit
                                        </Button>
                                        <div style={{margin: '8px 12px', display: 'flex'}}>
                                            <Checkbox style={{marginRight: '8px'}}/>
                                            <label>Add more</label>
                                        </div>
                                    </div>
                                </Form>
                              )}
                          </Formik>
                      </div>
                  </ModalContent>
                  <ModalClose onClick={() => props.onClose()}/>
              </Modal>
          </div>
      </>
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

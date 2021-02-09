import React, {useEffect, useState} from 'react';
import {axis, useAuth} from '../../../network';
import Loading from '../../../components/loading';
import styled from 'styled-components';
import {notify} from '../../../helpers/views';
import {Button, Column, Columns, Field} from 'bloomer';
import {Form, Formik} from 'formik';
import TextField from '../../../components/input/TextField';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import OnOffSwitch from '../../../components/OnOffSwitch';
import Editor from '../brands/Editor';
import CustomImageUploader from '../../../components/upload/CustomImageUploader';
import SelectedImageModal from '../brands/modals/SelectedImageModal';
import * as Yup from 'yup';
import defaultHelpers, {
  capitalize,
  cleanString,
  extractErrorMessage,
} from '../../../helpers';
import {useDispatch} from 'react-redux';
import useSWR from 'swr/esm/use-swr';

const UpdateProductValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  slug: Yup.string().required(),
  uuid: Yup.string().required(),
  short: Yup.string().required(),
  long: Yup.string().required(),
  seo: Yup.string().required(),
  size: Yup.number().required(),
  sizeCountry: Yup.string()
    .oneOf(['UK', 'US', "CHN"])
    .required(),
  sex: Yup.string()
    .oneOf(['M', 'F'])
    .required(),
  adminStock: Yup.number().required(),
  usersStock: Yup.number().required(),
  brand: Yup.string().required(),
  currency: Yup.string().required(),
  originalPrice: Yup.number().required(),
  // idealFor: Yup.string().optional(),
  style: Yup.string().required(),
  condition: Yup.string().required(),
  // endorsedBy: Yup.string().optional(),
  // sportsType: Yup.string().optional(),
});

export default function SingleProduct(props) {
  const api = useAuth();
  const dispatch = useDispatch();
  const [showImageModal, setImageModalShown] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const productSlug = props.match.params.slug;

  const componentName = `custom_uploader_${productSlug}`;

  const singleProductFetcher = (key, id) => api.products.get(id).then(({data}) => ({
      name: data.name,
      slug: data.slug,
      uuid: data.uuid,
      short: data.description.short,
      long: data.description.long,
      seo: data.description.seo,
      size: data.detail.size,
      sizeCountry: data.detail.sizeCountry,
      sex: data.detail.sex,
      inStock: data.inStock,
      brand: capitalize(data.brands[0].name),
      images: data.images,
      currency: 'Ksh.',
      categories: data.categories,
      originalPrice: data.originalPrice,
      productType: data.productType,
      isOnOffer: data.isOnOffer,
      idealFor: data.meta.idealFor,
      style: data.meta.style,
      condition: data.meta.condition,
      endorsedBy: data.meta.endorsedBy,
      sportsType: data.meta.sportsType,
    }
  ));
  const {data: thisProductData} = useSWR([`/product/${productSlug}`, productSlug], singleProductFetcher);

  if (!thisProductData) {
    return (
      <Loading message={'Please wait a while...'} />
    )
  }


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

  function deleteProduct(id) {
    if (!id) {
      return;
    }
    axis
      .delete(`/products/single/${id}`)
      .then(response => {
        notify('success', response.data.message);
      })
      .catch(err => {
        notify('error', "That didn't work out");
      });
  }

  function deleteImage(image) {
    let {file_id} = image;
    axis
      .delete(`/products/single/images/${file_id}`)
      .then(response => {
        notify('success', response.data.message);
      })
      .catch(err => {
        notify('error', 'Whoa there, tiger! Not so fast.');
      });
  }

  return (
    <div>
      <div>
        <Formik
          validationSchema={UpdateProductValidationSchema}
          initialValues={{
            ...thisProductData,
            sizeCountry: "UK",
            brand: capitalize(thisProductData.brand),
          }}
          onSubmit={async (values, {setFieldValue}) => {
            //fixme
            setFieldValue('images', thisProductData.images)
            // When updating a product, we only want to send details that have changed
            // And ignore the rest
            // Note: arrays always show up
            let diff = defaultHelpers.objectDiff(thisProductData, values);
            // Any new images?
            let noNewImages = defaultHelpers.arraysEqual(thisProductData.images, values.images);
            // Any new categories?
            let noNewCategories = defaultHelpers.arraysEqual(
              thisProductData.categories,
              values.categories
            );

            // Delete them from the object if they don't exist
            if (noNewImages) {
              delete diff.images;
            }

            if (noNewCategories) {
              delete diff.categories;
            }

            if (!Object.keys(diff).length) {
              notify('info', 'Nothing changed');
              return;
            }

            try {
              // @ts-ignore
              const {data} = await dispatch(api.products.update(productId, diff));
              // Delete the now uploaded images
              localStorage.removeItem(componentName);
              notify('success', data.message);
            } catch (e) {
              console.error(e);
              const message = extractErrorMessage(e);
              notify('error', 'An error occurred.', message);
            }
          }}
        >
          {({setFieldValue, submitForm, values}) => (
            <Form>
              <FormItemsParent>
                <h3>Main Details</h3>
                <div>
                  <CustomImageUploader
                    allowMultiple={true}
                    id={productSlug}
                    folder={thisProductData.brand}
                    initialImages={values.images}
                    onClickSelectedImage={images => {
                      setImageModalShown(!showImageModal);
                      setSelectedImages(images);
                    }}
                    onInit={images => setFieldValue('images', images)}
                    onUpload={(err, all) => {
                      if (err) {
                        notify('error', 'Failed to upload one or more of your images');
                        return;
                      }
                      setFieldValue('images', all);
                    }}
                  />
                  <SelectedImageModal
                    showModal={showImageModal}
                    onClose={() => setImageModalShown(false)}
                    images={selectedImages}
                  />
                </div>
                <div>
                  <h4>Primary Details</h4>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <TextField
                          type={'text'}
                          label={"This product's name "}
                          placeholder={'Name'}
                          name="name"
                        />
                      </Field>
                    </Column>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <TextField
                          placeholder={'eg. Nike'}
                          type={'text'}
                          label={"This product's brand name"}
                          name={'brand'}
                        />
                      </Field>
                    </Column>
                  </Columns>
                </div>
                <div>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <TextField
                          prefix={`https://retrobie.com/products/${values.brand}/`}
                          disabled={true}
                          type={'text'}
                          label={"This product's slug"}
                          placeholder={'eg. adidas-superstar'}
                          name="slug"
                        />
                      </Field>
                    </Column>
                  </Columns>
                </div>
                <Columns>
                  <Column isSize={{desktop: '1/2'}}>
                    <Field>
                      <label>Product type</label>
                      <Select
                        defaultValue={
                          values.productType && {
                            value: values.productType,
                            label: capitalize(values.productType),
                          }
                        }
                        placeholder={'eg. Sneaker'}
                        onChange={({value}) => setFieldValue('productType', value)}
                        options={[
                          {
                            value: 'sneaker',
                            label: 'Sneaker',
                          },
                        ]}
                      />
                    </Field>
                  </Column>
                  <Column isSize={{desktop: '1/2'}}>
                    <Field>
                      <label>Categories</label>
                      <CreatableSelect
                        isMulti={true}
                        placeholder={"eg. Sneakers, Men's shoes`"}
                        onChange={values => {
                          const categories = values.map(item => ({name: item.label}));
                          setFieldValue('categories', categories);
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
                        options={[
                          {
                            value: 'sneakers',
                            label: 'Sneakers',
                          },
                          {
                            value: 'mens-shoes',
                            label: "Men's shoes",
                          },
                          {
                            value: 'womens-shoes',
                            label: "Women's shoes",
                          },
                          {
                            value: 'popular',
                            label: 'Popular shoes',
                          },
                        ]}
                      />
                    </Field>
                  </Column>
                </Columns>
                <div>
                  <TextField
                    label={'Short description'}
                    placeholder={'Short Description'}
                    type={'text'}
                    name={'short'}
                  />
                  <TextField
                    placeholder={'seo'}
                    type={'textarea'}
                    rows={5}
                    name={'seo'}
                    label={'seo'}
                    componentClass="textarea"
                  />
                  <Editor
                    defaultValue={thisProductData.long}
                    onChange={value => setFieldValue('long', value)}
                    label={'Long description'}
                    placeholder={'Long description'}
                  />
                </div>
                <div>
                  <h4>Price</h4>
                  <Columns>
                    <Column isSize={{desktop: '1/2'}}>
                      <TextField
                        type={'text'}
                        placeholder={'Currency'}
                        name={'currency'}
                        label={'Currency'}
                        disabled
                      />
                    </Column>
                    <Column isSize={{desktop: '1/2'}}>
                      <TextField
                        placeholder={'eg. 5000'}
                        type={'number'}
                        label={'The current price of this product'}
                        name={'originalPrice'}
                      />
                    </Column>
                  </Columns>
                </div>
                <div style={{marginTop: 12}}>
                  <h4>Stock</h4>
                  <div>
                    <Columns>
                      <Column isSize={{desktop: '1/2'}}>
                        <TextField
                          label={'Users stock count'}
                          placeholder={'eg. 25'}
                          type={'number'}
                          name={'usersStock'}
                        />
                      </Column>
                      <Column isSize={{desktop: '1/2'}}>
                        <TextField
                          label={'Admin stock count'}
                          placeholder={'eg. 30'}
                          type={'number'}
                          name={'adminStock'}
                        />
                      </Column>
                    </Columns>
                    <div>
                      <Columns>
                        <Column isSize={{desktop: '1/2'}}>
                          <div>
                            <OnOffSwitch
                              label={'Is this product on offer?'}
                              onText={''}
                              offText={''}
                              onChange={value => {
                                setFieldValue('isOnOffer', value);
                              }}
                            />
                          </div>
                        </Column>
                        <Column isSize={{desktop: '1/2'}}>
                          <TextField
                            disabled={!values.isOnOffer}
                            placeholder={'Sale Price'}
                            name={'salePrice'}
                            type={'number'}
                            label={'Sale Price'}
                          />
                        </Column>
                      </Columns>
                    </div>
                  </div>
                </div>
                <div style={{marginTop: 24}}>
                  <div>
                    <h4>Misc</h4>
                    <div>
                      <Columns>
                        <Column isSize={{desktop: '1/2'}}>
                          <TextField
                            placeholder={'Size'}
                            type={'number'}
                            label={'Size'}
                            name={'size'}
                          />
                        </Column>
                        <Column isSize={{desktop: '1/2'}}>
                          <label>Are these shoes better suited for men or women?</label>
                          <Select
                            defaultValue={{
                              value: 'M'
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
                      </Columns>
                    </div>
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
                  </div>
                </div>
                {/*
                  <div>
                    <div style={{marginTop: 12}}>
                      <h4>Type</h4>
                    </div>
                    <Columns>
                      <Column isSize={{desktop: '1/2'}}>
                        <TextField
                          placeholder={'eg. sports, clubbing, casual wear'}
                          type={'text'}
                          label={'What are these shoes ideal for?'}
                          name={'idealFor'}
                        />
                      </Column>
                      <Column isSize={{desktop: '1/2'}}>
                        <TextField
                          placeholder={'eg. Football, Basketball...etc'}
                          type={'text'}
                          label={'Sports Type'}
                          name={'sportsType'}
                        />
                      </Column>
                    </Columns>
                  </div>
*/}
                <div style={{marginTop: 24}}>
                  <Button isColor={'info'} style={{width: '100%'}} type={'submit'}>
                    Update
                  </Button>
                </div>
              </FormItemsParent>
            </Form>
          )}
        </Formik>
        <div style={{textAlign: 'center'}}>
          <Button
            style={{width: '25%', marginTop: '24px'}}
            onClick={() => deleteProduct(productSlug)}
          >
            Delete this product
          </Button>
        </div>
      </div>
    </div>
  );
}

const UploadedImageParent = styled.div`
  position: relative;

  button {
    position: absolute !important;
    padding: 0 !important;
    right: 0;

    background: transparent;
    &:hover {
      cursor: pointer;
      background: transparent !important;
    }
  }
`;

const FormItemsParent = styled.div`
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 48px 60px;
  margin-top: 48px;
  max-width: 1200px;
  
  a {
    text-decoration: none;
  }
  
  h4 {
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .rdw-option-wrapper, .rdw-dropdown-wrapper {
    transition: all 0.25s ease-in-out;
  }
  
  .rdw-dropdownoption-default {
    divor: #767676;
    font-size: 14px;
  }
  
  .rdw-dropdown-wrapper:hover, .rdw-option-wrapper:hover {
    box-shadow: none !important;
    border: 1px solid gray;
`;

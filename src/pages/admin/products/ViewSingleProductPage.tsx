import React, {useState} from 'react';
import {useApi} from '../../../network';
import Loading from '../../../components/loading';
import styled from 'styled-components';
import {notify} from '../../../helpers/views';
import {Button, Column, Columns, Field} from 'bloomer';
import {Form, Formik} from 'formik';
import TextField from '../../../components/input/TextField';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Editor from '../../../components/editor/Editor';
import ImageUploader from '../../../components/uploader/ImageUploader';
import SelectedImageModal from '../brands/modals/SelectedImageModal';
import * as Yup from 'yup';
import defaultHelpers, {
  capitalize,
  cleanString,
  extractErrorMessage, slugify,
} from '../../../helpers';
import {useDispatch} from 'react-redux';
import useSWR from 'swr/esm/use-swr';
import {deleteUploadedImageAction} from '../../../state/actions';
import {BrandType, ProductTypeType, VariantType} from '../../../types';
import {EmptyState} from '../../../components';
import {DeadEyes2} from '../../../constants/icons';
import {SimpleListItem} from '../../../components/list';
import {ChevronRight} from 'react-feather';
import CreateVariantModal from './components/CreateVariantModal';
import EditVariantModal from './components/EditVariantModal';


const UpdateProductValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  brand: Yup.string().required(),
  originalPrice: Yup.number().required(),
  productType: Yup.string().required(),
  categories: Yup.array().of(Yup.object({name: Yup.string()})).required(),
  short: Yup.string().required(),
  long: Yup.string().required(),
  seo: Yup.string().required(),
  isOnOffer: Yup.boolean()
});

export default function ViewSingleProductPage(props) {
  const api = useApi();
  const dispatch = useDispatch();
  const [showImageModal, setImageModalShown] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [isCreateVariantModalActive, setCreateVariantModalActive] = useState(false);
  const [isEditVariantModalActive, setEditVariantModalActive] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  const allBrandsFetcher = () => api.brands.getAll().then(({data}) => data);
  const {data: allBrands} = useSWR<BrandType[]>('/brands/all', allBrandsFetcher);

  const productSlug = props.match.params.slug;

  const singleProductFetcher = (key, slug) => api.products.get(slug).then(({data}) => ({
      name: data.name,
      slug: data.slug,
      uuid: data.uuid,
      short: data.description.short,
      long: data.description.long,
      seo: data.description.seo,
      brand: capitalize(data.brands[0].name),
      images: data.images,
      currency: 'Ksh.',
      categories: data.categories,
      originalPrice: data.originalPrice,
      productType: data.productType,
      isOnOffer: data.isOnOffer,
      variants: data.variants
    }
  ));
  const {data: thisProductData, error: fetchProductError, mutate} = useSWR([`/product/${productSlug}`, productSlug], singleProductFetcher);


  const productTypeFetcher = () => api.productTypes.getSingle(thisProductData?.productType?.slug).then(({data}) => data);
  const {data: productType, error: fetchProductTypeError} = useSWR<ProductTypeType>(
    thisProductData?.productType?.uuid ?
    `/product/${thisProductData.productType.uuid}` : undefined,
    productTypeFetcher
  );

  if (fetchProductError || fetchProductTypeError){
    return (
      <EmptyState
        icon={DeadEyes2}
        centerAlign={true}
        message={'An error occurred while fetching this product: ' + fetchProductError}
        title={'Could not fetch product'} />
    );
  }

  if (!thisProductData || !productType) {
    return (
      <Loading message={'Please wait a while...'} />
    )
  }


  function deleteProduct(id) {
    if (!id) {
      return;
    }

  }

  const triggerCreateVariantModal: () => void = () => {
    setCreateVariantModalActive((prevState) => !prevState);
  }
  const triggerEditVariantModal: (variant) => void = (variant) => {
    console.log("Setting variant: ", variant)
    setEditingVariant(variant);
    setEditVariantModalActive((prevState) => !prevState);
  }

  return (
    <div>
      <div>
        <Formik
          initialValues={{
            ...thisProductData,
          }}
          onSubmit={async (values, {setSubmitting}) => {
            console.log('Submitting form...', values);
            // When updating a product, we only want to send details that have changed
            // And ignore the rest
            // Note: arrays always show up
            let diff = defaultHelpers.objectDiff(thisProductData, values);
            // Any new images?
            let noNewImages = defaultHelpers.arraysEqual(thisProductData.images, values.images);
            // Any new categories?
            let noNewCategories = defaultHelpers.arraysEqual(
              thisProductData.categories,
              values.categories,
            );

            // Delete them from the object if they don't exist
            if (noNewImages) {
              delete diff.images;
            } else {
              // otherwise, delete the 'local' id used by the image uploader
              diff.images = diff.images.map(image => {
                const {id, ...rest} = image;

                return rest;
              });
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
              await dispatch(api.products.update(thisProductData.uuid, diff));
              // Delete the now uploaded images
              dispatch(deleteUploadedImageAction({
                uploaderId: 'retro-image-uploader-' + productSlug,
              }));
              await mutate(null, true);
              notify('success', 'Updated product successfully.');
            } catch (e) {
              console.error(e);
              const message = extractErrorMessage(e);
              notify('error', 'An error occurred. ' + message);
            }

            setSubmitting(false);
          }}
        >
          {({setFieldValue, submitForm, isSubmitting, values}) => (
            <Form>
              <FormItemsParent>
                <h3>Main Details</h3>
                <div>
                  <ImageUploader
                    allowMultiple={true}
                    id={productSlug}
                    folder={`products/${slugify(thisProductData.brand, {lower: true})}/${slugify(values.name)}`}
                    initialImages={values.images}
                    onClickSelectedImage={images => {
                      setImageModalShown(!showImageModal);
                      setSelectedImages(images);
                    }}
                    onDeleteUploadedImage={async ({fileId}) => {
                      try {
                        await api.products.deleteImage({
                          productId: thisProductData.uuid,
                          fileId,
                        });
                        await mutate(null, true);
                        notify('success', 'Image deleted');
                      } catch (e) {
                        const message = extractErrorMessage(e);
                        notify('error', message);
                      }
                    }}
                    onInit={images => setFieldValue('images', images)}
                    onUpload={(err, {images: all}) => {
                      notify('success', 'Image uploaded successfully.');
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
                          label={'This product\'s name '}
                          placeholder={'Name'}
                          name="name"
                        />
                      </Field>
                    </Column>
                    <Column isSize={{desktop: '1/2'}}>
                      <Field>
                        <label>
                          This product's brand name
                        </label>
                        <Select
                          placeholder="eg. Adidas"
                          options={allBrands?.map(item => ({
                            label: capitalize(item.name),
                            value: item.name,
                          }))}
                          isOptionSelected={
                            ({value}) => value.toLowerCase() ===
                              thisProductData.brand.toLowerCase()
                          }
                          defaultValue={thisProductData && {
                            label: capitalize(thisProductData?.brand),
                            value: thisProductData?.brand,
                          }}
                          onChange={({value}) => setFieldValue('brand', value)}
                          type="text"
                          name="brand" />
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
                          type={'text'}
                          disabled
                          label={'This product\'s slug'}
                          placeholder={'eg. adidas-superstar'}
                          name="slug"
                        />
                      </Field>
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
                        placeholder={'eg. Sneakers, Men\'s shoes`'}
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
                            label: 'Men\'s shoes',
                          },
                          {
                            value: 'womens-shoes',
                            label: 'Women\'s shoes',
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
                    label={'SEO description'}
                    chars={150}
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
                  <div style={{display: 'flex'}}>
                    <div>
                      <h4 style={{margin: 0}}>Product Variants</h4>
                      <p>Variants can be grouped by their options</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      {
                        thisProductData.variants.map((variant: VariantType) => {
                          return (
                            <div>
                              <SimpleListItem>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'between'}}
                                     className="hover-pointer"
                                     onClick={()=> triggerEditVariantModal(variant)}
                                >
                                  <p>{variant.name}</p>

                                  <ChevronRight size={24} />
                                </div>
                              </SimpleListItem>

                            </div>
                          );
                        })
                      }
                    </div>
                    <div>
                      <Button onClick={triggerCreateVariantModal}>
                        Add a New Variant
                      </Button>

                      <div>
                        <CreateVariantModal
                          isActive={isCreateVariantModalActive}
                          onClose={triggerCreateVariantModal}
                          productId={thisProductData.uuid}
                          productTypeId={thisProductData.productType.uuid}
                        />
                      </div>
                      <div>
                        <EditVariantModal
                          isActive={isEditVariantModalActive}
                          onClose={triggerEditVariantModal}
                          variantId={editingVariant?.uuid}
                          productTypeOptions={productType.options}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{marginTop: 24}}>
                  <Button
                    isLoading={isSubmitting}
                    isColor={'info'}
                    style={{width: '100%'}}
                    onClick={() => submitForm()}
                  >
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

const FormItemsParent = styled.div`
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 48px 60px;
  margin-top: 48px;
  max-width: 1200px;
  
  a {
    text-decoration: none;
  }
  
  .rdw-option-wrapper, .rdw-dropdown-wrapper {
    transition: all 0.25s ease-in-out;
  }
  
  .rdw-dropdownoption-default {
    color: #767676;
    font-size: 14px;
  }
  
  .rdw-dropdown-wrapper:hover, .rdw-option-wrapper:hover {
    box-shadow: none !important;
    border: 1px solid gray;
`;

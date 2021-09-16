import React, {useEffect, useState} from 'react';
import Loading from '../../components/loading';
import {formatNumberWithCommas} from '../../helpers';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import SEOHeader from '../../components/SEOHeader';
import {DeadEyes, Replace, Return} from '../../constants/icons';
import '../../assets/style/index.scss';
import {JsonLd} from 'react-schemaorg';
import productJsonld, {subProduct} from './product.jsonld';
import {Button, Delete, Help, Modal, ModalBackground, ModalClose, ModalContent, Tag, Title} from 'bloomer';
import ProductImagesSliderComponent from './components/ProductImagesSliderComponent';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {useApi} from '../../network';
import {CartItemType, CartType, ProductType, ProductTypeOptionValue, VariantType} from '../../types';
import useSWR from 'swr';
import {useNotify} from '../../hooks';
import {EmptyState, RetroImage} from '../../components';
import ValuePropositionComponent from './components/ValuePorposition';
import {useHistory} from 'react-router';
import RadioField from '../../components/input/RadioField';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import {isProductInStock} from '../../components/cart';
import {addItemToCartAction, toggleSidebarAction} from '../../state/actions';

const AddToCartValidationSchema = Yup.object({
  size: Yup.string().required(),
});

/**
 * Once a product is loaded, its variants are sorted out by color and displayed to the user. A variant
 * from the first set of colors is arbitrarily set as the active variant.
 *
 * When a user selects a different color, the same process is repeated (an arbitrary variant is selected
 * from the set of colors and set as the currently active variant).
 *
 * The active variant is also changed when a user
 * @param match
 * @constructor
 */
function ProductPage({match}) {
  const api = useApi();
  const dispatch = useDispatch();
  const {slug} = match.params;

  const history = useHistory();
  const notify = useNotify();


  const [sortedVariants, setSortedVariants] = useState<VariantType[]>([]);

  const [currentVariant, setCurrentVariant] = useState<VariantType>(null);

  const [selectedColorOption, setSelectedColorOption] = useState<ProductTypeOptionValue>(null);

  const [availableSizes, setAvailableSizes] = useState<ProductTypeOptionValue[]>([]);

  const [isInvalidVariant, setIsInvalidVariant] = useState(false);

  const isSidebarOpen = useSelector((state: RootStateOrAny) => state.meta.isSidebarOpen);

  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const cart: CartType = useSelector((state: RootStateOrAny) => state.cart);

  const singleDataFetcher = (_key, slug) => api.products.getSingle(slug).then(({data}) => data);
  const {data: currentProduct, error: fetchProductError} = useSWR<ProductType>(
    [`/product/${slug}`, slug],
    singleDataFetcher,
  );

  useEffect(() => {

    if (currentProduct) {
      const query = history.location.search;

      if (query) {
        const searchParams = new URLSearchParams(query);
        if (searchParams.has('variant')) {
          const currentVariant = currentProduct.variants.find(
            variant => variant.uuid === searchParams.get('variant'),
          );

          if (currentVariant) {
            setActiveVariant(currentVariant);
          } else {
            setIsInvalidVariant(true);
          }
        } else {
          setActiveVariant(currentProduct.defaultVariant);
        }
      } else {
        setActiveVariant(currentProduct.defaultVariant);
      }
    }

  }, [currentProduct]);

  /**
   * For each product, we sort the variants out depending on their color.
   */
  useEffect(() => {
    if (currentProduct) {
      const variantsSortedByColor = getVariantsSortedByColor(currentProduct);
      setSortedVariants(variantsSortedByColor);
    }

  }, [currentProduct]);

  if (isInvalidVariant) {
    return (
      <Layout>
        <EmptyState
          icon={DeadEyes}
          title={'Oops. That doesn\'t look right.'}
          message={'Please review the product you\'re looking for and try again.'}
        />
      </Layout>
    );
  }

  if ((!currentProduct && !fetchProductError) || !currentVariant) {
    return <Loading message={false} />;
  }

  if (fetchProductError) {
    return (
      <Layout>
        <EmptyState
          icon={DeadEyes}
          title={'Yikes. A server error occurred.'}
          message={'It\'s not you. It\'s us. Our engineers have been notified and are on the case.'}
        />
      </Layout>
    );
  }

  function getVariantFromCart(uuid): CartItemType | undefined {
    if (!cart.items.length) return null;

    return cart.items.find(item => item.productId === uuid);
  }

  function deduceVariantByColorAndSize({size, color}: {size: string; color: string}): VariantType {

    return currentProduct.variants.find(variant => {
      const hasCorrectSize = variant.optionValues.some(ov => {
        return ov.uuid === size;
      });

      const hasCorrectColor = variant.optionValues.some(ov => {
        return ov.uuid === color;
      });

      return hasCorrectSize && hasCorrectColor;
    });
  }

  /**
   * In order for an item to be added to the cart, we need to have
   * a combination of 1) the size of the product 2) the color of the product.
   *
   * Using these two attributes, we can then determine exactly what it is
   * a user wants to add to their cart.
   **/

  function addToCart({size, color}) {

    const lineItem: VariantType = deduceVariantByColorAndSize({size, color: color.uuid});

    let cartItem: CartItemType = {
      productName: lineItem.name,
      inStock: lineItem.stock.quantity,
      images: lineItem.images,
      uuid: lineItem.uuid,
      isOnOffer: false,
      slug: lineItem.slug,
      originalPrice: lineItem.originalPrice,
      thumbnailUrl: lineItem.images[0].thumbnailUrl,
      price: lineItem.originalPrice,
      quantity: 1,
      productId: lineItem.uuid,
    };

    const { shouldAddToCart, message } = isProductInStock(cart, cartItem);
    if (shouldAddToCart) {
      if (!isSidebarOpen) {
        notify.info(`${lineItem.name} added to cart`, {
          onClick: () => {
            dispatch(toggleSidebarAction({open: true}));
          },
        });
      }
      dispatch(addItemToCartAction({item: cartItem}));
    } else {
      notify.error(message);
    }
  }

  function setActiveVariant(variant: VariantType) {
    if (variant) {
      setCurrentVariant(variant);
      setVariantIdToUrl(variant);

      const color = getVariantColor(variant);
      setSelectedColorOption(color);

      const availableSizes = getAvailableSizesForVariant(variant);
      setAvailableSizes(availableSizes);
    }
  }

  function setVariantIdToUrl(variant: VariantType) {
    const query = history.location.search;
    const searchParams = new URLSearchParams(query);

    if (searchParams.has('variant')) {
      searchParams.delete('variant');
    }

    searchParams.append('variant', variant.uuid);
    history.replace(`?${searchParams.toString()}`);
  }

  function getAvailableSizesForVariant(currentVariant: VariantType) {
    const optionValue = getVariantColor(currentVariant);

    const availableVariants = currentProduct.variants.filter(variant => {
      return variant.optionValues.some(ov => ov.uuid === optionValue?.uuid);
    });

    const collator = new Intl.Collator([], {numeric: true});

    return availableVariants.map(variant => {
      return variant.optionValues.map(ov => {
        if (ov.option.name === 'size') {
          return ov;
        }
        return null;
      });
    }).flat()
      .filter(ov => ov !== null)
      .sort((a, b) => collator.compare(a.value, b.value));
  }

  function getVariantColor(variant: VariantType): ProductTypeOptionValue {
    return variant?.optionValues?.find(ov => ov.option.name === 'color' || ov.option.name === 'colour');
  }

  function getVariantsSortedByColor(currentProduct: ProductType) {
    const variantsSortedByColor = [];
    // we use this array to ensure the same color isn't collected twice
    const collectedColors = [];

    // for each variant
    const colorsAvailable = currentProduct.variants.map(variant => {
      // map its optionValues
      return variant.optionValues.map((ov, index) => {
        // and get the color option if available
        // we account for different spellings, just in case.
        if (ov.option.name === 'color' || ov.option.name === 'colour') {
          return variant.optionValues[index].value;
        }
        return null;
      });
    }).flat()
      .filter(v => v != null);

    // for each variant
    currentProduct.variants.forEach(variant => {
      // go through the list of colors available
      colorsAvailable.forEach(color => {
        // and for each color, got through the variant's attributes
        variant.optionValues.forEach(ov => {
          // if the variant has a color option available
          if (ov.option.name === 'color' || ov.option.name === 'colour') {
            // and the variant's color matches an available color
            if (ov.value === color) {
              // make sure the color hasn't been collected before
              if (!collectedColors.includes(color)) {
                // and push the variant to our array
                variantsSortedByColor.push(variant);
                // together with the collected color
                collectedColors.push(color);
              }
            }
          }
        });
      });
    });

    return variantsSortedByColor;
  }

  function changeCurrentVariant(newVariant: VariantType) {
    setSelectedColorOption(getVariantColor(newVariant));
    setCurrentVariant(newVariant);
    const availableSizes = getAvailableSizesForVariant(newVariant);
    setAvailableSizes(availableSizes);
  }

  function isInStock(variant: VariantType) {
    // get the item from the user's cart
    const cartItem = getVariantFromCart(variant?.uuid);
    // if it exists in the cart
    if (cartItem) {
      // make sure the user hasn't selected more products than are in stock
      return (
        (cartItem.inStock > 0) &&
        (cartItem.quantity < cartItem.inStock)
      );
    }

    // if it's not in the cart,
    // make sure the variant count from the server is greater than 0
    return variant?.stock?.quantity > 0;
  }

  function isColorActive(color: ProductTypeOptionValue) {
    return selectedColorOption?.uuid === color.uuid;
  }

  function openModal(open) {
    setConditionModalOpen(open);
  }

  return (
    <>
      <SEOHeader
        description={`${currentProduct.description.seo}`}
        path={`/product/${slug}`}
        title={`${currentProduct.name} shoes in Nairobi`}
      />


      <JsonLd item={{...productJsonld(currentProduct)}} />
      <JsonLd item={{...subProduct(currentProduct)}} />

      <Layout>
        <ProductPageParent>
          <ProductImagesSliderComponent
            productName={currentProduct.name}
            images={currentVariant.images} />

          <ValuePropositionComponent />

          <div>
            <h4>Available Options</h4>
            {
              sortedVariants.length ? (
                <AvailableColors>
                  {
                    sortedVariants.map(variant => (
                      <Color isActive={isColorActive(getVariantColor(variant))}
                             onClick={() => changeCurrentVariant(variant)}>
                        <RetroImage src={variant.images[0]?.thumbnailUrl} alt={variant.name} />
                      </Color>
                    ))
                  }
                </AvailableColors>
              ) : <span>No options available.</span>
            }
          </div>

          <ProductParent className="product--parent">
            <DescriptionParent>
              <h1>
                {currentProduct.name}
                {
                  !isInStock(currentVariant) ? (
                    <Tag
                      style={{
                        verticalAlign: 'middle',
                        marginLeft: '8px',
                      }}
                      isColor={'danger'}>
                      Out of stock
                    </Tag>
                  ) : currentVariant.stock.quantity <= 5 ? (
                    <Tag isColor={'warning'}
                         style={{
                           verticalAlign: 'middle',
                           marginLeft: '8px',
                         }}
                    >
                      {`Only ${currentVariant.stock.quantity} left in stock`}
                    </Tag>
                  ) : (
                    <Tag isColor={'info'}
                         style={{
                           verticalAlign: 'middle',
                           marginLeft: '8px',
                         }}
                    >
                      {`${currentVariant.stock.quantity} left in stock`}
                    </Tag>
                  )
                }
              </h1>
              <h2>
                {
                  `
                  Ksh. ${formatNumberWithCommas(currentVariant?.originalPrice)}
                  `
                }
              </h2>
              <div>
                <h4>Description</h4>
                <p>{currentProduct.description.short}</p>
                <InDepth>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentProduct.description.long,
                    }}
                  />
                </InDepth>
              </div>

              <Formik
                initialValues={{
                  size: '',
                }}
                validationSchema={AddToCartValidationSchema}
                onSubmit={(values) => addToCart({size: values.size, color: selectedColorOption})}
              >
                {({values, setFieldValue}) => (
                  <Form>
                    <div style={{marginTop: '1rem'}}>
                      <h4>Select a size:</h4>
                      <SizesParent>

                        {
                          availableSizes.length ? (
                            <RadioField
                              bordered={true}
                              isGroup={true}
                              inline={true}
                              onChange={(value) => {
                                const variantBySize = deduceVariantByColorAndSize({
                                  color: selectedColorOption.uuid,
                                  size: value,
                                });
                                setActiveVariant(variantBySize);
                                setFieldValue('size', value);
                              }}
                              options={availableSizes.map(size => ({
                                value: size.uuid,
                                label: size.value,
                              }))}
                              // intentionally misnamed
                              // doesn't work with proper naming for some reason
                              // see onChange instead
                              name={'productSize'} />
                          ) : <span>No sizes available.</span>
                        }

                      </SizesParent>
                    </div>

                    <Buttons>
                      <div style={{margin: '18px 0'}}>
                        <div>
                          <Button
                            isColor="primary"
                            type="submit"
                            disabled={!isInStock(currentVariant) || !values.size}
                            style={{
                              width: '100%',
                              fontWeight: 'bold',
                            }}
                          >
                            {
                              !isInStock(currentVariant) ? 'OUT OF STOCK' : !values.size ? 'SELECT A SIZE' : 'ADD TO CART.'
                            }
                          </Button>
                        </div>
                      </div>
                      <div>
                        {
                          !isInStock(currentVariant) && (
                            <div>
                              <Help>
                                Want to be the first to know when this product in back in stock? {' '}
                                <Button
                                  isColor={'ghost'}>
                                  We can let you know!
                                </Button>
                              </Help>

                            </div>
                          )
                        }
                      </div>

                      <div>
                        <header>
                          <h3>What if it doesn't fit?</h3>
                        </header>
                        <div
                          style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{flex: '1 0 180px'}}>
                            <img alt={'return'} src={Return} style={{width: '48px'}} />
                            <h4 style={{color: '#353535'}}>Returns accepted within 7 days</h4>
                            <p>
                              &#10003; Direct returns - money refunded to your M-Pesa or Paypal account.
                            </p>
                          </div>
                          <div style={{flex: '1 0 180px'}}>
                            <img alt={'replace'} src={Replace} style={{width: '48px'}} />
                            <h4 style={{color: '#353535'}}>Replacements accepted within 14 days</h4>
                            <p>&#10003; Replace your product with any other of similar value</p>
                          </div>
                        </div>
                      </div>

                      <hr />

                      <div>
                        <h3>Missing your size?</h3>
                        <p>
                          Didn't find these shoes in your size? Hit us up and we'll try and get it for
                          you. ✌️
                        </p>
                      </div>

                      <ConditionParent>
                        <div style={{textAlign: 'center', color: '#222'}}>
                          <Modal isActive={conditionModalOpen}>
                            <Delete onClick={() => openModal(false)} />
                            <ModalBackground />
                            <ModalContent>
                              <Title>Condition Guide</Title>
                              <p style={{color: '#222'}}>
                                All products on T25 are divided into three distinct categories:
                              </p>
                              <ul>
                                <li>
                                  <Tag
                                    style={{
                                      background: 'dodgerblue',
                                      color: 'white',
                                    }}
                                  >
                                    Repackaged:
                                  </Tag>
                                  <p
                                    style={{
                                      color: '#222',
                                      display: 'inline',
                                      marginLeft: '4px',
                                    }}
                                  >
                                    New with box: unused, unworn and unblemished. Are repackaged in T25
                                    boxes.
                                  </p>
                                </li>
                                <li>
                                  <Tag
                                    style={{
                                      background: 'green',
                                      color: 'white',
                                    }}
                                  >
                                    Refurbished:
                                  </Tag>
                                  <p
                                    style={{
                                      color: '#222',
                                      display: 'inline',
                                      marginLeft: '4px',
                                    }}
                                  >
                                    Like-new with minimal blemishes and wear. Does not come with box.
                                  </p>
                                </li>
                                <li>
                                  <Tag
                                    style={{
                                      background: 'violet',
                                      color: 'white',
                                    }}
                                  >
                                    Slightly Worn:
                                  </Tag>
                                  <p
                                    style={{
                                      color: '#222',
                                      display: 'inline',
                                      marginLeft: '4px',
                                    }}
                                  >
                                    Visible wear and tear, but still reasonably new.
                                  </p>
                                </li>
                              </ul>
                            </ModalContent>
                            <ModalClose />
                          </Modal>
                        </div>
                      </ConditionParent>
                    </Buttons>
                  </Form>
                )}
              </Formik>

            </DescriptionParent>
          </ProductParent>
        </ProductPageParent>
      </Layout>
    </>
  );
}

export default ProductPage;


const ConditionParent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  p {
    display: inline-block;
  }
`;

const ProductPageParent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  
  .product__page__slider__parent {
    
  }
`;

const ProductParent = styled.div`
  display: flex;
  
  @media screen and (max-width: 376px) {
    flex-direction: column;
    padding: 0;
  }
`;

const DescriptionParent = styled.div`
  max-width: 800px;
  min-width: 300px;
  padding: 32px 64px 0 64px;
  border-radius: 6px;

  @media screen and (max-width: 376px) {
    margin-left: 0;
    width: unset;
  }
  
  h1 {
  }
`;


const SizesParent = styled.div`
  display: flex;
  align-items: center;
`;


const AvailableColors = styled.div`
  display: flex; 
  gap: 0.5rem;
`;

const Color = styled.div<{isActive?: boolean}>`
  max-width: 80px;
  border-radius: 0.2rem;
  border: ${props => !props.isActive ? '2px solid lightgray' : '2px solid red'};
  width: max-content;
  transition: all 0.25s ease-in-out;
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
     padding: 8px 10px;      
  }

  &:hover {
    cursor: pointer;
    border: 2px solid gray;
  }
`;

const InDepth = styled.div`
  max-width: 800px;
  min-width: 300px;
  width: 800px;

  @media screen and (max-width: 768px) {
      width: unset; 
  }
  
  ul, li, p {
    color: #353535;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;

  .cart-open {
    &:hover {
      cursor: pointer;
    }
  }
`;

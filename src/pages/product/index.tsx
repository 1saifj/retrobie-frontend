import React, {useState} from 'react';
import Loading from '../../components/loading';
import {addItemToCartAction, toggleSidebarAction} from '../../state/actions';
import {capitalize, formatNumberWithCommas} from '../../helpers';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import SEOHeader from '../../components/SEOHeader';
import {DeadEyes, Diamond, FastDelivery, HelpIcon, Replace, Return} from '../../constants/icons';
import '../../assets/style/index.scss';
import {JsonLd} from 'react-schemaorg';
import productJsonld, {subProduct} from './product.jsonld';
import {Button, Delete, Help, Modal, ModalBackground, ModalClose, ModalContent, Tag, Title} from 'bloomer';
import ProductImagesSliderComponent from './components/ProductImagesSliderComponent';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import {isProductInStock} from '../../components/cart';
import {useApi} from '../../network';
import {CartItemType, CartType, ProductType} from '../../types';
import useSWR from 'swr';
import {useNotify} from '../../hooks';
import {EmptyState} from '../../components';
import ValuePropositionComponent from './components/ValuePorposition';

function ProductPage({ match }) {
  const api = useApi();
  const dispatch = useDispatch();
  const { slug } = match.params;

  const isSidebarOpen = useSelector((state: RootStateOrAny) => state.meta.isSidebarOpen);

  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const cart: CartType = useSelector((state: RootStateOrAny) => state.cart);

  const singleDataFetcher = (_key, slug) => api.products.getSingle(slug).then(({ data }) => data)
  const {data: currentProduct, error: fetchProductError} = useSWR<ProductType>(
    [`/product/${slug}`, slug],
    singleDataFetcher,
  );

  const notify = useNotify();

  if (!currentProduct && !fetchProductError) {
    return <Loading message={false} />;
  }

  if (fetchProductError) {
    return (
      <Layout
      >
        <EmptyState
          icon={DeadEyes}
          title={'Yikes. A server error occurred.'}
          message={"It's not you. It's us. Our engineers have been notified and are on the case."}
        />
      </Layout>
    );
  }

  function getProductFromCart(uuid): CartItemType | undefined {
    if (!cart.items.length) return null;

    return cart.items.find(item => item.productId === uuid);
  }

  function dispatchToCart(productItem: ProductType) {

    let cartItem: CartItemType = {
      productName: productItem.name,
      inStock: productItem.inStock,
      images: productItem.images,
      uuid: productItem.uuid,
      isOnOffer: productItem.isOnOffer,
      slug: productItem.slug,
      originalPrice: productItem.originalPrice,
      thumbnailUrl: productItem.images[0].thumbnailUrl,
      price: productItem.originalPrice,
      quantity: 1,
      productId: productItem.uuid
    };

    const { shouldAddToCart, message } = isProductInStock(cart, cartItem);
    if (shouldAddToCart) {
      if (!isSidebarOpen) {
        const toastId = notify.info( `${productItem.name} added to cart`, {
          onClick: () => {
            dispatch(toggleSidebarAction({open: true}))
          },
        });

      }
      dispatch(addItemToCartAction({ item: cartItem }));
    } else {
      notify.error(message);
    }
  }


  function isInStock(product: ProductType) {
    // get the item from the user's cart
    const cartItem = getProductFromCart(product.uuid);
    // if it exists in the cart
    if (cartItem) {
      // make sure the user hasn't selected more products than are in stock
      return (
        (cartItem.inStock > 0) &&
        (cartItem.quantity < cartItem.inStock)
      );
    }

    // if it's not in the cart,
    // make sure the product count from the server is greater than 0
    return product?.inStock > 0;
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
            images={currentProduct.defaultVariant.images} />

          <div style={{
            width: '80%',
            borderRadius: '4px',
            marginTop: 84,
          }}>
            <ValuePropositionComponent/>
          </div>

          <ProductParent className="product--parent">
            <DescriptionParent>
              <h1>
                {currentProduct.name}
                {
                  !isInStock(currentProduct) && (
                    <Tag
                      style={{
                        verticalAlign: "middle",
                        marginLeft: "8px"
                      }}
                      isColor={'warning'}>
                      Out of stock
                    </Tag>
                  )
                }
              </h1>
              <h2>
                {
                  `${currentProduct.currency || 'Ksh'
                  }.  
                    ${formatNumberWithCommas(currentProduct.originalPrice)
                  }`
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

              {
                currentProduct.inStock !== null && (
                  <div>
                    <h4>Stock</h4>
                    {
                      currentProduct.inStock === 0 ? (
                          <CustomTag>
                            <p>Not in stock</p>
                          </CustomTag>
                        ) :
                        currentProduct.inStock <= 5 ? (
                          <CustomTag>
                            <p>Only {currentProduct.defaultVariant.stock.quantity} left in stock</p>
                          </CustomTag>
                        ) : (
                          <CustomTag>
                            <p>{currentProduct.defaultVariant.stock.quantity} left in stock</p>
                          </CustomTag>
                        )
                    }
                  </div>
                )
              }
              <Buttons>
                <div style={{margin: '18px 0'}}>
                  <div>
                    <Button
                      isColor="primary"
                      onClick={() => {
                        return dispatchToCart({
                          ...currentProduct,
                          price: currentProduct.originalPrice,
                        });
                      }}
                      disabled={!isInStock(currentProduct)}
                      style={{
                        width: '100%',
                        fontWeight: 'bold',
                      }}
                    >
                      {!isInStock(currentProduct) ? 'OUT OF STOCK' : 'ADD TO CART.'}
                    </Button>
                  </div>
                </div>
                <div>
                  {
                    !isInStock(currentProduct) && (
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

const ColorsRoot = styled.div`
  & > h4 {
    margin-bottom: 8px;
  }
`;

const ColorsParent = styled.div<{src: string}>`
  border: 2px solid ${props => props.src};
  padding: 2px;
  border-radius: 50%;
  width: -moz-min-content;
  width: 32px;
  -webkit-transition: all 0.25s ease-in-out;
  transition: all 0.25s ease-in-out;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Color = styled.div<{src: string}>`
  background: ${props => props.src};
  border-radius: 50%;
  width: 24px;
  height: 24px;

  &:hover {
    cursor: pointer;
  }
`;

const SizesParent = styled.div`
  display: flex;
  align-items: center;
`;

const Sizes = styled.div`
  display: flex;

  .rs-radio-group-picker {
    border: none;
  }

  .rs-radio-checker {
    label {
      padding: 0;
    }
  }
`;

const CustomTag = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-right: 6px;
  padding: 10px 12px 8px;
  width: max-content;
  transition: all 0.25s ease-in-out;
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
     padding: 8px 10px;      
  }

  p {
    margin: 0;
    padding: 0;
    color: #353535;
  }

  &:hover {
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.3);
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

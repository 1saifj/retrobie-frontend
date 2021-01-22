import React, { useState } from 'react';
import Loading from '../../components/loading';
import {addItemToCartAction, toggleSidebarAction} from '../../state/actions';
import { formatNumberWithCommas } from '../../helpers';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import SEOHeader from '../../components/SEOHeader';
import {
  Diamond,
  FastDelivery,
  HelpIcon,
  Replace,
  Return,
} from '../../constants/icons';
import '../../assets/style/index.scss';
import { JsonLd } from 'react-schemaorg';
import productJsonld, { subProduct } from './product.jsonld';
import { Button, Delete, Modal, ModalBackground, ModalClose, ModalContent, Tag, Title } from 'bloomer';
import ProductSlider from '../../components/slider/ProductSlider';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { isProductInStock } from '../../components/cart';
import { useAuth } from '../../network';
import { CartItemType, CartType, ProductType } from '../../types';
import useSWR from 'swr';
import {useNotify} from '../../hooks';

function Product({ match }) {
  const api = useAuth();
  const dispatch = useDispatch();
  const { id } = match.params;

  const isSidebarOpen = useSelector((state: RootStateOrAny) => state.meta.isSidebarOpen);

  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const cart: CartType = useSelector((state: RootStateOrAny) => state.cart);

  const singleDataFetcher = (_key, id) => api.products.getSingle(id).then(({ data }) => data)
  const { data: currentProduct, error } = useSWR<ProductType>(['/orders/single', id], singleDataFetcher)

  const notify = useNotify();

  // if (error) {
  //   return (
  //     // @ts-ignore
  //     <Layout
  //       style={{
  //         display: 'flex',
  //         height: '80vh',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //       }}
  //     >
  //       <EmptyState
  //         icon={ErrorIcon502Dark}
  //         message={"It's not you. It's us. Our engineers have been notified and are on the case."}
  //         title={'Yikes. A server error occurred.'}
  //       />
  //     </Layout>
  //   );
  // }

  if (!currentProduct) {
    return <Loading message={false} />;
  }

  function getProductFromCart(uuid): CartItemType | undefined {
    if (!cart.items.length) return null;

    return cart.items.find(item => item.productId === uuid);
  }

  function dispatchToCart(productItem: ProductType) {

    let cartItem: CartItemType = {
      productName: productItem.name,
      stock: productItem.stock.usersCount,
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
            notify.dismiss(toastId);
            dispatch(toggleSidebarAction({open: true}))
          },
        });

      }
      dispatch(addItemToCartAction({ item: cartItem }));
    } else {
      notify.error(message);
    }
  }


  function notInStock() {
    const cartItem = getProductFromCart(id);
    if (cartItem) {
      return (
        currentProduct.stock.usersCount === 0 ||
        cartItem.quantity >= currentProduct.stock.usersCount
      );
    }

    return false;
  }

  function openModal(open) {
    setConditionModalOpen(open);
  }

  return (
    <>
      {/* @ts-ignore*/}
      <SEOHeader title={currentProduct.name} description={currentProduct.description.copy}/>
      <JsonLd item={{...productJsonld(currentProduct, id)}}/>
      <JsonLd item={{...subProduct(currentProduct, match.url)}}/>

      <Layout>
        <ProductRoot>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ProductSlider
              productName={currentProduct.name}
              images={currentProduct.images}/>

            <div style={{
              width: '80%',
              borderRadius: '4px',
              marginTop: 84
            }}>
              <div>
                <ValueProposition>
                  <div>
                    <img style={{width: '50px'}} src={FastDelivery} alt={'Free Delivery'}/>
                    <h4>Next-day Delivery</h4>
                    <p>Anywhere within Nairobi</p>
                  </div>
                  <div>
                    <img style={{width: '50px'}} src={HelpIcon} alt={'easy payment'}/>
                    <h4>Need help?</h4>
                    <p>
                      Hit us up on Twitter <a href="https://twitter.com/retrbobie">@retrobie</a> or
                      give us a call
                    </p>
                  </div>
                  <div>
                    <img style={{width: '50px'}} src={Diamond} alt={'easy payment'}/>
                    <h4>Assured Quality</h4>
                    <p>100% original product guarantee</p>
                  </div>
                </ValueProposition>
              </div>
            </div>

            <ProductParent className="product--parent">
              {/*// @ts-ignore*/}
              <SEOHeader
                description={`${currentProduct.description.copy}`}
                canonicalSlug={currentProduct.slug}
                title={currentProduct.name}
              />
              <DescriptionParent>
                <h1>{currentProduct.name}</h1>
                <h2>
                  {
                    `${currentProduct.currency || 'Ksh'
                    }.  
                    ${formatNumberWithCommas(currentProduct.originalPrice)
                    }`
                  }
                </h2>
                <p>{currentProduct.description.short}</p>
                <div>
                  <h4>Description</h4>
                  <p>{currentProduct.description.copy}</p>
                  <InDepth>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentProduct.description.long,
                      }}
                    />
                  </InDepth>
                </div>
                <div>
                  <div>
                    <h4>Select a size</h4>
                  </div>
                  {currentProduct.detail.size && (
                    <SizesParent>
                      <Sizes>
                        <CustomTag>
                          <p>{`${currentProduct.detail.size
                          } ${currentProduct.detail.sizeCountry.toUpperCase()}`}</p>
                        </CustomTag>
                      </Sizes>
                    </SizesParent>
                  )}
                </div>

                <div>
                  <div>
                    {currentProduct.stock.usersCount === 1 && (
                      <CustomTag>
                        <p>Only 1 in Stock</p>
                      </CustomTag>
                    )}
                  </div>
                  <div>
                    <h4>Product condition</h4>
                    <CustomTag>
                      <p>Refurbished</p>
                    </CustomTag>
                  </div>
                </div>
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
                        disabled={notInStock()}
                        style={{
                          width: '100%',
                          fontWeight: 'bold',
                        }}
                      >
                        {notInStock() ? 'OUT OF STOCK' : 'ADD TO CART.'}
                      </Button>
                    </div>
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
                        <img alt={'return'} src={Return} style={{width: '48px'}}/>
                        <h4 style={{color: '#353535'}}>Free returns within 7 days</h4>
                        <p>
                          &#10003; Direct returns - money refunded to your M-Pesa or Paypal account.
                        </p>
                      </div>
                      <div style={{flex: '1 0 180px'}}>
                        <img alt={'replace'} src={Replace} style={{width: '48px'}}/>
                        <h4 style={{color: '#353535'}}>Free replacements within 14 days</h4>
                        <p>&#10003; Replace your product with any other of similar value</p>
                      </div>
                    </div>
                  </div>

                  <hr/>

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
                        <Delete onClick={() => openModal(false)}/>
                        <ModalBackground/>
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
                        <ModalClose/>
                      </Modal>
                    </div>
                  </ConditionParent>
                </Buttons>
              </DescriptionParent>
            </ProductParent>
          </div>
        </ProductRoot>
      </Layout>
    </>
  );
}

export default Product;

const ValueProposition = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  justify-content: space-around;
  padding: 24px;
  text-align: center;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 12px;
    
    @media screen and (max-width: 376px) {
       margin: 12px;
    }

    h4 {
      margin-bottom: 6px;
    }

    p {
      margin: 0;
      text-align: center;
    }
  }
`;

const ConditionParent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  p {
    display: inline-block;
  }
`;

const ProductRoot = styled.div`
  .layout--parent {
    margin: 0;
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

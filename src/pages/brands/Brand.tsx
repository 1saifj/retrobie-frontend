import React, {useState} from 'react';
import Layout from '../../components/Layout';
import ProductFilters from './components/product-filters';
import styled from 'styled-components';
import Loading from '../../components/loading';
import {Button, Container, Section, Tag} from 'bloomer';
import {useApi} from '../../network';
import {capitalize, formatNumberWithCommas} from '../../helpers';
import {Link} from 'react-router-dom';
import useSWR from 'swr/esm/use-swr';
import {BrandType, FilteredProduct} from '../../types';
import useFiltersV2 from '../../hooks/useFiltersV2';
import {Clown, GrimacingEmoji} from '../../constants/icons';
import {EmptyState} from '../../components';
import SEOHeader from '../../components/SEOHeader';
import DrawerWrapper from 'rc-drawer';

export default function ViewSingleBrand(props) {

  const brandNameOrId = props.match.params.brand;

  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

  const api = useApi();
  const brandFetcher = (url, slug)=> api.brands.getBrandBySlug({slug}).then(({data})=> data);
  const {data: brandData, error: fetchBrandError} = useSWR<BrandType>(
    [`/brands/${brandNameOrId}`, brandNameOrId],
    brandFetcher,
  );

  const {products: renderProducts} = useFiltersV2();

  const filteredProductsFetcher = (url, slug) => api.brands.getFilteredProducts({slugOrUuid: slug}).then(({data})=> data);
  const {data: allProducts, error: fetchProductsError} = useSWR<FilteredProduct[]>([
    brandData ? `/brands/${brandData.slug}/products/filtered` : undefined,
    brandNameOrId,
  ], filteredProductsFetcher);


  if (fetchBrandError || fetchProductsError) {
    return  (
      <Layout>
        <EmptyState
          icon={Clown}
          title={'Looks like clowns took over our servers.'}
          message={"It's not you it's us. We're working on it."}
        />
      </Layout>
    )
  }

  if (!allProducts || !brandData) {
    return (
      <Loading/>
    )
  }

  if (!allProducts.length){
    return  (
      <Layout>
        <EmptyState
          icon={GrimacingEmoji}
          iconWidth={52}
          centerAlign={true}
          title={`Oops. We haven't uploaded any ${capitalize(brandData.name)} shoes yet.`}
          message={'We\'re working on it! Check back soon!' }
        />
      </Layout>
    )
  }

  return (
    <Layout>
      <SEOHeader
        description={brandData.description.seo}
        path={`/brand/${brandData.name}`}
        title={`${brandData.name} shoes`} />
      <Section>
        <Container>
          <div>
            {
              brandData ?
                <div>
                  <BrandHeader>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        gap: '3rem',
                      }}>
                      <div style={{
                        flex: '0 1 150px',
                      }}>
                        <img style={{borderRadius: '4px'}}
                             src={brandData.logo?.thumbnailUrl}
                             alt={brandData.name} />
                      </div>

                      <div style={{flex: '2 0 300px'}}>
                        <h1>About {brandData.name}</h1>
                        <p>
                          {brandData.description.long}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </BrandHeader>
                  <div className={'product__filters'}>
                    <div className={'product__filters--desktop'}>
                      <ProductFilters
                        // @ts-ignore
                        products={allProducts}
                        allCriteria={['sex', 'size', 'price', 'style']}
                      />
                    </div>
                    <div className={'product__filters--mobile'}>
                      <DrawerWrapper
                        onClose={() => setIsFiltersDrawerOpen(false)}
                        handler={null}
                        open={isFiltersDrawerOpen}>
                        <Section>
                          <Container>
                            <ProductFilters
                              // @ts-ignore
                              products={allProducts}
                              allCriteria={['sex', 'size', 'price']}
                            />

                            <div>
                              <Button
                                style={{width: '100%', marginTop: 24}}
                                onClick={() => {
                                  setIsFiltersDrawerOpen(false);
                                }}>
                                Apply filters
                              </Button>
                            </div>
                          </Container>
                        </Section>
                      </DrawerWrapper>

                      <Button
                        onClick={() => {
                          setIsFiltersDrawerOpen(true);
                        }}
                        style={{marginRight: 12}}>
                        Filters
                      </Button>
                    </div>

                    <div
                      id={'filter--products'}
                      className={'product__filters--products-parent'}>
                      <div style={{
                        justifyContent: renderProducts?.length < 3 ? 'start' : 'space-between',
                      }}
                      >
                        {
                          renderProducts?.length ? renderProducts?.map((item, index) => (
                            <ProductItem
                              key={String(index)}
                              to={`/brands/${brandNameOrId}/${item.slug}`}
                              style={{
                                maxHeight: 250,
                                background: '#f5f5f5',
                              }}>
                              {
                                !item.isInStock && (
                                  <div style={{position: 'relative'}}>
                                    <Tag
                                      style={{
                                        position: 'absolute',
                                        right: 4,
                                        top: 4,
                                      }}
                                      isColor={'warning'}>
                                      <small>
                                        OUT OF STOCK
                                      </small>
                                    </Tag>
                                  </div>
                                )
                              }
                              <div style={{
                                height: '100%',
                                opacity: item.isInStock ? 1 : 0.5
                              }}>
                                <img src={item.url} alt={item.name} />
                              </div>
                              <div
                                style={{
                                  opacity: item.isInStock ? 1 : 0.5
                                }}
                                className={'footer'}>
                                <p>{item.name}</p>
                                <p>
                                  <b>
                                    Ksh. {formatNumberWithCommas(item.price)}
                                  </b>
                                </p>
                              </div>
                            </ProductItem>

                          )) : (
                            <EmptyState
                              style={{
                                width: '100%',
                              }}
                              icon={GrimacingEmoji}
                              iconWidth={52}
                              centerAlign={true}
                              title={'There\'s Nothing to see here.'}
                              message={'No products match that query. Try something else'}
                            />
                          )

                        }
                      </div>
                    </div>

                  </div>

                </div>
                :
                <div>
                  <Loading minor />
                </div>
            }


          </div>
        </Container>
      </Section>

    </Layout>
  );
}

const BrandHeader = styled.header`
  margin-top: 30px;
  margin-bottom: 40px;
  h1, h2 {
    text-transform: capitalize;
    color: #353535;
  }

  p {
    color: #353535;
  }
`;

export const ProductItem = styled(Link)`
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  min-width: 200px;
  margin-right: 8px;

  &:hover {
    cursor:pointer;
    transform: translateY(-4px);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-width: 250px;
    margin: 0 auto;
    display: block;
  }

  header {
    height: 198px;
    background:#f6f6f6;
    display: grid;
    align-items: center;
  }

  .footer {

    p {
      color: #353535;
      font-size: .9rem;
    }
  }
`;

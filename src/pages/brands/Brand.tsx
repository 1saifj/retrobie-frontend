import React from 'react';
import Layout from '../../components/Layout';
import ProductFilters from './components/product-filters';
import styled from 'styled-components';
import Loading from '../../components/loading';
import {Container, Section} from 'bloomer';
import {useAuth} from '../../network';
import {capitalize, formatNumberWithCommas} from '../../helpers';
import {Link} from 'react-router-dom';
import useSWR from 'swr/esm/use-swr';
import {BrandType, FilteredProduct} from '../../types';
import useFiltersV2 from '../../hooks/useFiltersV2';
import {Clown, GrimacingEmoji} from '../../constants/icons';
import {EmptyState} from '../../components';
import SEOHeader from '../../components/SEOHeader';

export default function ViewSingleBrand(props) {

  const brandNameOrId = props.match.params.brand;

  const api = useAuth();
  const brandFetcher = (url, name)=> api.brands.getSingle(name).then(({data})=> data);
  const {data: brandData, error: fetchBrandError} = useSWR<BrandType>(
    ['/brands/:id', brandNameOrId],
    brandFetcher
  );

  const {products: renderProducts} = useFiltersV2();

  const filteredProductsFetcher = (url, name) => api.brands.getFilteredProducts(name).then(({data})=> data);
  const {data: allProducts, error: fetchProductsError} = useSWR<FilteredProduct[]>([
    brandData ? `/brands/${brandData.name}/products/filtered` : undefined,
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
        title={`${brandData.name} shoes`}/>
      <Section>
        <Container>
          <div>
            {
              brandData ?
                <div>
                  <BrandHeader>
                    <div
                      style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                      <div>
                        <img style={{borderRadius: "4px"}}
                             src={brandData.logo?.thumbnailUrl}
                             alt={brandData.name}/>
                      </div>

                      <div style={{marginRight: '64px', maxWidth: '70%'}}>
                        <h1>About {brandData.name}</h1>
                        <p>
                          {brandData.description.long}
                        </p>
                      </div>
                    </div>
                    <hr/>
                  </BrandHeader>
                  <div style={{
                    display: 'flex',
                    gap: 64,
                    flexWrap: 'wrap',
                  }}>

                    <ProductFilters
                      products={allProducts}
                      allCriteria={['sex', 'size', 'price', 'style']}
                    />
                    <div style={{
                      width: '100%',
                      flex: '1 0',
                    }}>
                      <div style={{
                        display: 'grid',
                        columnGap: 24,
                        rowGap: 72,
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        justifyContent: renderProducts?.length < 3 ?'start': 'space-between',
                      }}
                      >
                        {
                          renderProducts?.length ? renderProducts?.map((item, index) => (
                            <ProductItem
                              key={String(index)}
                              to={`/brands/${brandNameOrId}/${item.slug}`}
                              style={{
                                flex: '0 1 200px',
                                maxHeight: 250,
                                background: '#f5f5f5',
                              }}>

                              <div style={{height: '100%'}}>
                                <img src={item.url} alt={item.name}/>
                              </div>
                              <div className={'footer'}>
                                <p>{item.name}</p>
                                <p>
                                  <b>
                                    Ksh. {formatNumberWithCommas(item.price)}
                                  </b>
                                </p>
                              </div>
                            </ProductItem>

                          )): (
                            <EmptyState
                              style={{
                                width: '100%'
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
                  <Loading minor/>
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
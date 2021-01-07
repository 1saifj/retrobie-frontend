import React, {useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import BrandsFilters from './components/brand-filters';
import styled from 'styled-components';
import Loading from '../../components/loading';
import {Container, Section} from 'bloomer';
import {useAuth} from '../../network';
import {formatNumberWithCommas} from '../../helpers';
import {Link} from 'react-router-dom';
import useSWR from 'swr/esm/use-swr';
import {BrandType, ProductType} from '../../types';
import {useFilters} from '../../hooks';

export default function ViewSingleBrand(props) {

  const brandNameOrId = props.match.params.brand;

  const api = useAuth();
  const brandFetcher = (url, name)=> api.brands.getSingle(name).then(({data})=> data);
  const {data: brandData} = useSWR<BrandType>(['/brands/:id', brandNameOrId], brandFetcher);

  const {products: renderProducts} = useFilters();

  const allProductsFetcher = (url, name) => api.brands.getProducts(name).then(({data})=> data);
  const {data: allProducts} = useSWR<ProductType[]>([
    brandData ? `/products/all/${brandData.name}`: undefined,
    brandNameOrId
  ], allProductsFetcher)

  if (!allProducts) {
    return (
      <Loading/>
    )
  }

  return (
    <Layout>
      <Section>
        <Container>
          <div>
            {
              brandData ?
                <div>
                  <BrandHeader>
                    <div
                      style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                      <div style={{marginRight: '64px', marginLeft: '220px', maxWidth: '70%'}}>
                        <h1>About {brandData.name}</h1>
                        <p>
                          {brandData.description.long}
                        </p>
                      </div>
                      {/*<div>*/}
                      {/*    <img style={{width: "200px", borderRadius: "6px"}}*/}
                      {/*         src={brandData.featuredImage?.thumbnailUrl}*/}
                      {/*         alt={brandData.name}/>*/}
                      {/*</div>*/}
                    </div>
                    <hr/>
                  </BrandHeader>
                  <div style={{display: 'flex', gap: 64}}>

                    <BrandsFilters
                      products={allProducts}
                      allCriteria={['sex', 'size', 'price', 'style']}
                    />
                    <div>
                      <div style={{
                        display: 'flex',
                        columnGap: 24,
                      }}
                      >
                        {
                          renderProducts.map((item, index) => (
                            <ProductItem
                              key={String(index)}
                              to={`/brands/${brandNameOrId}/${item.uuid}`}
                              style={{
                                flex: '0 1 200px',
                                maxHeight: 250,
                                background: '#f5f5f5',
                              }}>

                              <div style={{height: '100%'}}>
                                <img src={item.images[0].url}/>
                              </div>
                              <div className={'footer'}>
                                <p>{item.name}</p>
                                <p>
                                  <b>
                                    Ksh. {formatNumberWithCommas(item.originalPrice)}
                                  </b>
                                </p>
                              </div>
                            </ProductItem>

                          ))

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

const ProductItem = styled(Link)`
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
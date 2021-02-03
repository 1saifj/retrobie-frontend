import React from 'react';
import {EmptyState, Layout, Loading} from '../../components';
import {useAuth} from '../../hooks';
import useSWR from 'swr/esm/use-swr';
import ProductFilters from '../brands/components/product-filters';
import {CategoryType, FilteredProduct} from '../../types';
import {useFiltersV2} from '../../hooks/useFiltersV2/FilterProvider';
import {formatNumberWithCommas} from '../../helpers';
import {ProductItem} from '../brands/Brand';
import { Section, Container } from 'bloomer';
import {EmptyBox, GrimacingEmoji} from '../../constants/icons';


export default function({match}){

  const categoryId = match.params.id;

  const api = useAuth();

  const {products: renderProducts} = useFiltersV2();

  const categoryFetcher = (url,  id) => api.category.getOne(id).then(({data}) => {
    const ret: CategoryType = data;

    // @ts-ignore
    ret.products = ret.products.map(item=> {
      return {
        uuid: item.uuid,
        slug: item.slug,
        name: item.name,
        price: item.originalPrice,
        sex: item.detail.sex,
        size: item.detail.size,
        condition: item.meta.condition,
        style: item.meta.style,
        url: item.images[0].url,
        thumbnailUrl: item.images[0].thumbnailUrl,
      }
    })
    return ret;
  });
  const {data: categoryData, error} = useSWR<CategoryType>([`/category/${categoryId}`, categoryId], categoryFetcher)

  if (error) {
    return (
      <div>
        <p>
          An error occurred
        </p>
      </div>
    )
  }

  if (!categoryData) {
    return (
      <Loading/>
    )
  }

  if (!categoryData.products?.length) {
    return (
      <Layout>
        <EmptyState
          icon={EmptyBox}
          iconWidth={52}
          centerAlign={true}
          title={'There\'s Nothing to see here.'}
          message={'No products have been uploaded to this category yet. Check back again later!'}
        />
      </Layout>
    );
  }


  return (
    <Layout>
      <Section>
        <Container>
          <div style={{display: 'flex', gap: 64}}>

            <ProductFilters
              // @ts-ignore
              products={categoryData.products}
              allCriteria={['sex', 'size', 'price']}
            />
            <div style={{
              display: 'flex',
              columnGap: 24,
              justifyContent: renderProducts?.length < 3 ?'start': 'space-between',
              flexWrap: 'wrap'
            }}
            >
              {
                renderProducts?.length ? renderProducts.map((item, index) => (
                  <ProductItem
                    key={String(index)}
                    to={`/product/${item.slug}/`}
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
                    icon={GrimacingEmoji}
                    style={{
                      width: '100%'
                    }}
                    iconWidth={52}
                    centerAlign={true}
                    title={'There\'s Nothing to see here.'}
                    message={'No match that query. Try something else'}
                  />
                )

              }
            </div>

          </div>
        </Container>
      </Section>
    </Layout>
  );
}
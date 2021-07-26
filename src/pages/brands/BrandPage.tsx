import React from 'react';
import Layout from '../../components/Layout';
import styled from 'styled-components';
import Loading from '../../components/loading';
import {Container} from 'bloomer';
import {capitalize} from '../../helpers';
import useSWR from 'swr/esm/use-swr';
import {BrandType, FilteredProduct} from '../../types';
import useFiltersV2 from '../../hooks/useFiltersV2';
import {Clown, GrimacingEmoji} from '../../constants/icons';
import {EmptyState} from '../../components';
import SEOHeader from '../../components/SEOHeader';
import useFetchers from '../../hooks/useFetchers/useFetchers';
import BrandPageHeaderComponent from './components/BrandPageHeaderComponent';
import { DesktopFilter, MobileFilter } from '../../components/filters/Filters';
import FilterItems from '../../components/filters/FilterItems';

function BrandPage(props) {

  const brandNameOrId = props.match.params.brand;

  const {brandsFetcher, productsFetcher} = useFetchers();

  const {data: brandData, error: fetchBrandError} = useSWR<BrandType>(
    [`/brands/${brandNameOrId}`, brandNameOrId],
    brandsFetcher.getOne,
  );

  const {products: renderProducts} = useFiltersV2();

  const {data: brandProducts, error: fetchProductsError} = useSWR<FilteredProduct[]>([
    brandData?.name ? `/brands/${brandData.name}/products/filtered` : undefined,
    brandData?.name,
  ], productsFetcher.getFilteredProducts);


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

  if (!brandProducts || !brandData) {
    return (
      <Loading/>
    )
  }

  if (!brandProducts.length){
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
      <BrandPageParent>
        <Container>
          <div>
            <div className="brand__header">
              <BrandPageHeaderComponent brand={brandData}/>
            </div>
            <div className='product__filters'>
              <div className='product__filters--desktop'>
                <DesktopFilter
                  //@ts-ignore
                  products={brandProducts}
                  criteria={['sex', 'size', 'originalPrice', 'style']} />
              </div>
              <div className='product__filters--mobile'>
                <MobileFilter
                  //@ts-ignore
                  products={brandProducts}/>
              </div>
              <div className='product__filters--products-parent'>
                <FilterItems products={renderProducts}/>
              </div>
            </div>
          </div>
        </Container>
      </BrandPageParent>

    </Layout>
  );
}

export default BrandPage;

const BrandPageParent = styled(Container)`
.product__filters {
  display: flex;
  gap: 64px;
  flex-wrap: wrap;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    gap: 32px;
  }

  .product__filters--desktop {
    @media screen and (max-width: 800px) {
      display: none;
    }
  }

  .product__filters--mobile {
    display: none;
    @media screen and (max-width: 800px) {
      display: block;
    }
  }

  .product__filters--products-parent {
    width: 100%;
    flex: 1 0;
    min-height: 100vh;

    & > div {
      display: grid;
      column-gap: 24px;
      row-gap: 72px;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      justify-content: space-between;
    }
  }
}
`

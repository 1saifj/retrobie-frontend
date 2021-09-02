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
import BrandProductsFilter from './components/BrandProductsFilter';

function BrandProductsPage(props) {

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
              <BrandPageHeaderComponent brand={brandData} />
            </div>
            <div className='product__filters'>
              <BrandProductsFilter brandName={brandData.name} />
              <div >
                <FilterItems products={renderProducts} />
              </div>
            </div>
          </div>
        </Container>
      </BrandPageParent>

    </Layout>
  );
}

export default BrandProductsPage;

const BrandPageParent = styled(Container)`
`

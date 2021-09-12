import React from 'react';
import Layout from '../../components/Layout';
import styled from 'styled-components';
import Loading from '../../components/loading';
import {Container} from 'bloomer';
import {capitalize} from '../../helpers';
import useSWR from 'swr/esm/use-swr';
import {BrandType, FilteredProduct, ProductType} from '../../types';
import {Clown, GrimacingEmoji} from '../../constants/icons';
import {EmptyState} from '../../components';
import SEOHeader from '../../components/SEOHeader';
import useFetchers from '../../hooks/useFetchers/useFetchers';
import BrandPageHeaderComponent from './components/BrandPageHeaderComponent';
import {Filters} from '../../components/filters/Filters';
import FilterItems from '../../components/filters/FilterItems';

function BrandProductsPage(props) {

  const brandSlug = props.match.params.brand;

  const {brandsFetcher, productsFetcher} = useFetchers();

  const {data: brandData, error: fetchBrandError} = useSWR<BrandType>(
    [`/brands/${brandSlug}`, brandSlug],
    brandsFetcher.getOne,
  );

  const {data: brandProducts, error: fetchProductsError} = useSWR(brandData?.slug ? [
    `/brands/${brandData.slug}/products/filtered`,
    brandData?.slug,
  ] : undefined, productsFetcher.getFilteredProducts);

  if (fetchBrandError) {
    return (
      <Layout>
        <EmptyState
          icon={Clown}
          title={'Looks like clowns took over our servers.'}
          message={'It\'s not you it\'s us. We\'re working on it.'}
        />
      </Layout>
    );
  }

  if (!brandData || !brandProducts) {
    return (
      <Loading />
    );
  }

  if (!brandProducts?.length) {
    return (
      <Layout>
        <EmptyState
          icon={GrimacingEmoji}
          iconWidth={52}
          centerAlign={true}
          title={`Oops. We haven't uploaded any ${capitalize(brandData.name)} shoes yet.`}
          message={'We\'re working on it! Check back soon!'}
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
            <BrandPageHeaderComponent brand={brandData} />
            <Filters products={brandProducts}>
              {
                filteredProducts => (
                  <FilterItems products={filteredProducts} />
                )
              }
            </Filters>
          </div>
        </Container>
      </BrandPageParent>

    </Layout>
  );
}

export default BrandProductsPage;

const BrandPageParent = styled(Container)`
`

import React from 'react';
import {EmptyState, Layout, Loading} from '../../components';
import useSWR from 'swr/esm/use-swr';
import {CategoryType, FilteredProduct, ProductType} from '../../types';
import {useFiltersV2} from '../../hooks/useFiltersV2/FilterProvider';
import {Container} from 'bloomer';
import {DeadEyes2, EmptyBox} from '../../constants/icons';
import SEOHeader from '../../components/SEOHeader';
import useFetchers from '../../hooks/useFetchers/useFetchers';
import {Filters} from '../../components/filters/Filters';
import styled from 'styled-components';
import FilterItems from '../../components/filters/FilterItems';


const CategoryPage = function({match}) {

  const categorySlug = match.params.id;

  const {categoriesFetcher} = useFetchers();

  const {data: categoryData, error: fetchCategoryError} = useSWR<CategoryType>(
    [`/category/${categorySlug}`, categorySlug],
    categoriesFetcher.getOne,
  );

  const {data: categoryProducts, error: fetchCategoryProductsError} = useSWR<ProductType[]>(
    categoryData ? [`/category/${categoryData.slug}/products`, categoryData.slug] : null,
    categoriesFetcher.getProducts,
  );

  if (fetchCategoryError || fetchCategoryProductsError) {
    return (
      <Layout>
        <EmptyState
          icon={DeadEyes2}
          title={`Oof. That's an error`}
          message={`Something went wrong. We're working on it as you read this.`}
        />
      </Layout>
    );
  }

  if (!categoryData || !categoryProducts) {
    return (
      <Loading />
    );
  }

  if (!categoryProducts.length) {
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
      <SEOHeader
        description={categoryData.description?.seo}
        path={`/category/${categoryData.slug}`}
        title={`${categoryData.name} in Nairobi`} />
      <div>
        <Container>
          <header>
            <h1>
              {categoryData.name}
            </h1>
          </header>
          <Filters products={categoryProducts}>
            {
              filteredProducts =>
                <FilterItems products={filteredProducts} />
            }
          </Filters>
        </Container>
      </div>
    </Layout>
  );
};

export default CategoryPage;

const CategoryPageParent = styled(Container)`
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
      padding: 0 1rem;
}
  }
}


`

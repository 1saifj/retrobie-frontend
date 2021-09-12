import React, {useState} from 'react';
import {capitalize, formatNumberWithCommas} from '../../../helpers';
import qs from 'qs';
import styled from 'styled-components';
import {useApi} from '../../../hooks';
import useSWR from 'swr/esm/use-swr';
import Layout from '../../../components/Layout';
import {EmptyState} from '../../../components';
import useBrandFilters from '../../../hooks/useFiltersV3/useBrandFilters';
import DrawerWrapper from 'rc-drawer';
import {Button, Container, Section} from 'bloomer';

interface ProductFiltersProps {
  slug: string
  children?: any
}

/**
 * In order to work, this component requires an array of criteria and an array of
 * products.
 *
 * @param props
 * @param {string[]} props.allCriteria - a list of criteria to be used for filtering.
 * These should be the same as the set of keys in the {@link ProductType} object.
 * @param {ProductType[]} props.products - a list of products to be filtered through
 */
const BrandProductsFilter =  function(props: ProductFiltersProps) {

  const {slug} = props;

  const api = useApi();

  const {fetchFilteredProducts} = useBrandFilters({slug});

  const criteriaFetcher = (url) => api.get(url).then(({data}) => data);
  const {data: brandProductsFilters, error: fetchBrandProductsError} = useSWR<Array<{label: string, key: string, values: string[]}>>(
    [`/brands/${slug}/filters`, slug],
    criteriaFetcher,
  )

  if (!brandProductsFilters?.length) {
    return (
      <>
        <div>No criteria provided.</div>
      </>
    );
  }

  if (fetchBrandProductsError){
    return (
      <Layout>
        <EmptyState message={'Hmm...'} title={'Thunketh'}/>
      </Layout>
    )
  }

  return (
    <BrandProductsFilterParent>
      <div className='product__filters'>
        <div className='product__filters--desktop'>
          <div style={{maxWidth: 200}}>
            <h4>Filters</h4>
            {
              brandProductsFilters.map((filter, index) => (
                <div key={String(index)}>
                  <h4>
                    {
                      capitalize(filter.label)
                    }
                  </h4>
                  <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                    {
                      // loop through the list of criteria
                      filter.values.map((filterValue, index) => (
                        <FilterItem
                          applied={(() => {
                            const params = qs.parse(window.location.search, {
                              ignoreQueryPrefix: true,
                            });
                            return String(filterValue) === String(params[filter.key]);
                          })()}
                          onClick={() => fetchFilteredProducts()}
                          key={String(index)}>
                          <p>
                            {
                              typeof filterValue === 'string' ?
                                capitalize(filterValue) :
                                formatNumberWithCommas(filterValue)
                            }
                          </p>
                        </FilterItem>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>

          <div className='product__filters--mobile'>
            <MobileFilter slug={slug} />
          </div>

        </div>
      </div>
    </BrandProductsFilterParent>
  );
};

export default BrandProductsFilter;


export const MobileFilter = function(props: {
  slug: string
}){

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
      <DrawerWrapper
        onClose={() => setDrawerOpen(false)}
        handler={null}
        open={isDrawerOpen}>
        <Section>
          <Container>
            <BrandProductsFilter slug={props.slug} />
          </Container>
        </Section>
      </DrawerWrapper>
      <Button
        onClick={() => setDrawerOpen(true)}
        style={{marginRight: 12}}>
        Filters
      </Button>
    </div>
  )
}

const FilterItem = styled.div<{applied?: boolean}>`
  border: 1px solid ${p => p.applied ? 'var(--color-primary)' : 'var(--color-border-gray)'};
  padding: 10px 8px 8px;
  border-radius: 2px;
  width: max-content;
  transition: all 0.25s ease-in-out;
  flex: 0 1 auto;
  
  p {
    margin: 0;
    font-size: .9rem;
  }
  
  &:hover {
    cursor: pointer;
    border: 1px solid var(--color-border-lightgray);
  }
`;

const BrandProductsFilterParent = styled.div`
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
      row-gap: 6rem;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      justify-content: space-between;
    }
  }
}

`

import {FilteredProduct, ProductType} from '../../types';
import React, {ReactNode, useEffect, useState} from 'react';
import DrawerWrapper from 'rc-drawer';
import {Button, Container, Section} from 'bloomer';
import useFiltersV2 from '../../hooks/useFiltersV2';
import {capitalize, formatNumberWithCommas} from '../../helpers';
import qs from 'qs';
import styled from 'styled-components';

interface FiltersParams {
  children: (filteredProducts: FilteredProduct[]) => React.ReactNode;
  products?: ProductType[]
}

export const Filters = (props: FiltersParams) => {

  const {products: allProducts} = props;

  const {products: filteredProducts, setAllProducts} = useFiltersV2();

  useEffect(() => {
    // @ts-ignore
    setAllProducts(allProducts);

  }, [allProducts]);

  console.log('Filtered products: ', filteredProducts);

  return (
    <>
      <FiltersParent>
        <div className={'product__filters'}>
          {/*<DesktopFilter*/}
          {/*  products={products}*/}
          {/*  criteria={['sex', 'size', 'price']}*/}
          {/*/>*/}

          {/*<MobileFilter*/}
          {/*  products={products} />*/}

          {props.children(filteredProducts)}
        </div>
      </FiltersParent>
    </>
  );
};

export const MobileFilter = function(props: {
  products: Array<ProductType>
}) {

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={'product__filters--mobile'}>
      <div>
        <DrawerWrapper
          onClose={() => setDrawerOpen(false)}
          handler={null}
          open={isDrawerOpen}>
          <Section>
            <Container>
              <BrandProductsFilter
                //@ts-ignore
                products={props.products}
                allCriteria={['sex', 'size', 'price']}
              />
            </Container>
          </Section>
        </DrawerWrapper>
        <Button
          onClick={() => setDrawerOpen(true)}
          style={{marginRight: 12}}>
          Filters
        </Button>
      </div>

    </div>
  );
}

export const DesktopFilter = function(props: {
  products: Array<ProductType>,
  criteria: Array<string>
}){

  return (
    <div className={'product__filters--desktop'}>
      <BrandProductsFilter
        // @ts-ignore
        products={props.products}
        allCriteria={props.criteria}
      />
    </div>
  );
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
const BrandProductsFilter =  function({allCriteria, products}: {allCriteria: Array<string>, products: FilteredProduct[]}) {

  const {
    setAllCriteria,
    filterByCriteria,
    criteriaValues: criteriaMap,
    setAllProducts,
  } = useFiltersV2();

  const criteriaLength = allCriteria.length;

  useEffect(() => {
    // if criteria has been provided in props
      if (allCriteria?.length) {
        // set it to state
        setAllCriteria(allCriteria)
      }
    },
    // if the length of the criteria props changes, re-render this component.
    // a bit hacky, but it renders forever otherwise
    [criteriaLength]
  );

  useEffect(() => {
    if (products) {
      setAllProducts(products);
    }
  }, [products]);

  if (!allCriteria?.length) {
    return (
      <>
        <div>No criteria provided.</div>
      </>
    );
  }

  return (
    <>
      <div>
        <div style={{maxWidth: 200}}>
          <h4>Filters</h4>
          {
            Array.from(criteriaMap.keys()).map((criteriaKey, index) => (
              <div key={String(index)}>
                <h4>
                  {
                    capitalize(criteriaKey)
                  }
                </h4>
                <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                  {
                    // loop through the list of criteria
                    Array.from(criteriaMap.get(criteriaKey).keys())?.map((criteriaValue, index) => (
                      <FilterItem
                        applied={(() => {
                          const params = qs.parse(window.location.search, {
                            ignoreQueryPrefix: true,
                          });
                          return String(criteriaValue) === String(params[criteriaKey]);
                        })()}
                        onClick={() => filterByCriteria(criteriaKey, criteriaValue)}
                        key={String(index)}>
                        <p>
                          {
                            typeof criteriaValue === 'string' ?
                              capitalize(criteriaValue) :
                              formatNumberWithCommas(criteriaValue)
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
      </div>
    </>
  );
};

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

const FiltersParent = styled(Container)`
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


`;


import React, {useEffect} from 'react';
import {capitalize, formatNumberWithCommas} from '../../../helpers';
import styled from 'styled-components';
import qs from 'qs';
import {FilteredProduct, ProductType} from '../../../types';
import useFiltersV2 from '../../../hooks/useFiltersV2';

/**
 * In order to work, this component requires an array of criteria and an array of
 * products.
 *
 * @param props
 * @param {string[]} props.allCriteria - a list of criteria to be used for filtering.
 * These should be the same as the set of keys in the {@link ProductType} object.
 * @param {ProductType[]} props.products - a list of products to be filtered through
 */
export default function(
  {
    allCriteria,
    products,
  }: {
    allCriteria: Array<string>,
    products: FilteredProduct[]
  }) {

  const {
    setAllCriteria,
    filterByCriteria,
    criteriaValues: criteriaMap,
    setAllProducts,
  } = useFiltersV2();

  const criteriaLength = allCriteria.length;

  useEffect(() => {
    if (allCriteria?.length) {
      setAllCriteria(allCriteria)
    }
  },
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
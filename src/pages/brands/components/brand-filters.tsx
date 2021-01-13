import React, {useEffect} from 'react';
import {capitalize} from '../../../helpers';
import styled from 'styled-components';
import qs from 'qs';
import {ProductType} from '../../../types';
import useFiltersV2 from '../../../hooks/useFiltersV2';

export default function (
  {
    allCriteria,
    products
  }: {
  allCriteria: string[],
    products: ProductType[]
}) {

  const {
    setAllCriteria,
    filterByCriteria,
    criteriaValues,
    setAllProducts
  } = useFiltersV2();

  useEffect(() => {
    setAllCriteria(allCriteria);
  }, []);

  useEffect(()=> {
    if (products) {
      setAllProducts(products);
    }
  }, [products])

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
        <div>
          <h4>Filters</h4>
          {
            Object.keys(criteriaValues).map((criteriaKey, index)=> (
              <div key={String(index)}>
                <h4>
                  {capitalize(criteriaKey)}
                </h4>
                <div style={{display: 'flex', columnGap: 8}}>
                  {
                    criteriaValues[criteriaKey]?.map((criteriaValue, index)=> (
                      <FilterItem
                        applied={()=> {
                          const params = qs.parse(window.location.search, {
                            ignoreQueryPrefix: true
                          });
                          return String(criteriaValue) === String(params[criteriaKey]);
                        }}
                        onClick={()=> filterByCriteria(criteriaKey, criteriaValue)}
                        key={String(index)}>
                        <p>
                          {typeof criteriaValue === "string" ? capitalize(criteriaValue) : criteriaValue}
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
}

const FilterItem = styled.div`
  border: 1px solid ${p => p.applied() ? 'var(--color-primary)' : 'var(--color-border-gray)'};
  padding: 10px 8px 8px;
  border-radius: 2px;
  width: max-content;
  transition: all 0.25s ease-in-out;
  
  p {
    margin: 0;
    font-size: .9rem;
  }
  
  &:hover {
    cursor: pointer;
    border: 1px solid var(--color-border-lightgray);
  }
`;
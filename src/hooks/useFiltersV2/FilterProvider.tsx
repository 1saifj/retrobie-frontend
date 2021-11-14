import React, { useContext, useEffect, useState} from 'react';
import {FilteredProduct} from '../../types';
import qs from 'qs';
import useFilterContext from './useFilterContext';
import {useLocation} from '@reach/router';


export default function ProvideFilters({children}) {
  const FilterContext = useFilterContext();

  const filters = useProvideFilters();
  return (
    <FilterContext.Provider value={filters}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFiltersV2(): {
  setAllProducts: (products: Array<FilteredProduct>)=> void,
  setAllCriteria: (criteria: Array<string>) => void,
  filterByCriteria: Function,
  criteriaValues: Map<string, Set<string | number>>,
  products: Array<FilteredProduct>,
} {
  return useContext(useFilterContext());
}



function useProvideFilters() {

  const [transformedProducts, setTransformedProducts] = useState<Array<FilteredProduct>>([]);

  const [allProducts, setAllProducts] = useState<Array<FilteredProduct>>(null);

  const [filteredProducts, setFilteredProducts] = useState<Array<FilteredProduct>>([]);

  const [criteriaValues, setCriteriaValues] = useState<Map<string, Set<string | number>>>(null);
  // a list of all the criteria to be applied
  const [allCriteria, setAllCriteria] = useState<Array<string>>([]);

  const location = useLocation();

  // this hook is called when allProducts or allCriteria change
  // i.e. when they are set (at any point)
  useEffect(() => {
    const newCriteria = new Map<string, Set<string | number>>();

    // grab the criteria we need to sort by from each product
    // we need a list of flat products with only the required criteria
    // it's a lot easier to work with
    const cloned = allProducts?.map(product => {

      const newP = product;

      // for the provided list of criteria,
      // loop through each entry
      allCriteria.forEach(crit => {

        // and check if the criteria object
        // already contains a set of values

        // if it doesn't
        if (!newCriteria.has(crit)) {
          // create a new set for it
          // and add the current value
          newCriteria.set(crit, new Set<string | number>().add(newP[crit]));
        } else {
          // if it does, add the new value to the existing set
          newCriteria.get(crit).add(newP[crit]);
        }

        // and sort the entries
        Array.from(newCriteria.entries()).forEach(([key, set]) => {
          const arr = Array.from(set).sort();
          newCriteria.set(key, new Set<string | number>(arr));
        });
      });

      return newP;
    });

    setTransformedProducts(cloned);

    setCriteriaValues(newCriteria);

  }, [allProducts, allCriteria]);

  useEffect(() => {
    filterChangedProducts();
  }, [transformedProducts]);

  function alterUrlParams(newCriteria: string, value: any): void {

    const appliedCriteria = qs.parse(location.search, {ignoreQueryPrefix: true});

    // @ts-ignore
    const appliedParams = new URLSearchParams(appliedCriteria);

    // if this param is already applied
    if (appliedParams.get(newCriteria) !== null && appliedParams.get(newCriteria) === String(value)) {
      appliedParams.delete(newCriteria);
    } else {
      appliedParams.set(newCriteria, value);
    }

    const url = `${location.pathname}?${appliedParams.toString()}`;

    window.history.pushState({}, "", url);

    // the url params have changed, so we have to parse them again
    // const newParamCriteria = qs.parse(location.search, {ignoreQueryPrefix: true});
    // if no criteria has been applied
    // if (!Object.keys(newParamCriteria).length){
    //   // return all the products
    //   setFilteredProducts(allProducts)
    //   return allProducts;
    // }
    // find any products that match the provided criteria
    // const transformed =  transformedProducts.filter((product) => product[newCriteria] === value);
    // if no products match, return an empty array
    // if (!transformed.length) {
    //   setFilteredProducts([])
    //   return [];
    // }
    // and map the transformed products back to their full types
    // const filteredProducts = transformed.map(product => allProducts.find(item => item.uuid === product.uuid));
    // setFilteredProducts(filteredProducts);
    // return filteredProducts;
  }

  function filterByCriteria(criteria: string, value) {
    // first, change the url params
    alterUrlParams(criteria, value);
    filterChangedProducts();
  }

  function filterChangedProducts() {
    // then parse them again
    const qsParams = qs.parse(location.search, {ignoreQueryPrefix: true});

    // and check if there are any criteria selected
    if (qsParams && Object.keys(qsParams).length) {

      // if so, filter the list of simplified products
      if (transformedProducts){
        const filtered = transformedProducts.filter(product => {

          // and check if every value in the search params
          // matches the values in the product object
          return Object.keys(qsParams).every(key => {
            // ps: make sure to cast the product value to string since some
            // values will be numbers e.g. price
            return String(product[key]) === qsParams[key];
          });
          // and map the resulting array, searching for matching products
        }).map(filteredProduct => allProducts.find(product => product.uuid === filteredProduct.uuid))
          .sort((a, b) => {

            if (a.isInStock && !b.isInStock) return -1;

            if (a.isInStock && b.isInStock) {
              if (a.name < b.name) return -1;

              if (a.name > b.name) return 1;

              return 0;
            }

            return 1;
          });
        setFilteredProducts(filtered)
      }else
        setFilteredProducts([]);
    } else {
      allProducts?.sort((a, b) => {

        if (a.isInStock && !b.isInStock) return -1

        if (a.isInStock && b.isInStock){
          if (a.name < b.name) return -1;

          if (a.name > b.name) return 1;

          return 0;
        }

        return 1
      });
      // if no criteria are selected,
      // reset the filters
      setFilteredProducts(allProducts)
    }
  }

  return {
    setAllProducts,
    setAllCriteria,
    filterByCriteria,
    criteriaValues,
    products: filteredProducts
  }
}

import React, {createContext, useContext, useEffect, useState} from 'react';
import {ProductType} from '../../types';
import qs from 'qs';

const filterContext = createContext(null);


export default function ProvideFilters({children}) {
  const filters = useProvideFilters();
  return (
    <filterContext.Provider value={filters}>
      {children}
    </filterContext.Provider>
  );
}

export function useFilters(): {
  setAllProducts: (products: Array<ProductType>)=> void,
  setAllCriteria: (criteria: Array<string>) => void,
  filterByCriteria: Function,
  criteriaValues: any,
  products: Array<ProductType>,
} {
  return useContext(filterContext);
}

type FilteredProduct = {
  price: number,
  sex: "M" | "F",
  size: number,
  sizeCountry: string,
  style: string,
  condition: string,
  uuid: string
}

function useProvideFilters() {

  const [transformedProducts, setTransformedProducts] = useState<Array<FilteredProduct>>([]);

  const [allProducts, setAllProducts] = useState<Array<ProductType>>([]);

  const [filteredProducts, setFilteredProducts] = useState<Array<ProductType>>([]);

  const [criteriaValues, setCriteriaValues] = useState({});
  // a list of all the criteria to be applied
  const [allCriteria, setAllCriteria] = useState<Array<string>>([]);

  // this hook is called when allProducts or allCriteria change
  // i.e. when they are set (at any point)
  useEffect(() => {
    const newCriteria = {...criteriaValues};

    console.log("All criteria ", allCriteria)
    console.log('All products ', allProducts);

    // grab the criteria we need to sort by from each product
    // we need a list of flat products with only the required criteria
    // it's a lot easier to work with
    const cloned = allProducts?.map(product => {

      const newP = {
        price: product.originalPrice,
        sex: product.detail.sex,
        size: product.detail.size,
        sizeCountry: product.detail.sizeCountry,
        style: product.meta.style,
        condition: product.meta.condition,
        uuid: product.uuid
      }

      // for all provided criteria
      allCriteria.forEach(crit => {
        // if the criteria object doesn't exist
        if (!newCriteria[crit]) {
          // create a new set for it
          newCriteria[crit] = new Set();
        } else {
          // and if it does, convert it from an array to a set
          newCriteria[crit] = new Set(newCriteria[crit]);
        }

        //
        newCriteria[crit] = Array.from(newCriteria[crit].add(newP[crit]));
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

    const appliedCriteria = qs.parse(window.location.search, {ignoreQueryPrefix: true});

    // @ts-ignore
    const appliedParams = new URLSearchParams(appliedCriteria);

    // if this param is already applied
    if (appliedParams.get(newCriteria) !== null && appliedParams.get(newCriteria) === String(value)) {
      appliedParams.delete(newCriteria);
    } else {
      appliedParams.set(newCriteria, value);
    }

    const url = `${window.location.pathname}?${appliedParams.toString()}`;

    // window.history.pushState({}, "", url);

    // the url params have changed, so we have to parse them again
    // const newParamCriteria = qs.parse(window.location.search, {ignoreQueryPrefix: true});
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

  function filterByCriteria(criteria: 'size' | 'sex' | 'style', value) {
    // first, change the url params
    alterUrlParams(criteria, value);
    filterChangedProducts();
  }

  function filterChangedProducts() {
    // then parse them again
    const qsParams = qs.parse(window.location.search, {ignoreQueryPrefix: true});

    // and check if there are any criteria selected
    if (qsParams && Object.keys(qsParams).length) {

      // if so, filter the list of simplified products
      const filtered = transformedProducts.filter(product => {

        // and check if every value in the search params
        // matches the values in the product object
        return Object.keys(qsParams).every(key => {
          // ps: make sure to cast the product value to string since some
          // values will be numbers e.g. price
          return String(product[key]) === qsParams[key];
        });
        // and map the resulting array, searching for matching products
      }).map(filteredProduct => allProducts.find(product => product.uuid === filteredProduct.uuid));
      setFilteredProducts(filtered);
    } else {
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

import {useEffect, useState} from 'react';
import useApi from '../useApi/useApi';
import qs from 'qs';


function useBrandFilters({slug}) {

  const api = useApi();

  const [queryParamString, setQueryParamString] = useState<string>(null);
  const [loadingNewItems] = useState(false);

  const [, setFilteredProducts] = useState(null);

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    api.brands.getFilteredProducts({slug})
      .then(({data}) => setAllProducts(data));
  }, [slug])


  async function fetchFilteredProducts(params?){

    // the url params have changed, so we have to parse them again
    const newParamCriteria = qs.parse(window.location.search, {ignoreQueryPrefix: true});
    // if no criteria has been applied
    if (!Object.keys(newParamCriteria).length){
      // return all the products
      setFilteredProducts(allProducts)
      return allProducts;
    }

    // otherwise, fetch a list of products with the new criteria

    return await api.brands.getFilteredProducts({slug});

    // find any products that match the provided criteria
    // const transformed =  transformedProducts.filter((product) => product[queryToAddOrRemove] === value);
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

  /**
   * This method adds a key and value to the url params or
   * deletes a query key from the url params
   * @param queryToAddOrRemove - the query to add or remove
   * @param value - the value to set if adding a query param. Not required when
   *        deleting a value
   */
  async function alterUrlParams(queryToAddOrRemove: string, value?: string): Promise<any> {

    const appliedCriteria = qs.parse(window.location.search, {ignoreQueryPrefix: true});

    // @ts-ignore
    const appliedParams = new URLSearchParams(appliedCriteria);

    // if this param is already applied
    if (appliedParams.get(queryToAddOrRemove) !== null && appliedParams.get(queryToAddOrRemove) === String(value)) {
      // delete it from the query params
      appliedParams.delete(queryToAddOrRemove);
    } else {
      // if it's not applied, add it to the query params
      appliedParams.set(queryToAddOrRemove, value);
    }

    setQueryParamString(appliedParams.toString);
    const url = `${window.location.pathname}?${appliedParams.toString()}`;

    window.history.pushState({}, "", url);
    return await fetchFilteredProducts(appliedParams)
  }


  return {
    queryParamString,
    fetchFilteredProducts,
    loadingNewItems
  }
}

export default useBrandFilters;

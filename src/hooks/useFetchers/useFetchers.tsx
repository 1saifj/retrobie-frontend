import {useApi} from '../index';


const useFetchers = ()=> {
  const api = useApi();


  const brandsFetcher = {
    getOne: (url, slug) => api.brands.getBrandBySlug({slug}).then(({data}) => data),
  }


  const productsFetcher = {
    getFilteredProducts: (url, brandName) => api.brands.getFilteredProducts({brandName}).then(({data}) => data),
  };

  const cartsFetcher = {
    getOne: (url, id) => api.cart.getOne(id).then(({data}) => data)
  }

  const categoriesFetcher = {
    getOne: (url, slugOrUuid) => api.category.getOne(slugOrUuid).then(({data}) => data),
    getProducts: (url, categoryId) => api.category.getProducts(categoryId).then(({data}) => data),
  };

  const userFetchers = {
    userInfoFetcher: () => api.accounts.me().then(({data}) => data),
  }


  return {
    brandsFetcher ,
    cartsFetcher,
    categoriesFetcher,
    productsFetcher,
    userFetchers
  }
}

export default useFetchers;

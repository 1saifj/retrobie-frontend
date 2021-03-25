import React, {useEffect, useState} from 'react';
import {EmptyState} from '../../../components';
import PageNotFound from '../../../assets/images/icons/page-not-found.svg';
import {Button} from 'bloomer';
import CreateProductModal from '../products/modals/CreateProductModal';
import Loading from '../../../components/loading';
import {useAuth} from '../../../network';
import {useDispatch} from 'react-redux';
import useSWR from 'swr/esm/use-swr';


function BrandProducts({match}) {
  const api = useAuth();
  const dispatch = useDispatch();

  async function getBrand(id) {
    return await api.brands.get();
  }

  /*async function getSingleBrandProducts(id) {
    const {data} = await api.brand(id).getProducts();
    return data;
}*/

  const brandId = match.params.id;

  const thisBrandFetcher = () => api.brands.getBrandByUuid({uuid: brandId});

  const {data: thisBrand} = useSWR(`/brands/${brandId}`, thisBrandFetcher);
  const [isCreateBrandModalActive, setCreateBrandModalActive] = useState(false);


  return (
    <>
      <div>
        Brand Products
      </div>

      <div style={{background: 'white', height: '100%'}}>
        <EmptyState
          title="There's nothing here yet."
          icon={PageNotFound}
          style={{height: '80vh', display: 'grid', alignItems: 'center'}}
          message="Looks like this brand doesn't have any products uploaded yet."
          iconWidth={48}
          prompt={() => (
            <div>
              <CreateProductModal
                isActive={isCreateBrandModalActive}
                onClose={() => setCreateBrandModalActive(false)}
              />
              <Button style={{
                padding: 0,
                background: 'transparent',
                borderBottom: '1px solid grey',
              }} isColor="light" onClick={() => {
                setCreateBrandModalActive(true);
              }}>
                Upload a new product
              </Button>
            </div>
          )}
        />
      </div>
    </>
  );
}

export default BrandProducts;

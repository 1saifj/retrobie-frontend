import React, {useEffect, useState} from 'react';
import {EmptyState} from '../../../components';
import PageNotFound from '../../../assets/images/icons/page-not-found.svg';
import {Button} from 'bloomer';
import CreateProductModal from '../products/modals/CreateProductModal';
import Loading from '../../../components/loading';
import {useAuth} from '../../../network';
import {useDispatch} from 'react-redux';


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

  const [thisBrand, setThisBrand] = useState({});
  const brandId = match.params.id;
    //here, brandId is both the key passed for caching and the value passed to 'getBrand'
  useEffect(() => {
    dispatch(api.brands.getSingle(brandId))
      .then(({data})=> {
        setThisBrand(data);
      })
  }, []);


    const [isCreateBrandModalActive, setCreateBrandModalActive] = useState(false);

    return (
        <>
            <div>
                Brand Products
            </div>

            <div style={{background: 'white', height: "100%"}}>
                <EmptyState title="There's nothing here yet."
                            icon={PageNotFound}
                            style={{height: '80vh', display: 'grid', alignItems: 'center'}}
                            message="Looks like this brand doesn't have any products uploaded yet."
                            prompt={() => (
                                <div>
                                    <CreateProductModal isActive={isCreateBrandModalActive}
                                                        brand={thisBrand}
                                                        onClose={() => setCreateBrandModalActive(false)}
                                    />
                                    <Button style={{
                                        padding: 0,
                                        background: 'transparent',
                                        borderBottom: '1px solid grey'
                                    }} isColor="light" onClick={() => {
                                        setCreateBrandModalActive(true)
                                    }}>
                                        Upload a new product
                                    </Button>
                                </div>
                            )}
                />
            </div>
        </>
    )
}

export default BrandProducts;

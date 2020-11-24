import React, {useState} from 'react';
import EmptyState from '../../../components/empty/EmptyState';
import PageNotFound from '../../../assets/images/icons/page-not-found.svg';
import {Button} from 'bloomer';
import {useQuery} from 'react-query';
import CreateProductModal from './modals/CreateProductModal';
import Loading from '../../../components/loading';
import useApi from '../../../network/useApi';


function BrandProducts({match}) {
  const api = useApi();

  async function getBrand(id) {
    return await api.brands.get();
  }

  /*async function getSingleBrandProducts(id) {
    const {data} = await api.brand(id).getProducts();
    return data;
}*/

  const brandId = match.params.id;
    //here, brandId is both the key passed for caching and the value passed to 'getBrand'
    const {status, data, error} = useQuery([brandId, brandId], getBrand, {
        retry: 1
    });

    const thisBrand = data ? data.data : null;

    const [isCreateBrandModalActive, setCreateBrandModalActive] = useState(false);

    if (status === "loading") {
        return (
            <Loading message={false}/>
        )
    }

    if (error) {
        return (
            <div>
                An error occurred:
                <br/>
                <br/>
                {error.toString()}
            </div>
        );
    }


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

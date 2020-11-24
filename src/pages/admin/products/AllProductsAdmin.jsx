import React from 'react';
import {Link} from 'react-router-dom';
import Loading from '../../../components/loading';
import useApi from '../../../network/useApi';
import useSWR from 'swr';

export default function AllProducts() {
  const api = useApi();

  const {data: allProducts, error, loading} = useSWR(
    'get-all-products', api.products.getAll,
  );

    if (loading) {
        return (
            <div>
                <Loading minor={true} />
            </div>
        )
    }

    if (error) {
        console.log(error);
    }

    return (
        <>
            <div>
                <p>All products</p>
            </div>

            <div>
                {
                    allProducts?.data.all.length &&
                    <div>
                        {
                            allProducts.data.all.map(product => {
                                return (
                                    <div>
                                        <Link to={`single/${product.uuid}`}>
                                            <div style={{
                                                padding: "18px",
                                                border: "1px solid lightgrey",
                                                borderRadius: "4px"
                                            }}>
                                                <p>{product.name}</p>
                                            </div>
                                        </Link>

                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </>
    );

}
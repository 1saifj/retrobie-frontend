import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Loading from '../../../components/loading';
import {useAuth} from '../../../network';
import {useDispatch} from 'react-redux';
import useSWR from 'swr/esm/use-swr';

export default function AllProducts() {
  const api = useAuth();

  const allProductsFetcher = (url) => api.products.getAll().then(({data})=> data);
  const {data: allProducts} = useSWR('/products/all', allProductsFetcher);

    if (!allProducts) {
        return (
            <div>
                <Loading minor={true} />
            </div>
        )
    }

    return (
        <>
            <div>
                <p>All products</p>
            </div>

            <div>
              <div>
                {
                  allProducts.map(product => {
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
            </div>
        </>
    );

}
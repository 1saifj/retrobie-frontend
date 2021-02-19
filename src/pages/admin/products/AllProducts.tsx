import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Loading from '../../../components/loading';
import {useAuth} from '../../../network';
import useSWR from 'swr/esm/use-swr';
import {Input} from 'bloomer';
import {ProductType} from '../../../types';

export default function AllProducts() {
  const api = useAuth();

  const allProductsFetcher = () => api.products.getAll().then(({data}) => {
    return data.sort((a, b) => {
      if (a.name < b.name) return -1;

      if (a.name > b.name) return 1;

      return 0;
    });
  });
  const {data: allProducts} = useSWR<Array<ProductType>>('/products/all', allProductsFetcher);

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(()=> {
    setFilteredProducts(allProducts)
  }, [allProducts])

  if (!allProducts?.length) {
    return (
      <div>
        <Loading minor={true} />
      </div>
    );
  }

  const filterProductsByValue = (input: string)=> {
    if (!input) {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(item => {
          return item.name.toLowerCase().startsWith(input.toLowerCase())
            || item.name.toLowerCase().includes(input.toLowerCase());
        }),
      );
    }
  }

  return (
    <>
      <div>
        <h2>All products</h2>
      </div>

      <div style={{marginBottom: 12}}>
        <label>Filter products by name</label>
        <Input
          placeholder={"eg. Kobe, Lebron, etc."}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value;
            filterProductsByValue(input);
          }}>

        </Input>
      </div>

      <div>
        <div>
          {
            filteredProducts?.map(product => {
              return (
                <div>
                  <Link to={`${product.slug}`}>
                    <div style={{
                      padding: '18px',
                      marginBottom: 8,
                      border: '1px solid lightgrey',
                      borderRadius: '4px',
                    }}>
                      <p>{product.name}</p>
                    </div>
                  </Link>

                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
};
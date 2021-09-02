import {Button, Column, Columns, Input} from 'bloomer';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import {Loading} from '../../../components';
import {useApi} from '../../../hooks';
import {ProductTypeType} from '../../../types';

export default function ViewAllProductTypesPage(props) {
  const api = useApi();

  const productTypeFetcher = () =>
    api.productTypes.getAll().then(({data}) => {
      return data.sort((a, b) => {
        if (a.name < b.name) return -1;

        if (a.name > b.name) return 1;

        return 0;
      });
    });

  const {data: allProductTypes} = useSWR<Array<ProductTypeType>>(
    '/product-types/all',
    productTypeFetcher
  );

  const [filteredProductTypes, setFilteredProductTypes] = useState([]);

  useEffect(() => {
    setFilteredProductTypes(allProductTypes);
  }, [allProductTypes]);

  if (!allProductTypes?.length) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const filteredProductTypeValues = (input: string) => {
    if (!input) {
      setFilteredProductTypes(allProductTypes);
    } else {
      setFilteredProductTypes(
        allProductTypes.filter(productType => {
          return (
            productType.name.toLowerCase().startsWith(input.toLowerCase()) ||
            productType.name.toLowerCase().includes(input.toLowerCase())
          );
        })
      );
    }
  };

  return (
    <ListProductTypesStyled>

      <Columns>
        <Column>
          <h2>Product Types</h2>
        </Column>
        <Column>
          <Button
            isColor="light"
            onClick={() => props.history.push('/company/admin/dashboard/product-types/create')}
          >
            Add a new Product type
          </Button>

        </Column>
      </Columns>
      <div className="product-type-list__wrapper">
        <div style={{marginBottom: '0.75rem'}}>
          <label htmlFor="product-type-filter">Filter This List</label>
          <Input
            id="product-type-filter"
            type="text"
            placeholder="eg Sneakers "
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              filteredProductTypeValues(event.target.value);
            }}
          />
        </div>

        <div>
          {filteredProductTypes?.map((productType, index) => {
            return (
              <div key={index}>
                <Link to={`product-types/${productType.slug}`}>
                  <div className="product-type-list__item">
                    <p>{productType.name}</p>
                    <span>&rsaquo;</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </ListProductTypesStyled>
  );
}

const ListProductTypesStyled = styled.div`
  .product-type-list {
    &__wrapper {
      border: var(--gray-thin-border);
      padding: 1.5rem 1rem;
    }

    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: capitalize;
      padding: 1rem;
      margin-bottom: 0.5rem;
      border: var(--gray-thin-border);
      border-radius: 4px;

      span {
        font-size: 2rem;
      }
    }
  }
`;

import {Button} from 'bloomer';
import React from 'react';
import styled from 'styled-components';

export default function ProductType(props) {
  return (
    <ProductTypeStyled>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h4>Product Types</h4>
        <div className="product-types__add">
          <Button
            onClick={() => props.history.push('/company/admin/dashboard/product-types/create')}
          >
            Create Product Type
          </Button>
        </div>
        <div className="product-types__list">
          <Button onClick={() => props.history.push('/company/admin/dashboard/product-types/all')}>
            List Product Types
          </Button>
        </div>
      </div>
    </ProductTypeStyled>
  );
}

const ProductTypeStyled = styled.div`
  min-height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;

  

  & > div {
    text-align: center;
  }

  & button {
    width: 100%;
  }

  & button:not(last-child) {
    margin-bottom: 2rem;
  }
`;

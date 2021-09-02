import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {Tag} from 'bloomer';
import {EmptyState, RetroImage} from '../index';
import {formatNumberWithCommas} from '../../helpers';
import {FilteredProduct} from '../../types';
import {GrimacingEmoji} from '../../constants/icons';
import React from 'react';


function FilterItem ({product: item}){

  return (
    <ProductItem isInStock={item.inStock} to={`/product/${item.slug}/`}>
      {
        !item.isInStock && (
          <div className="is-relative">
            <Tag
              isColor={'warning'}
              className="product__item--in-stock-tag">
              <small>
                OUT OF STOCK
              </small>
            </Tag>
          </div>
        )
      }
      <div className="product__item__image">
        <RetroImage src={item.url} alt={item.name} />
      </div>
      <div
        className={'product__item__footer'}>
        <p>{item.name}</p>
        <p>
          <b>
            Ksh. {formatNumberWithCommas(item.price)}
          </b>
        </p>
      </div>
    </ProductItem>
  );
}


export const FilterItems = function(props: {
  products: Array<FilteredProduct>
}){

  if (!props.products){
    return (
      <EmptyState
        icon={GrimacingEmoji}
        style={{
          width: '100%',
        }}
        iconWidth={52}
        centerAlign={true}
        title={'There\'s Nothing to see here.'}
        message={'No match that query. Try something else'}
      />
    )
  }

  return (
    <div>
      {
        props.products.map((item, index) => (
          <FilterItem key={index.toString()} product={item} />
        ))
      }
    </div>
  )
}

export default FilterItems;

const ProductItem = styled(Link)<{isInStock: boolean}>`
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  min-width: 200px;
  margin-right: 8px;
  max-height: 250px;
  background: #f5f5f5;
  
  .product__item-in-stock-tag {
    position: absolute;
    right: 4px;
    top: 4px;
  }
  
  .product__item__image {
    height: 100%;
    opacity: ${props=> props.isInStock ? 1 : 0.5},
  }

  &:hover {
    cursor:pointer;
    transform: translateY(-4px);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-width: 250px;
    margin: 0 auto;
    display: block;
  }

  header {
    height: 198px;
    background:#f6f6f6;
    display: grid;
    align-items: center;
  }

  .product__item__footer {
    opacity: ${props=> props.isInStock ? 1 : 0.5}
  
    p {
      color: #353535;
      font-size: .9rem;
    }
  }
`;

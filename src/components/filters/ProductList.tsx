import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {Tag} from 'bloomer';
import {EmptyState, RetroImage} from '../index';
import defaultHelpers, {formatNumberWithCommas} from '../../helpers';
import {FilteredProduct} from '../../types';
import {GrimacingEmoji} from '../../constants/icons';
import React from 'react';


const Image = ({src, alt}) => {
  return (
    <ImageContainer>
      <RetroImage src={src} alt={alt} />
    </ImageContainer>
  );
};

const Details = ({name, price}) => {

  return (
    <DetailsContainer>
      <p>{defaultHelpers.titleCase(name)}</p>
      <p>
        <b>
          Ksh. {formatNumberWithCommas(price)}
        </b>
      </p>
    </DetailsContainer>
  );
};

export const ProductList = function(props: {products: Array<FilteredProduct>}) {

  if (!props.products) {
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
    );
  }

  const isInStock = (item) => item.quantity > 0;

  return (
    <>
      <ProductListContainer>
        {
          props.products.map((item, index) => (
            <Link to={`/product/${item.slug}/`}>
              <Product isInStock={isInStock(item)}>
                {
                  !isInStock(item) && (
                    <OutOfStockTag isColor={'warning'}>
                      <small>
                        OUT OF STOCK
                      </small>
                    </OutOfStockTag>
                  )
                }
                <Image src={item.images[0]?.thumbnailUrl} alt={item.name} />
                <Details name={item.name} price={item.originalPrice} />

              </Product>
            </Link>
          ))
        }
      </ProductListContainer>
    </>

  );
};

export default ProductList;

const ProductListContainer = styled.div`
    display: grid;
    column-gap: 1rem;
    row-gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    justify-content: space-between;
    padding: 0 1rem;
`;

const ImageContainer = styled.div`
    height: 200px;
    display: flex;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      max-width: 250px;
      margin: 0 auto;
      display: block;
  }
`;

const DetailsContainer = styled.div`
    p {
      color: #353535;
      font-size: .9rem;
    }
`;

const OutOfStockTag = styled(Tag)`
    position: absolute;
    right: 4px;
    top: 4px;
    z-index: 1;
`;

const Product = styled.div<{
  // fades when not in stock
  isInStock: boolean
}>`
  border: 1px solid #f6f6f6;
  border-radius: 4px;
  min-width: 200px;
  max-height: 250px;
  background: #f5f5f5;
  margin: 0;
  opacity: ${props => props.isInStock ? 1 : 0.5};
  position: relative;
  transition: transform var(--cubic-bezier) 0.25s;

  &:hover {
    cursor:pointer;
    transform: translateY(-4px);
  }
`;

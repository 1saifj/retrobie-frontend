import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Loading from '../../components/loading';
import {EmptyState, RetroImage} from '../../components';
import { useAuth } from '../../network';
import useSWR from 'swr';
import ServerError from '../../assets/images/vectors/dead.svg';
import {ProductType} from '../../types';

function PopularProducts() {
  const api = useAuth();

  const featuredProductsFetcher = () => api.products.getFeatured().then(({ data }) => data);
  const { data: featuredProducts, error } = useSWR<ProductType[]>('/products/featured', featuredProductsFetcher)

  if (error) {
    return (
      <MegaParent>
        <EmptyState
          icon={ServerError}
          title={"We couldn't fetch this section. Sorry about that!"}
          message={'An error occurred, but our best engineers have been notified, and are on the case.'}
        />

      </MegaParent>
    );
  }

  if (!featuredProducts) {
    return (
      <MegaParent>
        <Loading minor />
      </MegaParent>
    );
  }

  return (
    <>
      <BrandImagesParent>
        {featuredProducts?.length &&
          featuredProducts.map(product => (
            <Link to={`/product/${product.slug}`} key={product.name}>
              <BrandParent>
                <div className={'image'}>
                  <RetroImage
                    src={product?.defaultVariant?.images[0]?.thumbnailUrl}
                    alt={'featured image'}
                  />
                </div>
                <div className={'footer'}>
                  <p>{product.name}</p>
                </div>
              </BrandParent>
            </Link>
          ))}
      </BrandImagesParent>
    </>
  );
}

const BrandImagesParent = styled.div`
  display: grid;
  margin-top: 24px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  align-items: flex-end;
  background: #f5f5f5;
  padding: 36px 12px;
  a {
    text-decoration: none;
  }
`;

const MegaParent = styled.div`
  min-height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BrandParent = styled.div`
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease-in-out;
  align-items: center;

  &:hover {
    opacity: 0.9;
  }

  .image {
    min-height: 130px;
    display: grid;

    img {
      align-self: end;
      border-radius: 4px;
      object-fit: contain;
    }
  }

  .footer {
    margin-top: 8px;
    margin-left: 8px;
    p {
      font-weight: 500;
      color: gray;
      margin: 0;
    }
  }
`;

export default PopularProducts;

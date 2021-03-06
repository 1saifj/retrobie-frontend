import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Loading from '../../../components/loading';
import {EmptyState, RetroImage} from '../../../components';
import { useApi } from '../../../network';
import useSWR from 'swr';
import ServerError from '../../../assets/images/vectors/dead.svg';
import {ProductType} from '../../../types';
import {Container, Section} from 'bloomer';
import Fire from '../../../assets/images/icons/fire.svg';
import defaultHelpers from '../../../helpers';

function PopularProducts() {
  const api = useApi();

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
      <Section>
        <Container>
          <div>
            <div style={{textAlign: 'center'}}>
              <img src={Fire} alt={'fire'} style={{width: '64px'}} />

              <h2>Popular Right Now.</h2>
              <p>Not sure where to start? Check out the most popular brands and models</p>
            </div>
            <div>
              <BrandImagesParent>
                {featuredProducts?.length &&
                featuredProducts.map(product => (
                  <Link to={`/product/${product.slug}`}
                        key={product.name}
                        className="featured-product"
                  >
                    <BrandParent>
                      <div className={'image'}>
                        <RetroImage
                          src={product?.defaultVariant?.images[0]?.thumbnailUrl}
                          alt={'featured image'}
                        />
                      </div>
                      <div className={'footer'}>
                        <p>{defaultHelpers.titleCase(product.name)}</p>
                      </div>
                    </BrandParent>
                  </Link>
                ))}
              </BrandImagesParent>

            </div>
          </div>
        </Container>
      </Section>
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

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Loading from '../../components/loading';
import EmptyState from '../../components/empty/EmptyState';
import errorIcon from '../../assets/images/icons/error-text.svg';
import {useAuth} from '../../network';
import {useDispatch} from 'react-redux';

function PopularProducts() {
  const api = useAuth();
  const dispatch = useDispatch();

  const [featuredProducts, setFeaturedProducts] = useState();

  useEffect(()=> {
    dispatch(api.products.getFeatured())
      .then(({data}) => {
        setFeaturedProducts(data);
      });
  }, [])

  // if (error) {
  //   return (
  //     <MegaParent>
  //       <EmptyState
  //         icon={errorIcon}
  //         message={'Could not fetch this section. Please check back in a while.'}
  //         title={"We're working on that."}
  //       />
  //     </MegaParent>
  //   );
  // }

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
            <Link to={`/product/${product.uuid}`} key={product.name}>
              <BrandParent>
                <div className={'image'}>
                  <img src={product.images[0].thumbnailUrl} alt={'featured image'} />
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 24px;

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
  padding: 0px 48px;
  transition: all 0.25s ease-in-out;

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

import React from 'react';
import styled from 'styled-components';
import SEOHeader from '../../components/SEOHeader';
import Layout from '../../components/Layout';
import {Link} from 'react-router-dom';
import {Container, Section} from 'bloomer';
import Loading from '../../components/loading';
import {useAuth} from '../../network';
import useSWR from 'swr/esm/use-swr';
import {BrandType} from '../../types';
import {capitalize} from '../../helpers';
import {EmptyState} from '../../components';
import {GrimacingEmoji} from '../../constants/icons';

function AllBrandsComponent() {
  const api = useAuth();

  const allBrandsFetcher = () => api.brands.getAll().then(({data}) => data);
  const {data: allBrands, error: fetchAllBrandsError} =
    useSWR<Array<BrandType>>('/brands', allBrandsFetcher);

  if (fetchAllBrandsError){
    return (
      <EmptyState
        icon={GrimacingEmoji}
        iconWidth={52}
        title={"Yikes. That's an error."}
        message={'Sorry about that. We couldn\'t fetch this page. Try again later'}
      />
    );
  }

  if (!allBrands) {
    return (
      <Loading message={false} />
    );
  }

  return (
    <>
      <Layout>
        <SEOHeader
          path={'/brands/'}
          title={'Browse Shoes By Brand'}
          description={'Browse your favorite Nike, Jordan, Adidas, Yeezy and more shoes by brand in our Nairobi shop.'}
        />
        <Section>
          <Container>
            <h1>Browse by brand:</h1>

            <LogosParent>
              {
                allBrands?.map(brand => (
                  <Link to={`/brands/${brand.name}`}>
                    <div className={'image--parent'}>
                      <img src={brand.logo ? brand.logo.thumbnailUrl : ''}
                           alt={`${brand.name} logo`} />
                      <div>
                        <p>
                          {capitalize(brand.name)}
                        </p>
                      </div>
                    </div>
                  </Link>

                ))
              }
            </LogosParent>

          </Container>
        </Section>
      </Layout>
    </>

  );
}

const LogosParent = styled.div`
  display: grid; 
  flex-wrap: wrap;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 24px;
  
  p {
    color: #353535;
  }
  
  a {
    text-decoration: none;
  }
  
  .image--parent {
    display: flex;
    align-items: center;
    height: 180px;
    width: 180px;
    transition: border 0.25s cubic-bezier(0.77, 0.2, 0.05, 1.0);
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 24px;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    
    
    &:hover {
      cursor:pointer;
      border: 1px solid #d5d5d5;
    }
  }
  
  Img {
    width: 100%;
  }
`;

export default AllBrandsComponent;

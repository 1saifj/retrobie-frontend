import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import styled from 'styled-components';
import SEOHeader from '../../components/SEOHeader';
import Layout from '../../components/Layout';
import {Link} from 'react-router-dom';
import {Container, Section} from 'bloomer';
import {EmptyStateWithLayout} from '../../components/empty/EmptyState';
import errorIcon from '../../assets/images/icons/error-text.svg';
import Loading from '../../components/loading';
import {useAuth} from '../../network';

function BrandsComponent() {
    const api = useAuth();
    const dispatch = useDispatch();

    const [allBrands, setAllBrands] = useState();

    useEffect(()=> {
        dispatch(api.brands.getAll())
          .then(({data})=> {
              setAllBrands(data);
          })
    }, [])

    // if (error) {
    //     return (
    //         <EmptyStateWithLayout icon={errorIcon}
    //                               message={"Could not fetch this section. Please check back in a while."}
    //                               title={"We're working on that."}
    //         />
    //     )
    // }

    if (!allBrands) {
        return (
            <Loading message={false}/>
        )
    }

    return (
        <>
            <Layout>
                <SEOHeader title={'Browse Shoes By Brand'}
                           description={'Browse your favorite Nike, Jordan, Adidas, Yeezy and more shoes by brand in our Nairobi shop.'}
                />
                <Section>
                    <Container>
                        <h1>Browse by brand:</h1>

                        <LogosParent>
                            {
                                allBrands.map(brand => (
                                    <Link to={`/brands/${brand.name}`}>
                                        <div className={'image--parent'}>
                                            <img src={brand.logo ? brand.logo.thumbnailUrl : ""}
                                                 alt={`${brand.name} logo`}/>
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
    
    
    &:hover {
      cursor:pointer;
      border: 1px solid #d5d5d5;
    }
  }
  
  Img {
    width: 100%;
  }
`;

export default connect()(BrandsComponent);

import React, {useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import BrandsFilters from '../../components/filters/brand-filters';
import styled from 'styled-components';
import Loading from '../../components/loading';
import {Container, Section} from 'bloomer';
import {useAuth} from '../../network';
import {useDispatch} from 'react-redux';
import {formatNumberWithCommas} from '../../helpers';
import {Link} from 'react-router-dom';
import {useFilters} from '../../components/filters/useFilters';

export default function ViewSingleBrand(props) {

    const api = useAuth();
    const dispatch = useDispatch();

  const {products, setAllProducts} = useFilters();

    const brandNameOrId = props.match.params.brand;

    const [brandData, setBrandData] = useState(null);

  useEffect(() => {
    dispatch(api.brands.getSingle(brandNameOrId))
      // @ts-ignore
      .then(({data}) => setBrandData(data));

    dispatch(api.brands.getProducts(brandNameOrId))
      // @ts-ignore
      .then(({data}) => setAllProducts(data));
  }, []);

  // useEffect(()=> {
  //   console.log('Working with criteria ', criteria);
  // }, [criteria])


  return (
    <Layout>
      <Section>
        <Container>
          <div>
            {
              brandData ?
                <div>
                  <BrandHeader>
                    <div
                      style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                      <div style={{marginRight: '64px', marginLeft: '220px', maxWidth: '70%'}}>
                        <h1>About {brandData.name}</h1>
                        <p>
                          {brandData.description.long}
                        </p>
                      </div>
                      {/*<div>*/}
                      {/*    <img style={{width: "200px", borderRadius: "6px"}}*/}
                      {/*         src={brandData.featuredImage?.thumbnailUrl}*/}
                      {/*         alt={brandData.name}/>*/}
                      {/*</div>*/}
                    </div>
                    <hr/>
                  </BrandHeader>
                  <div style={{display: 'flex', gap: 64}}>

                    <BrandsFilters
                      allCriteria={['sex', 'size', 'price', 'style']}
                    />
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          columnGap: 24,
                        }}>
                        {
                          products.length ? products.map((item, index) => (
                            <ProductItem
                              key={String(index)}
                              to={`/brands/${brandNameOrId}/${item.uuid}`}
                              style={{
                                flex: '0 1 200px',
                                maxHeight: 250,
                                background: '#f5f5f5',
                              }}>

                              <div style={{height: '100%'}}>
                                <img src={item.images[0].url}/>
                              </div>
                              <div className={'footer'}>
                                <p>{item.name}</p>
                                <p>
                                  <b>
                                    Ksh. {formatNumberWithCommas(item.originalPrice)}
                                  </b>
                                </p>
                              </div>
                            </ProductItem>
                          ))
                        : <div>
                            <p>No products match that request :(</p>
                          </div>
                        }

                      </div>

                    </div>

                  </div>

                </div>
                :
                <div>
                  <Loading minor/>

                  {/*<EmptyState*/}
                  {/*  icon={EmptyBox}*/}
                  {/*  title={"We're fresh out of stock"}*/}
                  {/*  message={"Looks we're all out of stock! If you want to get notified when we restock, feel free to leave your email."}*/}
                  {/*  color={"#353535"}*/}
                  {/*  prompt={() => (*/}
                  {/*    <div style={{ display: 'flex', justifyContent: 'center' }}>*/}
                  {/*      <div id="mc_embed_signup" style={{ maxWidth: '600px' }}>*/}
                  {/*        <form*/}
                  {/*          action="https://store.us15.list-manage.com/subscribe/post?u=6ec31ce43b70efd818395b2ae&amp;id=159a07cdbd"*/}
                  {/*          method="post" id="mc-embedded-subscribe-form"*/}
                  {/*          name="mc-embedded-subscribe-form"*/}
                  {/*          className="validate" target="_blank" noValidate>*/}
                  {/*          <div id="mc_embed_signup_scroll">*/}
                  {/*            <div>*/}
                  {/*              <div>*/}
                  {/*                <Input placeholder='you@gmail.com'*/}
                  {/*                       type="email"*/}
                  {/*                       defaultValue=""*/}
                  {/*                       name="EMAIL"*/}
                  {/*                       className="required email"*/}
                  {/*                       id="mce-EMAIL" />*/}
                  {/*                <Button isColor='primary' type="submit"*/}
                  {/*                        defaultValue='Subscribe'*/}
                  {/*                        name="subscribe"*/}
                  {/*                        style={{*/}
                  {/*                          width: '100%',*/}
                  {/*                          marginTop: '8px'*/}
                  {/*                        }}*/}
                  {/*                        id="mc-embedded-subscribe"*/}
                  {/*                        className="button">*/}
                  {/*                  Hit me up*/}
                  {/*                </Button>*/}
                  {/*              </div>*/}
                  {/*            </div>*/}
                  {/*            <div id="mce-responses" className="clear">*/}
                  {/*              <div className="response"*/}
                  {/*                   id="mce-error-response"*/}
                  {/*                   style={{ display: "none" }} />*/}
                  {/*              <div className="response"*/}
                  {/*                   id="mce-success-response"*/}
                  {/*                   style={{ display: "none" }} />*/}
                  {/*            </div>*/}
                  {/*            <div style={{ position: "absolute", left: "-5000px" }}*/}
                  {/*                 aria-hidden="true">*/}
                  {/*              <input type="text"*/}
                  {/*                     name="b_6ec31ce43b70efd818395b2ae_159a07cdbd"*/}
                  {/*                     defaultValue='' />*/}
                  {/*            </div>*/}
                  {/*          </div>*/}
                  {/*        </form>*/}
                  {/*      </div>*/}

                  {/*    </div>*/}
                  {/*  )}*/}
                  {/*  style={{ height: "80vh" }} />*/}
                </div>
            }


          </div>
        </Container>
      </Section>

    </Layout>
  );
}

const BrandHeader = styled.header`
  margin-top: 30px;
  margin-bottom: 40px;
  h1, h2 {
    text-transform: capitalize;
    color: #353535;
  }

  p {
    color: #353535;
  }
`;

const ProductItem = styled(Link)`
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  min-width: 200px;
  margin-right: 8px;

  &:hover {
    cursor:pointer;
    transform: translateY(-4px);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-width: 250px;
  }

  header {
    height: 198px;
    background:#f6f6f6;
    display: grid;
    align-items: center;
  }

  .footer {

    p {
      color: #353535;
      font-size: .9rem;
    }
  }
`;
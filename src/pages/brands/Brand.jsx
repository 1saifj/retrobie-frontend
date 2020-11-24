import React, {useEffect, useState} from 'react';
import Layout from '../../components/Layout';
import Filters from '../../components/filters/Filters';
import styled from 'styled-components';
import Loading from '../../components/loading';
import EmptyState from '../../components/empty/EmptyState';
import {EmptyBox} from '../../constants/icons';
import {Button, Container, Input, Section} from 'bloomer';
import {useAuth} from '../../network';
import {useDispatch} from 'react-redux';

export default function ViewSingleBrand(props) {

    const api = useAuth();
    const dispatch = useDispatch();

    const brandNameOrId = props.match.params.brand;

    const [brandData, setBrandData] = useState({});
    const [brandProducts, setBrandProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [filterConfigState, setFilterConfigState] = useState();


    useEffect(() => {

        dispatch(api.brands.getSingle(brandNameOrId))
          .then(({data}) => {
              setBrandData(data);
          });

        dispatch(api.brands.getProducts(brandNameOrId))
          .then(({data})=> {
              setBrandProducts(data);

              const newState = { ...filterConfigState };

              newState.subjects = brandProducts;
              setFilterConfigState(newState);
          })
    }, []);


    return (
        <Layout>
            <Section>
                <Container>
                    <div>
                        {/*<BrandHeader>
                            {
                                brandData?.featuredImage &&
                                <div
                                    style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
                                    <div style={{marginRight: "64px", marginLeft: "220px", maxWidth: "70%"}}>
                                        <h1>About {brandData.name}</h1>
                                        <p>
                                            {brandData.description}
                                        </p>
                                    </div>
                                    <div>
                                        <img style={{width: "200px", borderRadius: "6px"}}
                                             src={brandData.featuredImage?.thumbnailUrl}
                                             alt={brandData.name}/>
                                    </div>
                                </div>
                            }
                            <hr/>
                        </BrandHeader>*/}

                        {
                            loading ?
                                <div style={{
                                    minHeight: "300px",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Loading minor />
                                </div>
                                :
                                brandData?.length ?
                                    <Filters data={brandProducts} />
                                    :
                                    <div>
                                        <EmptyState
                                            icon={EmptyBox}
                                            message={"Looks we're all out of stock! If you want to get notified when we restock, feel free to leave your email."}
                                            color={"#353535"}
                                            prompt={() => (
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div id="mc_embed_signup" style={{ maxWidth: '600px' }}>
                                                        <form
                                                            action="https://store.us15.list-manage.com/subscribe/post?u=6ec31ce43b70efd818395b2ae&amp;id=159a07cdbd"
                                                            method="post" id="mc-embedded-subscribe-form"
                                                            name="mc-embedded-subscribe-form"
                                                            className="validate" target="_blank" noValidate>
                                                            <div id="mc_embed_signup_scroll">
                                                                <div>
                                                                    <div>
                                                                        <Input placeholder='you@gmail.com'
                                                                            type="email"
                                                                            defaultValue=""
                                                                            name="EMAIL"
                                                                            className="required email"
                                                                            id="mce-EMAIL" />
                                                                        <Button isColor='primary' type="submit"
                                                                            defaultValue='Subscribe'
                                                                            name="subscribe"
                                                                            style={{
                                                                                width: '100%',
                                                                                marginTop: '8px'
                                                                            }}
                                                                            id="mc-embedded-subscribe"
                                                                            className="button">
                                                                            Hit me up
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <div id="mce-responses" className="clear">
                                                                    <div className="response"
                                                                        id="mce-error-response"
                                                                        style={{ display: "none" }} />
                                                                    <div className="response"
                                                                        id="mce-success-response"
                                                                        style={{ display: "none" }} />
                                                                </div>
                                                                <div style={{ position: "absolute", left: "-5000px" }}
                                                                    aria-hidden="true">
                                                                    <input type="text"
                                                                        name="b_6ec31ce43b70efd818395b2ae_159a07cdbd"
                                                                        tabIndex="-1"
                                                                        defaultValue='' />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>

                                                </div>
                                            )}
                                            style={{ height: "80vh" }} />
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

const BrandProduct = styled.div`
  border: 1px solid #f1f1f1;
  border-radius: 4px;
  min-width: 200px;
  margin-right: 8px;

  &:hover {
    cursor:pointer;
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
    padding: 0 12px;

    p {
      color: #353535;
    }
  }
`;

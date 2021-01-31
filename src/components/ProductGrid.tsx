import React, { Component } from 'react';
import styled from 'styled-components';
import EmptyState from './empty-state';
import { EmptyBox, ErrorIconDark } from '../constants/icons';
import { Link } from 'react-router-dom';
import { formatNumberWithCommas } from '../helpers';
import { axis } from '../network';
import Loading from './loading';
import { Button } from 'bloomer';
import { notify } from '../helpers/views';
import { env } from '../config';

class ProductGrid extends Component {
  state = {
    loading: {
      shoes: true,
    },
    allProducts: [],
  };

  componentDidMount() {
    this.getProductsFromServer({ limit: 10 });
  }

  getProductsFromServer(obj) {
    this.setState({
      ...this.state,
      loading: {
        shoes: true,
      },
    });

    axis
      .get(`/products/all/?limit=${obj.limit}`)
      .then(response => {
        let allProducts = response.data;
        this.setState({
          ...this.state,
          allProducts,
          loading: {
            shoes: false,
          },
        });
      })
      .catch(err => {
        this.setState({
          ...this.state,
          loading: {
            shoes: false,
          },
        });
        notify('error', err.message || 'Could not complete your request.');
      });
  }

  render() {
    return (
      <div>
        {//Still loading
          this.state.loading.shoes ? (
            <div
              style={{
                display: 'flex',
                minHeight: '200px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loading minor />
            </div>
          ) : (
              <div>
                {!this.state.allProducts.length ? (
                  <div>
                    <EmptyState
                      title={"There's currently nothing here."}
                      message={
                        'No products are currently available for sale. Please check back tomorrow.'
                      }
                      icon={EmptyBox}
                      style={{ height: 'unset', minHeight: '450px' }}
                    />
                  </div>
                ) : this.state.allProducts.length ? (
                  <GridBody>
                    <div className={'grid'}>
                      {this.state.allProducts.map(product => (
                        <div key={product.friendly_id} className="grid-panel">
                          <Link to={`/product/${product.slug}`}>
                            <GridElement>
                              {product.details.images && (
                                <GridElementEImageContainer>
                                  <img
                                    src={
                                      env.getApiBaseUrl() + product.details.images[0].thumbnail_url
                                    }
                                    style={{ margin: '0 auto' }}
                                    alt={product.id}
                                  />
                                </GridElementEImageContainer>
                              )}
                              <GridFooter>
                                <p
                                  style={{
                                    marginBottom: '4px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {product.name}
                                </p>
                                <p style={{ marginTop: '4px' }}>
                                  {`Ksh. ${formatNumberWithCommas(product.details.price.cost)}`}
                                </p>
                              </GridFooter>
                            </GridElement>
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Button isColor="primary" style={{ minWidth: '250px' }}>
                        View More
                  </Button>
                    </div>
                  </GridBody>
                ) : (
                      //No products uploaded yet.
                      <div>
                        <EmptyState
                          title={'An error occurred.'}
                          message={
                            "We couldn't load product details from the server. Please try again later."
                          }
                          icon={ErrorIconDark}
                        />
                      </div>
                    )}
              </div>
            )}
      </div>
    );
  }
}

export default ProductGrid;

const GridBody = styled.div`
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
    grid-column-gap: 24px;
    grid-row-gap: 24px;

    a {
      text-decoration: none;
    }

    .grid-panel {
      transition: all 0.25s ease-in-out;
      min-width: 275px;
      justify-content: center;
      align-content: center;
      display: flex;
      flex-direction: column;
      max-height: 280px;
      max-width: 275px;
      border-radius: 2px;
    }
  }
`;

const GridElement = styled.div`
  width: 100%;

  &:hover {
    cursor: pointer;

    p {
      text-decoration: underline;
    }
  }
`;

const GridElementEImageContainer = styled.div`
  background: #f6f6f6;
  display: grid;
  align-items: center;
  position: relative;
  border-radius: 4px;
  height: 200px;
  min-width: 200px;

  img {
    width: 100%;
    max-width: 150px;
    height: 100%;
    object-fit: contain;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    img {
      width: 80vw;
    }
  }
`;

const GridFooter = styled.div`
  padding: 0 12px;
  text-align: center;

  p {
    text-transform: capitalize;
    color: var(--primary-color-text);
  }
`;

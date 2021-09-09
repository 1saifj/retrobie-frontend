import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Loading from '../../../components/loading';
import {useApi} from '../../../network';
import useSWR from 'swr/esm/use-swr';
import {Button, Column, Columns, Input} from 'bloomer';
import {ProductType} from '../../../types';
import CreateProductModal from './components/CreateProductModal';
import SelectedImageModal from '../brands/modals/SelectedImageModal';
import {useDispatch} from 'react-redux';
import {useNotify} from '../../../hooks';
import {extractErrorMessage} from '../../../helpers';
import {SimpleListItem} from '../../../components/list';

export default function ViewAllProductsPage() {
  const api = useApi();

  const allProductsFetcher = () => api.products.getAll().then(({data}) => {
    return data.sort((a, b) => {
      if (a.name < b.name) return -1;

      if (a.name > b.name) return 1;

      return 0;
    });
  });
  const {data: allProducts} = useSWR<Array<ProductType>>('/products/all', allProductsFetcher);

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(()=> {
    setFilteredProducts(allProducts)
  }, [allProducts])

  if (!allProducts) {
    return (
      <div>
        <Loading minor={true} />
      </div>
    );
  }

  const filterProductsByValue = (input: string)=> {
    if (!input) {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(item => {
          return item.name.toLowerCase().startsWith(input.toLowerCase())
            || item.name.toLowerCase().includes(input.toLowerCase());
        }),
      );
    }
  }

  return (
    <>
      <div>
        <h2>All products</h2>
      </div>

      <Columns>
        <Column isSize={{default: 7}} className="mb-4">
          <label>Filter products by name</label>
          <Input
            placeholder={'eg. Kobe, Lebron, etc.'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const input = e.target.value;
              filterProductsByValue(input);
            }}>

          </Input>
        </Column>
        <Column>
          <ProductPageHeader />
        </Column>
      </Columns>

      <div>

      </div>

      <div>
        {
          filteredProducts?.length ? (
              <div>
                <div>
                  <div>
                    {
                      filteredProducts.map(product => {
                        return (
                          <div>
                            <Link to={`products/${product.slug}`}>
                              <SimpleListItem>
                                <p>{product.name}</p>
                              </SimpleListItem>
                            </Link>

                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            ) :
            <div>
              <p>No products uploaded yet.</p>
            </div>
        }
      </div>
    </>
  );
};

const ProductPageHeader = () => {

  const dispatch = useDispatch();
  const notify = useNotify();

  const api = useApi();

  const [indexingProducts, setIndexingProducts] = useState(false);

  const [showSelectedImageModal, setShowSelectedImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isCreateProductModalActive, setCreateProductModalActive] = useState(false);

  return (
    <>
      <div>

        <CreateProductModal
          isActive={isCreateProductModalActive}
          onClickSelectedImage={images => {
            setShowSelectedImageModal(true);
            setSelectedImages(images);
          }}
          onClose={() => {
            setCreateProductModalActive(false);
            setShowSelectedImageModal(false);
          }}
        />
        <SelectedImageModal
          showModal={showSelectedImageModal}
          images={selectedImages}
          onClose={() => {
            setShowSelectedImageModal(false);
          }}
        />
      </div>
      <div className="buttons mt-4 is-flex">
        <Button
          isLoading={indexingProducts}
          isColor="light"
          onClick={async () => {
            setIndexingProducts(true);
            try {
              await dispatch(api.products.reIndex({
                deleteAll: true,
                createIndexIfNotExists: true,
              }));
              notify.success('Indexed products successfully');
            } catch (e) {
              const message = extractErrorMessage(e);
              notify.error(message);
            }
            setIndexingProducts(false);
          }}
        >
          Re-index products
        </Button>
        <Button
          onClick={() => setCreateProductModalActive(true)}
          isColor="light">
          Add new Product
        </Button>

      </div>

    </>
  );
};

import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button} from 'bloomer';
import {useAuth, useNotify} from '../../../hooks';

function AdminProductHome(props) {
  const api = useAuth();

  const dispatch = useDispatch();
  const notify = useNotify();

  const [indexingProducts, setIndexingProducts] = useState(false);

  return (
    <div
      style={{display: 'flex', marginTop: '48px', flexDirection: 'column', alignItems: 'center'}}
    >
      <div>
        <div style={{marginTop: '24px'}}>
          <Button
            onClick={() => props.history.push('/company/admin/dashboard/products/create')}
          >
            Add new product
          </Button>
        </div>
        <div style={{marginTop: '24px'}}>
          <Button
            onClick={() => props.history.push('/company/admin/dashboard/products/all')}
          >
            View all products
          </Button>
        </div>
        <div style={{marginTop: '24px'}}>
          <Button
            isLoading={indexingProducts}
            onClick={async () => {
              setIndexingProducts(true)
              try {
                await dispatch(api.products.reIndex({index: 'products'}))
                notify.success("Indexed products successfully")
              }catch (e){

              }
              setIndexingProducts(false)
            }}
          >
            Re-index products
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminProductHome;
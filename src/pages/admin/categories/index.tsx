import React, {useState} from 'react';
import useSWR from 'swr/esm/use-swr';
import {useAuth} from '../../../hooks';
import {Loading} from '../../../components';
import {CategoryType} from '../../../types';
import {Button} from 'bloomer';
import AddNewCategoryModal from './modals/AddNewCategoryModal';
import {SimpleListItem} from '../../../components/list';
import {Link} from 'react-router-dom';

export default function(){

  const [isCreateNewCategoryModalActive, setIsCreateNewCategoryModalActive] = useState(false);

  const api = useAuth();

  const allCategoriesFetcher = () => api.category.getAll().then(({data}) => data);
  const {data: allCategories} = useSWR<Array<CategoryType>>('/categories', allCategoriesFetcher);

  if (!allCategories) {
    return <Loading/>
  }
  return (
    <>
      <div>
        <div>
          {
            allCategories.map(item => (
              <Link key={item.slug} to={`categories/${item.slug}`}>
                <SimpleListItem >
                  <div>
                    {item.name}
                  </div>
                </SimpleListItem>
              </Link>
            ))
          }
        </div>
        <div>
          <AddNewCategoryModal
            isActive={isCreateNewCategoryModalActive}
            onClose={() => setIsCreateNewCategoryModalActive(false)}
          />
          <Button onClick={() => {
            setIsCreateNewCategoryModalActive(true);
          }}>
            Add new category
          </Button>
        </div>
      </div>
    </>
  );
}
import React from 'react';
import {Layout, Loading} from '../../components';
import {useAuth} from '../../hooks';
import useSWR from 'swr/esm/use-swr';


export default function({match}){

  const categoryId = match.params.id;

  const api = useAuth();

  const categoryFetcher = (url,  id) => api.category.getOne(id).then(({data}) => data).catch(err=> err);
  const {data: categoryData, error} = useSWR([`/category/${categoryId}`, categoryId], categoryFetcher)

  if (error) {
    return (
      <pre>
      {JSON.stringify(error, null, 3)}
    </pre>
    )
  }

  if (!categoryData) {
    return (
      <Loading/>
    )
  }


  return (
    <Layout>
      <pre>
        {JSON.stringify(categoryData, null, 3)}
      </pre>
    </Layout>
  );
}
import React from 'react';
import {useParams} from 'react-router';
import useSWR from 'swr';
import {EmptyState, Loading} from '../../../components';
import {DeadEyes2} from '../../../constants/icons';
import {useAuth} from '../../../hooks';
import ProductTypeForm from './ProductTypeForm';

export default function SingleProductType() {
  const param: {slug: string} = useParams();
  const api = useAuth();

  const slug = param.slug || '';

  const singleProductTypeFetcher = () =>
    api.productTypes.getSingle(slug).then(({data}) => {
      return data;
    });

  const {data, error} = useSWR(`productType/${slug}`, singleProductTypeFetcher);

  if (error) {
    return (
      <EmptyState
        icon={DeadEyes2}
        centerAlign={true}
        message={'An error occurred while fetching this product type: ' + error}
        title={'Could not fetch product type'}
      />
    );
  }

  if (!data) {
    return <Loading message={'Please wait a while...'} />;
  }
  return (
    <ProductTypeForm
      formAction={{action: 'view', formData: data}}
      formTitle="Update a Product Type"
    />
  );
}

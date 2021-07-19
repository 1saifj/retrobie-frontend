import React from 'react';
import ProductTypeForm from './components/ProductTypeForm';

export default function CreateProductTypePage(props) {
  return (
    <ProductTypeForm
      formAction={{action: 'create'}}
      formTitle="Create a New Product Type"
    />
  );
}

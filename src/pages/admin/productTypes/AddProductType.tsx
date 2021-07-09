import React from 'react';
import ProductTypeForm from './ProductTypeForm';

export default function AddProductType(props) {
  return (
    <ProductTypeForm
      formAction={{action: 'create'}}
      formTitle="Create a New Product Type"
    ></ProductTypeForm>
  );
}

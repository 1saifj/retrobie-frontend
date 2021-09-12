import React from 'react';
import styled from 'styled-components';


function ProductDescriptionComponent(){

  return (
    <>

    </>
  );
}

export default ProductDescriptionComponent;


const ProductDescriptionParent = styled.div`
  display: flex;
  
  @media screen and (max-width: 376px) {
    flex-direction: column;
    padding: 0;
  }
`;

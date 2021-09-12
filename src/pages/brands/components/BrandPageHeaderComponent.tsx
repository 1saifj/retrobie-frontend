import {RetroImage} from '../../../components';
import React from 'react';
import styled from 'styled-components';
import {BrandType} from '../../../types';


function BrandPageHeaderComponent(props: {
  brand: BrandType
}){
  const {brand} = props;
  return (
    <>
      <div className="brand__header">
        <BrandHeaderParent>
          <div className="brand__header__image">
            <RetroImage
              style={{borderRadius: '4px'}}
              src={brand.logo?.thumbnailUrl}
              alt={brand.name} />
          </div>
          <div className="brand__header__description">
            <h1>About {brand.name}</h1>
            <p>
              {brand.description.long}
            </p>
          </div>
        </BrandHeaderParent>

      </div>
    </>
  );
}

export default BrandPageHeaderComponent;

const BrandHeaderParent = styled.header`
  margin-top: 30px;
  margin-bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  gap: 3rem;
  
  .brand__header__image {
    flex: 0 1 150px;
  }
  
  .brand__header__description {
    flex: 2 0 300px;
  }
  
  h1, h2 {
    text-transform: capitalize;
    color: #353535;
  }

  p {
    color: #353535;
  }
`;

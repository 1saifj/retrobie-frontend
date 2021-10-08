import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

function BrandSlider(props: {items: any[]}) {

  return (
    <BrandSliderContainer>
      {
        props.items.map(item => (
          <Link to={item.link}>
            <img src={item.image} alt={'logo'} />
          </Link>
        ))
      }
    </BrandSliderContainer>
  );
}

const BrandSliderContainer = styled.div`
    max-height: 180px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    gap: 16px;

    img {
        max-height: 75px;
        margin: 0 auto;
        transition: 0.25s ease-in-out;
        max-width: 150px;
        
        &:hover {
          opacity: 0.6;
        }
    }
`;

export default BrandSlider;

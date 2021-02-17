import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import RetroImage from '../image';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {ImageType} from '../../types';

function isNarrowDevice() {
  return window.innerWidth <= 600;
}

function Slider(
  {
    productName,
    images
  }) {
  const [allImages, ] = useState<Array<ImageType>>(images);

  const [currentIndex, setCurrentIndex] = useState(0);

  const paginate = (index) => setCurrentIndex(index);

  const handleDragStart = (e) => e.preventDefault();

  const items = allImages.map((item)=> (
    <RetroImage
      solidColor={true}
      onDragStart={handleDragStart}
      alt={productName}
      style={{maxHeight: '500px'}}
      src={item.url}
    />
  ))

  return (
    <div>
      {
        <div>
          <div>
            <AliceCarousel
              activeIndex={currentIndex}
              mouseTracking
              infinite={allImages.length != 1}
              renderDotsItem={({isActive, activeIndex})=> {
                return (
                  <div>
                    <Dot
                      isNarrow={isNarrowDevice()}
                      isActive={isActive}
                      onClick={() => paginate(activeIndex)}>
                      <img
                        alt={`${productName} thumbnail`}
                        src={allImages[activeIndex].thumbnailUrl}
                        style={{width: '60px'}}/>
                    </Dot>

                  </div>
                );
              }}
              disableButtonsControls
              items={items}
            />
          </div>
        </div>

      }
    </div>
  );
}

export default function ProductSlider({images, productName}) {
  return (
    <ProductSliderParent>
      <Slider productName={productName} images={images}/>
    </ProductSliderParent>
  );
}

ProductSlider.propTypes = {
  images: PropTypes.array,
};

const Dot = styled.div<{
  isActive: boolean,
  isNarrow: boolean
}>`
    border: 2px solid ${p=> p.isActive ? "#444": "#ccc"};
    border-radius: 4px;
    margin-right: 8px;
    margin-bottom: 8px;
    max-width: ${p => (p.isNarrow ? '40px' : '70px')};
    min-height: 64px;
    -webkit-transition: all 0.25s ease-in-out;
    transition: all 0.25s ease-in-out;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: #f6f6f6;
    
    &:hover {
      border: 2px solid #444444;
      cursor: pointer;
    }
    &:active,
    &:focus {
      outline: none;
    }
`

const ProductSliderParent = styled.div`
  width: 80%;
  background: #f6f6f6;
  max-height: 525px;
`;

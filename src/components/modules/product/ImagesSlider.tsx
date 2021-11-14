import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import RetroImage from '../../image';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {ImageType} from '../../../types';
import {Dot} from '../../../pages/product/ProductPage';

function isNarrowDevice() {
  return window.innerWidth <= 600;
}

function Slider(props) {

  const {images} = props;

  const [allImages, setAllImages] = useState<Array<ImageType>>(images);

  const [currentIndex, setCurrentIndex] = useState(0);

  const paginate = (index) => setCurrentIndex(index);

  useEffect(() => {
    if (images?.length) {
      setAllImages(images);
    } else {
      // set at least one image so the error image show up
      setAllImages([{
        thumbnailUrl: '',
        url: '',
      }]);
    }
  }, [images]);

  const handleDragStart = (e) => e.preventDefault();

  const items = allImages.map((item) => (
    <RetroImage
      solidColor={true}
      onDragStart={handleDragStart}
      alt={props.productName}
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
                      <RetroImage
                        alt={`${(props.productName)} thumbnail`}
                        src={allImages[activeIndex]?.thumbnailUrl}
                        style={{width: '60px'}} />
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

export default function ImagesSlider({images, productName}) {
  return (
    <ProductSliderParent>
      <Slider productName={productName} images={images} />
    </ProductSliderParent>
  );
}


const ProductSliderParent = styled.div`
  width: 80%;
  background: #f6f6f6;
  max-height: 525px;
`;

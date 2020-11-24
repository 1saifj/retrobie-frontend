import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Loading from '../loading';

function Slider({images}) {
  const [allImages, ] = useState(images);
  const [currentImage, setCurrentImage] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentImage(images[currentIndex]);
  }, [currentIndex]);

  return (
    <div>
      {
        <div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <img
              style={{maxHeight: '500px'}}
              src={currentImage.url}
              loader={
                <div
                  style={{
                    minWidth: '250px',
                    minHeight: '250px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Loading minor={false} message={false}/>
                </div>
              }
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              //   gap: 16,
              //   alignItems: 'center',
              marginTop: -48,
              marginBottom: 24,
            }}
          >
            {
              allImages.map((item, index) => (
                <div className={'item'}
                     onClick={() => setCurrentIndex(index)}
                >
                  <img src={item.thumbnailUrl} style={{width: 60}}/>
                </div>
              ))
            }
          </div>
        </div>

      }
    </div>
  );
}

export default function ProductSlider({images}) {
  function isNarrowDevice() {
    return window.innerWidth <= 600;
  }

  return (
    <ProductSliderParent narrow={isNarrowDevice()}>
      <Slider images={images}/>
    </ProductSliderParent>
  );
}

ProductSlider.propTypes = {
  images: PropTypes.array,
};

const ProductSliderParent = styled.div`
  width: 80%;
  background: #f6f6f6;
  min-height: 525px;

  .item {
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    margin-right: ${p => (p.narrow ? '0' : '8px')};
    margin-bottom: 8px;
    max-width: ${p => (p.narrow ? '40px' : '70px')};
    min-height: 52px;
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
      border: 2px solid rgba(0, 0, 0);
      cursor: pointer;
    }
    &:active,
    &:focus {
      outline: none;
    }
  }
`;

export const Arrow = props => {
  const {onClick, style, classNames, src} = props;
  return (
    <div className={classNames} style={{...style}} onClick={onClick}>
      <img alt={'right'} src={src} style={{width: '20px', zIndex: '99'}} />
    </div>
  );
};

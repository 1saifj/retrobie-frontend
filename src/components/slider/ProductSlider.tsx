import React, {useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import RetroImage from '../image';
import { SwitchTransition, CSSTransition } from "react-transition-group";


function Slider({images}) {
  const [allImages, ] = useState(images);

  const [imageIndex, setCurrentIndex] = useState(0);

  const paginate = (index) => setCurrentIndex(index);


  return (
    <div>
      {
        <div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <SwitchTransition mode={'out-in'}>
              <CSSTransition
                timeout={500}
                key={imageIndex}
                classNames="fade"
              >
                <RetroImage
                  solidColor={true}
                  alt={''}
                  style={{maxHeight: '500px'}}
                  src={allImages[imageIndex].url}
                />
              </CSSTransition>
            </SwitchTransition>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              //   gap: 16,
              //   alignItems: 'center',
              marginTop: -48,
              marginBottom: 24,
              position: 'relative',
              zIndex: 2
            }}
          >
            {
              allImages.map((item, index) => (
                <Dot isActive={index === imageIndex}
                     onClick={() => paginate(index)}>
                  <img
                    alt={''}
                    src={item.thumbnailUrl}
                    style={{width: '60px'}}/>
                </Dot>
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

const Dot = styled.div`
    border: 2px solid ${p=> p.isActive ? "#444": "#ccc"};
    border-radius: 4px;
    margin-right: 8px;
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

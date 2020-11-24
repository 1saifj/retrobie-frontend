import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import Right from '../../assets/images/icons/right.svg';
import Left from '../../assets/images/icons/left.svg';
import {Arrow} from './ProductSlider';

function BrandSlider({items, className}) {

    function isWideScreen() {
        return window && window.innerWidth > 1024;
    }

    function isSmallScreen() {
        return window && window.innerWidth <= 768;
    }

    if (!items || items.length === 0) {
        return (
            <p>
                Please provide a list of items
            </p>
        )
    }

    return (
        <div style={{
            maxHeight: "180px",
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            gap: 16
        }}>
            {
                items.map(item => (
                  <div key={item.link}>
                      <Link to={item.link}>
                          <BrandParent>
                              <img style={{maxHeight: '75px', margin: "0 auto"}}
                                   src={item.image} alt={'logo'}/>
                          </BrandParent>
                      </Link>
                  </div>
                ))
            }
        </div>
    );
}
const BrandParent = styled.div`
  max-height: 75px;

  
  img {
  transition: 0.25s ease-in-out;
    &:hover {
      opacity: 0.6;
    }
  }
`;

BrandSlider.propTypes = {
    items: PropTypes.array
};

export default BrandSlider;

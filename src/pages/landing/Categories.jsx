import React, {useState} from 'react';
import styled from 'styled-components';
import CategoryTitle from '../../assets/images/vectors/sneaker 1.svg';
import ChevronRight from '../../assets/images/icons/chevron-right.svg';

let categories = [
    {
        name: 'Men',
        color: '#ba3f38',
        src: "https://ik.imagekit.io/t25/v2/landing/man-shoes-5-transparent-bg_23zrfYib4.webp?tr=w-250"
    },
    {
        name: 'Women',
        color: '#45c0c7',
        src: "https://ik.imagekit.io/t25/v2/landing/woman-mirror-1-transparent-bg_ihyqA0BG0.webp?tr=w-250"
    },
    {
        name: 'Kids',
        color: '#d13b78',
        src: "https://ik.imagekit.io/t25/v2/landing/kids-shoes-transparent-bg_WiOT3wv9w.webp?tr=w-250"
    },
    {
        name: 'Affordable',
        color: '#fdb813',
        src: "https://ik.imagekit.io/t25/v2/landing/woman-shoes-1-transparent-bg_jMp_5MbMK.webp?tr=w-250"
    }
];

const Categories = () => {
    const [allCategories] = useState(categories);
    return (
        <Parent>
            <header style={{display: 'flex'}}>
                <img src={CategoryTitle} style={{width: '54px', padding: '8px'}}/>
                <h2>Shop by category</h2>
            </header>
            <div className={'list'}>
                {
                    allCategories.map(item => (
                        <Category key={item.name}>
                            <header>
                                <h4>{item.name}</h4>
                                <div className={'next'}>
                                    <img src={ChevronRight} alt={'go'}/>
                                </div>
                            </header>
                            <div>
                                <div style={{
                                    background: item.color,
                                    textAlign: 'center',
                                    borderRadius: '2px',
                                    minWidth: '250px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '380px',
                                    flex: '1 1 250px'
                                }}>
                                    <img src={item.src} alt={item.name}/>
                                </div>
                            </div>
                        </Category>
                    ))
                }
            </div>
        </Parent>
    );
};

const Parent = styled('div')`
    
  .list {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 12px;
  }
`;


const Category = styled('div')`
  transition: all 0.25s ease-in-out;
  
  &:hover {
    cursor:pointer;
    transform: translateY(-4px);
  }  
  h4 {
    margin: 1em;
    margin-bottom: 0;
  }
  
  header {
    display: flex;
    justify-content:  space-between;
    align-items: center;
    padding: 12px 0;
    
    h4 {
      margin: 0;
  }
    
  }
  
  .next {
    background: #F5F6F7;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    padding-left: 6px;
  }
  img {
    border-radius: 2px;
    max-height: 375px;
  }

`;

export default Categories;

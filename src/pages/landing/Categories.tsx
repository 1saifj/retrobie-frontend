import React from 'react';
import styled from 'styled-components';
import CategoryTitle from '../../assets/images/vectors/sneaker 1.svg';
import ChevronRight from '../../assets/images/icons/chevron-right.svg';
import {Link} from 'react-router-dom';
import {useAuth} from '../../hooks';
import useSWR from 'swr/esm/use-swr';
import {Loading} from '../../components';
import {CategoryType} from '../../types';

const Categories = () => {

    const api = useAuth();
    const allCategoriesFetcher = () => api.category.getAll().then(({data}) => data);
    const {data: allCategories} = useSWR<Array<CategoryType>>('/categories/all', allCategoriesFetcher);

    if (!allCategories) {
        return <Loading minor={true}/>
    }

    return (
        <Parent>
            <header style={{display: 'flex'}}>
                <img
                  alt={'small blue shoe'}
                  src={CategoryTitle}
                  style={{width: '54px', padding: '8px'}}/>
                <h2>Shop by category</h2>
            </header>
            <div className={'list'}>
                {
                    allCategories.slice(0, 4).map(item => (
                        <Link
                          key={item.name}
                          to={`/category/${item.slug}`}>
                            <Category>
                                <header>
                                    <h4>{item.name}</h4>
                                    <div className={'next'}>
                                        <img src={ChevronRight} alt={'go'}/>
                                    </div>
                                </header>
                                <div>
                                    <div style={{
                                        background:
                                        // a bit hacky, but it works
                                          item.slug.includes("women") ? "#45c0c7"
                                          : item.slug.includes("men") ? "#ba3f38"
                                          : item.slug.includes("kids") ? "#d13b78"
                                          : item.slug.includes("affordable") ? "#fdb813"
                                            : "",
                                        textAlign: 'center',
                                        borderRadius: '2px',
                                        minWidth: '250px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '380px',
                                        flex: '1 1 250px'
                                    }}>
                                        <img src={`${item.landingImage?.url}?tr=w-250`} alt={item.name}/>
                                    </div>
                                </div>
                            </Category>
                        </Link>
                    ))
                }
            </div>
        </Parent>
    );
};

const Parent = styled.div`
    
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
    margin: 1em 1em 0;
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
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    padding: 8px 8px 8px 6px;
  }
  img {
    border-radius: 2px;
    max-height: 375px;
  }

`;

export default Categories;

import React from 'react';
import styled from 'styled-components';
import CategoryTitle from '../../../assets/images/vectors/sneaker 1.svg';
import ChevronRight from '../../../assets/images/icons/chevron-right.svg';
import {Link} from 'react-router-dom';
import {useApi} from '../../../hooks';
import useSWR from 'swr/esm/use-swr';
import {EmptyState, Loading} from '../../../components';
import {CategoryType} from '../../../types';
import ServerError from '../../../assets/images/vectors/dead.svg';
import {Container, Section} from 'bloomer';

const Categories = () => {

    const api = useApi();
    const allCategoriesFetcher = () => api.category.getAll().then(({data}) => data);
    const {data: allCategories, error} = useSWR<Array<CategoryType>>('/categories/all', allCategoriesFetcher);

  if (error) {
    return (
      <EmptyState
        icon={ServerError}
        title={'Oops! That\'s an error. It\'s on us.'}
        message={'We couldn\'t fetch this section. Our best engineers have been notified, and are working on it.'}
      />
    );
  }

  if (!allCategories) {
    return <Loading minor={true} />;
  }

  return (
    <Section>
      <Container>
        <>
          <CategoriesHeader />
          <CategoriesList categories={allCategories} />
        </>
      </Container>
    </Section>
  );
};

const CategoriesHeader = () => {

  return (
    <>
      <header style={{display: 'flex'}}>
        <img
          alt={'small blue shoe'}
          src={CategoryTitle}
          style={{width: '54px', padding: '8px'}} />
        <h2>Shop by category</h2>
      </header>
    </>
  );
};

const CategoriesList = ({categories}) => {

  return (
    <>
      <CategoriesListContainer>
        {
          categories.slice(0, 4).map(item => <CategoryItem item={item} />)
        }
      </CategoriesListContainer>
    </>
  );
};

const CategoriesListContainer = styled.div`
    display: grid;;
    grid-template-columns: repeat(auto-fill, minmax(14em, 1fr));
    gap: 1.8em;
`;

const CategoryItem = ({item}) => {

  return (
    <>
      <Link
        key={item.name}
        className="category--link"
        to={`/category/${item.slug}`}>
        <CategoryItemContainer>
          <CategoryItemHeader name={item.name} />
          <CategoryItemImage
            name={item.name}
            slug={item.slug}
            landingImage={item.landingImage}
          />
        </CategoryItemContainer>
      </Link>

    </>
  );
};

const CategoryItemContainer = styled('div')`
  transition: all 0.25s ease-in-out;
  
  &:hover {
    cursor:pointer;
    transform: translateY(-4px);
  }  
`;

const CategoryItemHeader = ({name}) => {

  return (
    <>
      <CategoryItemHeaderContainer>
        <h4>{name}</h4>
        <div className={'next'}>
          <img src={ChevronRight} alt={'go'} />
        </div>
      </CategoryItemHeaderContainer>
    </>
  );
};

const CategoryItemHeaderContainer = styled.header`
      display: flex;
      justify-content:  space-between;
      align-items: center;
      padding: 12px 0;
      
      h4 {
        margin: 0;
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

`;

const CategoryItemImage = ({name, slug, landingImage}) => {
  return (
    <>
      <CategoryItemImageContainer>
        <div style={{
          background:
          // a bit hacky, but it works for now
            slug.includes('women') ? '#45c0c7'
              : slug.includes('men') ? '#ba3f38'
              : slug.includes('kids') ? '#d13b78'
                : slug.includes('affordable') ? '#fdb813'
                  : slug.includes('popular') ? '#f5f5f5'
                    : '',
          textAlign: 'center',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '380px',
        }}>
          <img src={`${landingImage?.url}?tr=w-250`} alt={name} />
        </div>

      </CategoryItemImageContainer>
    </>
  );
};

const CategoryItemImageContainer = styled.div`
  h4 {
    margin: 1em 1em 0;
  }
  
  img {
    border-radius: 2px;
    max-height: 375px;
  }
`;

export default Categories;

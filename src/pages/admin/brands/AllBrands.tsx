import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Loading from '../../../components/loading';
import EmptyState from '../../../components/empty/EmptyState';
import {Box, Button} from 'bloomer';
import CreateBrandModal from './modals/CreateBrandModal';
import errorIcon from '../../../assets/images/icons/error-text.svg';
import {capitalize} from '../../../helpers';
import {ChevronDown, Eye, Plus, Truck} from 'react-feather';
import SidebarShoe from '../../../assets/images/icons/products.svg';
import Sale from '../../../assets/images/icons/sale.svg';
import {notify} from '../../../helpers/views';
import useSWR from 'swr/esm/use-swr';
import {useAuth} from '../../../hooks';
import {BrandType} from '../../../types';


function AllBrandsAdmin(props) {
    const api = useAuth();

    const getAllBrands = () => api.brands.getAll().then(({data})=> data);

    const [allBrandsState, setAllBrands] = useState([]);
    const [showCreateBrandModal, setShowCreateBrandModal] = useState(false);
    const {data: allBrands, error} = useSWR<Array<BrandType>>('/brands/all', getAllBrands);

    useEffect(() => {
        if (allBrands) {
            if (!allBrands) {
                setAllBrands([]);
            } else {
                setAllBrands(
                  [...allBrands].map(item => ({
                      ...item,
                      active: false
                  })).sort(((a, b) => {
                    if (a.name < b.name) return -1

                    if (a.name > b.name) return 1;

                    return 0;
                  }))
                );
            }
        }
    }, [allBrands]);

    function setBrandActive(index) {
        if (index === undefined) return;
        const cloned = [...allBrandsState];
        cloned[index].active = !cloned[index].active;
        setAllBrands(cloned);
    }

    function addBrand(brand) {
        const allBrands = [...allBrandsState, brand];
        setAllBrands(allBrands);
    }

    if (error) {
        return (
            <EmptyState icon={errorIcon}
                        message={"Could not fetch this section. Please check back in a while."}
                        title={"We're working on that."}
            />
        );
    }

    if (!allBrands) {
        return (
          <Loading/>
        )
    }

    if (!allBrandsState || !allBrandsState.length) {
        return (
            <>
                <div style={{background: 'white', height: "100%"}}>
                    <EmptyState title="There's nothing here yet."
                                icon={"https://ik.imagekit.io/t25/abstract-list-is-empty_-h-8wpxpOHH.png"}
                                width="800px"
                                style={{display: 'grid', alignItems: 'center'}}
                                message="No brand has been created yet. Feel free to do the honours."
                                prompt={() => (
                                    <div>
                                        <Button style={{
                                            padding: 0,
                                            background: 'transparent',
                                            borderBottom: '1px solid var(--color-accent)',
                                            color: "var(--color-accent)"
                                        }} isColor="light" onClick={() => setShowCreateBrandModal(true)}>
                                            Create a new brand
                                        </Button>
                                        <CreateBrandModal
                                            onClose={() => setShowCreateBrandModal(false)}
                                            isActive={showCreateBrandModal}
                                            onCreate={(brand) => {
                                                notify('success', "Created brand successfully", {autoClose: 2500});
                                                setShowCreateBrandModal(false);
                                                addBrand(brand);
                                            }}

                                        />
                                    </div>
                                )}
                    />
                </div>
            </>

        );
    }

    return (
        <>
            <div style={{padding: 20, background: 'white'}}>
                <BrandHeader>
                    <div>
                        <h4>Brands.</h4>
                    </div>
                    <div>
                        <Plus onClick={() => setShowCreateBrandModal(true)}/>
                        <CreateBrandModal
                            onClose={() => setShowCreateBrandModal(false)}
                            isActive={showCreateBrandModal}/>
                    </div>
                </BrandHeader>
                {
                    allBrandsState.map((brand: BrandType & {active: boolean}, index) => (
                        <>
                            <BrandItemRoot active={brand.active}>
                                <BrandItem onClick={() => setBrandActive(index)}>
                                    <BrandItemParent>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <div>
                                                <img
                                                  src={brand.logo ? brand.logo.thumbnailUrl : ""}
                                                     alt={`${brand.name} logo`}/>
                                            </div>
                                            <div>
                                                <p><b>{capitalize(brand.name)}</b></p>
                                                <p>{brand.uuid}</p>
                                            </div>
                                        </div>
                                    </BrandItemParent>
                                    <div className="details">
                                        <p>
                                            View more
                                        </p>
                                        <ChevronDown/>
                                    </div>
                                </BrandItem>
                                <Box className='extra'>
                                    <div style={{display: "flex", paddingBottom: '0'}}>
                                        <Button isColor="white"
                                                onClick={() => props.history.push(`brands/${brand.name}`)}>
                                            <Eye style={{marginRight: '8px'}}/>
                                            View Details
                                        </Button>
                                        <Button isColor="white">
                                            <Truck style={{marginRight: '8px'}}/>
                                            View Orders
                                        </Button>
                                        <Button isColor="white"
                                                onClick={() => props.history.push(`brands/${brand.name}/products`)}>
                                            <img src={SidebarShoe}
                                                 style={{marginRight: '12px', width: '21px'}}
                                                 alt={'shoe box'}
                                            />
                                            View Products
                                        </Button>
                                        <Button isColor="white">
                                            <img src={Sale} style={{marginRight: '12px', width: '21px'}}
                                                 alt={'for sale'}
                                            />
                                            View Offers
                                        </Button>
                                    </div>
                                </Box>
                            </BrandItemRoot>
                        </>
                    ))
                }
            </div>
        </>
    );

}


export default AllBrandsAdmin;

const BrandHeader = styled.header`
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  margin-bottom: 48px;
  
  
  svg {
    &:hover {
      cursor:pointer;
    }
  }
`;

const BrandItemRoot = styled.div<{active?: boolean}>`
    
  .details {
      svg {
        transition: all 0.25s ease-in-out;
        transform: ${props => props.active ? "rotate(180deg)" : "none"};    
      }
  }
  
  .extra {
    background: white;
    margin-bottom: 24px;
    transition: all 0.25s ease-in-out;
    opacity: ${props => props.active ? 1 : 0};
    display: ${props => props.active ? 'block' : 'none'};
    height: ${props => props.active ? "90px" : "0"};
    
    div {
      transition: all 0.25s ease-in-out;
      transition-delay: 0.1s;
      background: white;
      opacity: ${props => props.active ? 1 : 0};
      
      button:not(:first-child) {
        margin: 0 12px;
      }
      
      p {
        margin: 0;
      }
    }
  }

  
  &:hover {
     cursor: pointer;
  }

`;

const BrandItem = styled(Box)`
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      margin-bottom: 0 !important;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      
      a {
        text-decoration: none;
      }
      
      .details {
        display: flex;
        align-items: center;
        
        svg {
          margin-left: 8px;
          margin-top: 4px;
        }
      }
`;

const BrandItemParent = styled.div`
  margin-bottom: 4px;
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  position:relative;
  
  img {
    margin-right: 24px;
    max-width: 80px;
  }
`;

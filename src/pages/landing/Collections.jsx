import React from 'react';
import styled from 'styled-components';
import PeepStanding26 from '../../assets/images/vectors/peep-standing-26.svg';
import PeepStanding27 from '../../assets/images/vectors/standing-elegantly.svg';
import PeepStanding28 from '../../assets/images/marketing/casual-hangout.jpg';

const collections = [
    {
        name: "Near All Black",
        image: PeepStanding26,
        link: "/"
    },
    {
        name: "Casual hangout",
        image: PeepStanding28,
        link: "/"
    },
    {
        name: "Club Bangers",
        image: PeepStanding27,
        link: "/"
    },

];

const Collections = props => {
    return (
        <>
            <div>
                <h2>Hand-picked collections</h2>
                <Parent>
                    {
                        collections.map(item => (
                            <CollectionParent key={item.name}>
                                <Collection>
                                    <div>
                                        <img src={item.image} alt={item.name}/>
                                    </div>
                                    <p>{item.name}</p>
                                </Collection>
                            </CollectionParent>
                        ))
                    }
                </Parent>
            </div>
        </>
    );
};

Collections.propTypes = {};

const Parent = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 12px;
`;

const CollectionParent = styled.div`
 
  
`;

const Collection = styled('div')`
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Collections;

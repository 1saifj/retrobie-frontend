import React from 'react';
import styled from 'styled-components';


const SimpleListItem = function(props){

  return (
    <ListItem>
      {props.children}
    </ListItem>
  )
}
export default SimpleListItem;


const ListItem = styled.div`
  padding: 12px; 
  border: 1px solid lightgray;
  margin-bottom: 12px;  
  border-radius: 4px;
`

import React from 'react';
import {ImageType} from '../../types';
import styled from 'styled-components';
import {env} from '../../config';


function AvatarComponent({src, name, size, ...props}: {
  src: Omit<ImageType, 'fileId'>,
  name: string,
  size?: "S" | "L"
  [key: string]: any
}) {

  return (
    <div>
      {
        src?.url ? (
          <AvatarParent size={size}>
            {props.children}
            <img
              src={env.getApiBaseUrl() + src.thumbnailUrl}
              alt={'avatar'} />
          </AvatarParent>
        ) : (
          <Initials size={size}>
            {name?.charAt(0).toUpperCase() || "-"}
          </Initials>
        )
      }
    </div>
  );
}

const Initials = styled.div<{size?: "S" | "L"}>`
  width: ${props=> props.size === "S"? "65px": "85px"};
  height: ${props=> props.size === "S"? "65px": "85px"};
  background: dodgerblue;
  border-radius: 4px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

const AvatarParent = styled.div<{size?: "S" | "L"}>`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    border: 2px solid seagreen;
    padding: 2px;
    border-radius: 50%;
    max-width: ${props => props.size === 'L' ? 'unset' : '40px'};
  }

  &:hover {
    cursor:pointer;
  }
`

export default AvatarComponent;

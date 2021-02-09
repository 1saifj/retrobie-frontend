import React from 'react';
import {ImageType} from '../../types';
import styled from 'styled-components';
import {env} from '../../config';


function AvatarComponent({src, name, ...props}: {
  src: Omit<ImageType, 'fileId'>,
  name: string,
  [key: string]: any
}) {

  return (
    <div>
      {
        src?.url ? (
          <AvatarParent>
            {props.children}
            <img
              src={env.getApiBaseUrl() + src.thumbnailUrl}
              alt={'avatar'} />
          </AvatarParent>
        ) : (
          <Initials>
            {name?.charAt(0).toUpperCase() || "-"}
          </Initials>
        )
      }
    </div>
  );
}

const Initials = styled.div`
  width: 85px;
  height: 85px;
  background: dodgerblue;
  border-radius: 4px;
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

const AvatarParent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    border: 2px solid seagreen;
    padding: 2px;
    border-radius: 50%;
    max-width: 40px;
  }

  &:hover {
    cursor:pointer;
  }
`

export default AvatarComponent;
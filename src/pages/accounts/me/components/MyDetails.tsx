import {AtSign, Eye, Phone} from 'react-feather';
import React from 'react';
import styled from 'styled-components';

const DetailsParent = styled.div`
  margin-left: 1em;
  & > div {
    display: flex;
    align-items: center;
    
    svg {
      width: 20px;
      height: 20px;
    }
    
    p {
      margin-left: 8px;
    }
  }
`


export default function ({data: userInfo}){

  return (
    <>

      <DetailsParent>
        <div>
          <AtSign/>
          <p>
            {userInfo?.email}
          </p>
        </div>
        <div>
          <Eye/>
          <p>
            {userInfo?.username}
          </p>
        </div>
        <div>
          <Phone/>
          <p>
            {'+254-' + userInfo?.phoneNumber}
          </p>
        </div>
        <div>
          <p>
            {
              userInfo?.is2FAEnabled ?
                'You have enabled two factor authentication' :
                'You have not enabled two factor authentication'
            }
          </p>
        </div>
        <div>
          <p>
            {
              userInfo?.role === "admin" ?
                'You are an administrator.' :
                'You are a regular user.'
            }
          </p>
        </div>
        <div>
          <p>
            {
              userInfo?.addresses?.length &&
              (
                <div>
                  You have not provided any delivery addresses
                </div>
              )
            }
          </p>
        </div>
        <div>
          <p>
            {
              !userInfo?.orders?.length &&
              (
                <div>
                  You have not made any orders
                </div>
              )
            }
          </p>
        </div>
      </DetailsParent>
    </>
  );
}


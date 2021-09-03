import {Avatar} from '../../../components';
import {AtSign, Phone, User} from 'react-feather';
import {addDashes} from '../../../helpers';
import {Column} from 'bloomer';
import React from 'react';
import styled from 'styled-components';
import {UserInfoType} from '../../../state/reducers/userReducers';


function CheckoutLoggedinContainer (props: {
  user: UserInfoType
}){

  if (!props.user) return <p>Not logged in.</p>

  return (
    <>
      <LoggedInContainer>
        <h2>Your Information</h2>
        <p>
          This information will be used to get in touch with you concerning your
          order, should the need arise.
        </p>
        <div style={{display: 'flex'}}>
          <div style={{
            display: "flex",
            alignItems: "center"
          }}>
            <Avatar
              src={props.user.avatar}
              name={`${props.user.firstName}`}/>
          </div>
          <div className={'user-info'}>
            <div>
              <User />
              <p>
                {props.user.firstName} {props.user.lastName}
              </p>
            </div>
            <div>
              <Phone />
              <p>+254-{addDashes(props.user.phoneNumber)}</p>
            </div>
            <div>
              <AtSign />
              <p>{props.user.email}</p>
            </div>
          </div>
        </div>
      </LoggedInContainer>
    </>
  )
}

export default CheckoutLoggedinContainer;

const LoggedInContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 10px;
  img {
    border-radius: 4px;
  }

  .user-info {
    margin-left: 24px;
    
    @media screen and (max-width: 500px){
      margin-left: 12px;
    }
    
    & > div {
      display: flex;
      align-items: center;
      p {
        margin-left: 8px;
      }
    }
  }
`;
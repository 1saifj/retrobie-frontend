import React from 'react';
import InternalLayout from '../../components/internal/layout';
import {UserState} from '../../state/reducers/userReducers';
import {RootStateOrAny, useSelector} from 'react-redux';
import NotFound from '../not-found';
import jwtDecode from 'jwt-decode';

const AdminDashboard = props => {

  const user: UserState = useSelector((state: RootStateOrAny) => state.user);

  // We need this check first so we don't pass
  // an invalid token to jwtDecode
  if (!user?.tokens || !user?.tokens?.accessToken) {
    return (
      <NotFound />
    );
  }

  const decodedAccessToken = jwtDecode(user?.tokens?.accessToken);

  if (decodedAccessToken.role !== 'ROLE_ADMIN') {
    return (
      <NotFound />
    );
  }
  return (
    <>
      <InternalLayout style={{display: 'flex'}}>
        <div style={{width: '100%'}}>
          {props.children}
        </div>
      </InternalLayout>
    </>
  );
};

export default AdminDashboard;

import React from 'react';
import InternalLayout from '../../components/internal/layout';

const AdminDashboard = props => {
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

AdminDashboard.propTypes = {};

export default AdminDashboard;

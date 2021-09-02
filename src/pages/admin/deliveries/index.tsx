import React from 'react';
import {Button} from 'bloomer';
import {useApi, useNotify} from '../../../hooks';
import {useDispatch} from 'react-redux';

export default function(){

  const api = useApi();
  const dispatch = useDispatch();
  const notify = useNotify();

  return (
    <div>
      <Button
        onClick={async () => {
          const response = await dispatch(api.deliveries.populate());
          // @ts-ignore
          if (response.data){
            notify.success("The location index will be populated shortly.")
          }
        }}>
        Populate delivery locations
      </Button>
    </div>
  );
}

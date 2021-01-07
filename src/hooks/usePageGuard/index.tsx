import React from 'react';
import {AxiosResponse} from 'axios';


export default function({role, response}: {role?: string; response?: AxiosResponse}){

  if (response?.status === 500) {
    return (
      <div>
        <p>
          Oops. An internal server error occurred.
        </p>
      </div>
    )
  }

  return undefined;
}
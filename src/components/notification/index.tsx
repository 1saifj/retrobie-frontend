import React from 'react';
import {Notification as BloomerNotification} from 'bloomer';
import {AlertCircle, Check, CheckCircle, Info, XCircle} from 'react-feather';
import {ErrorIconLight, WarningIconLight} from '../../constants/icons';
import Tick from '../../../public/assets/images/icons/tick.svg';

type NotificationType = 'info' | 'error' | 'success' | 'warning';

export default function Notification({type, title, message}: {
  type: NotificationType,
  title: string,
  message?: string
}){

  function getIcon(type: NotificationType){
    switch (type) {
      case 'success':
        return <CheckCircle color={'#fff'} size={32}/>;
      case 'warning':
        return <AlertCircle color={'#444'} size={32}/>
      case 'info':
        return <Info color={'#fff'} size={32}/>
      case 'error':
        return <XCircle color={'#fff'} size={32}/>
      default:
        return <span/>

    }
  }

  return (
    <div style={{marginBottom: '1rem'}}>
      <BloomerNotification isColor={type}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0.5rem 0'
        }}>
          {getIcon(type)}
          {
            type === "error" || type === 'success' ? (
              <div>
                <h4 style={{color: 'white', margin: 0}}>{title}</h4>
                {
                  message && <p style={{color: 'white'}}>{message}</p>
                }
              </div>
            ): (
              <div>
                <h4 style={{margin: 0}}>{title}</h4>
                {
                  message && <p>{message}</p>
                }
              </div>
            )
          }
        </div>
      </BloomerNotification>
    </div>
  )
}
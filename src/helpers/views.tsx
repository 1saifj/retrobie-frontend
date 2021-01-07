import { toast, ToastOptions } from 'react-toastify';
import React from 'react';
import { ErrorIconLight, InfoLight, WarningIconLight } from '../constants/icons';
import Tick from '../assets/images/icons/tick.svg';
import Loading from '../components/loading';

const CloseButton = ({ closeToast }) => <button className="delete" onClick={closeToast} />;

const NotificationMarkup = ({ message, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img style={{ width: '24px', margin: '0 12px' }} alt="info icon" src={icon} />
    <p style={{ color: 'white', marginRight: 24 }}>{message}</p>
  </div>
);

/**
 *
 * @param {'info' | 'error' | 'success' | 'loading' | 'warning'} type
 * @param {string} message
 * @param {object} [options]
 */
export function notify(
  type:
    'info'
    | 'error'
    | 'success'
    | 'loading'
    | 'warning',
  message: string, options?: ToastOptions) {

  toast(mapToType(type, message), {
    position: toast.POSITION.TOP_CENTER,
    hideProgressBar: true,
    closeOnClick: false,
    draggable: true,
    className: `notification is-${type}`,
    closeButton: <CloseButton closeToast={() => {
    }} />,
    ...options,
  });
}

function mapToType(type: "info" | "error" | "success" | "loading" | "warning",
  message: any) {
  switch (type) {
    case 'error':
      return <NotificationMarkup message={message} icon={ErrorIconLight} />;
    case 'success':
      return <NotificationMarkup icon={Tick} message={message} />;
    case 'loading':
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Loading minor={true} message={false} />
          <p>{message}</p>
        </div>
      );
    case 'info':
      return <NotificationMarkup message={message} icon={InfoLight} />;
    case 'warning':
      return <NotificationMarkup message={message} icon={WarningIconLight} />;
    default:
      return <p>{message}</p>;
  }
}

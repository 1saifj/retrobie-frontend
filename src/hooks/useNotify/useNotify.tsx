import {toast, ToastOptions} from 'react-toastify';
import React from 'react';
import {ErrorIconLight, InfoLight, Tick, WarningIconLight} from '../../constants/icons';
import {Loading} from '../../components';
import {generateRandomString} from '../../helpers';

const CloseButton = ({closeToast}) => <button className="delete" onClick={closeToast} />;

type NotificationType = 'info' | 'error' | 'success' | 'loading' | 'warning';

/**
 *
 * @param {object} [globalOptions]
 */
const useNotify = function(globalOptions?: ToastOptions) {

  function getToast(type: NotificationType, message, options: ToastOptions) {
    const toastId = generateRandomString(8);
    toast(mapToType(type, message), {
      position: toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
      closeOnClick: false,
      toastId,
      draggable: true,
      className: `notification is-${type}`,
      closeButton: CloseButton,
      ...(options ? options : globalOptions),
    });

    return toastId;
  }


  return {
    dismiss: (toastId) => toast.dismiss(toastId),
    info: (message: string, options?: ToastOptions) => getToast('info', message, options),
    error: (message: string, options?: ToastOptions) => getToast('error', message, options),
    success: (message: string, options?: ToastOptions) => getToast('success', message, options),
    loading: (message: string, options?: ToastOptions) => getToast('loading', message, options),
    // same as 'loading' but has to be dismissed manually
    progress: (progress: number, options?: ToastOptions) => getToast('loading', progress, {
      ...options,
      autoClose: false,
    }),
    warning: (message: string, options?: ToastOptions) => getToast('warning', message, options),
  };
};

function mapToType(type: NotificationType, message: string) {

  switch (type) {
    case 'error':
      return <NotificationMarkup message={message} icon={ErrorIconLight} />;
    case 'success':
      return <NotificationMarkup icon={Tick} message={message} />;
    case 'loading':
      return <Loading minor={true} message={message} />;
    case 'info':
      return <NotificationMarkup message={message} icon={InfoLight} />;
    case 'warning':
      return <NotificationMarkup message={message} icon={WarningIconLight} />;
    default:
      return <p>{message}</p>;
  }
}

const NotificationMarkup = ({message, icon}) => (
  <div style={{display: 'flex', alignItems: 'center', padding: '12px 8px'}}>
    <img style={{width: '24px', margin: '0 12px'}} alt="info icon" src={icon} />
    <p style={{color: 'white', marginRight: 24}}>{message}</p>
  </div>
);

export default useNotify;

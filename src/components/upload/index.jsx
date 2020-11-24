import React, {useEffect, useRef, useState} from 'react';
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import {Dashboard, DragDrop} from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/progress-bar/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Instagram from '@uppy/instagram';
import Url from '@uppy/url';
import {CheckCircle} from 'react-feather';
import {Line} from 'rc-progress';
import {useApi} from '../../network';

/**
 * @deprecated
 * @param props
 * @returns {*}
 * @constructor
 */
function ImageKitUpload(props) {
  const api = useApi();
  const {folder, maxNumberOfFiles, currentImage, onSuccess, onError, trigger} = props;

  const [stateImage, setStateImage] = useState(currentImage);
  const {uploadStatus, setUploadStatus} = useState('');
  const [imageKitSignature, setImageKitSignature] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uppy = useRef(
    Uppy({
      restrictions: {
        maxNumberOfFiles: maxNumberOfFiles || 1,
      },
      autoProceed: props.autoProceed,
    })
  );

  useEffect(() => {
    return () => uppy.current.close();
  }, []);

  function initializeUppy({token, signature, expire, publicKey, folder}) {
    uppy.current.use(Instagram, {companionUrl: 'https://companion.uppy.io/'});
    uppy.current.use(Url, {companionUrl: 'https://companion.uppy.io/'});
    uppy.current.use(XHRUpload, {
      endpoint: 'https://upload.imagekit.io/api/v1/files/upload',
      formData: true,
      fieldName: 'file',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    uppy.current.on('file-added', file => {
      if (FileReader) {
        const reader = new FileReader();
        reader.onload = () => {
          setStateImage(reader.result);
        };

        reader.onerror = function() {
          console.log('reader error');
        };
        reader.readAsDataURL(file.data);
      }
      uppy.current.setFileMeta(file.id, {
        size: file.size,
        signature,
        expire,
        publicKey,
        fileName: file.name,
        token,
        folder,
      });
    });

    uppy.current.on('upload-progress', (file, progress) => {
      if (props.onProgress && typeof props.onProgress === 'function') {
        props.onProgress(file, progress);
      }

      setProgress((progress.bytesUploaded / progress.bytesTotal) * 100);
    });

    uppy.current.on('complete', result => {
      if (props.onComplete && typeof props.onComplete === 'function') {
        props.onComplete(result);
      }

      setUploadSuccess(true);
    });
    return uppy;
  }

  useEffect(() => {
    async function init() {
      const {data} = await api.imageKit.getSignature();
      initializeUppy({
        token: data.token,
        expire: data.expire,
        publicKey: data.publicKey,
        signature: data.signature,
        folder,
      });
    }

    init();

    if (trigger) {
      //Don't re-upload
      if (!uploadSuccess) {
        uppy.current
          .upload()
          .then(response => {
            setUploadSuccess(true);
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess(response.successful);
            }
          })
          .catch(err => {
            if (onError && typeof onError === 'function') {
              onError(err.failed);
            }
          });
      } else {
        console.log('Already uploaded. Ignoring...');
      }
    }
  }, [trigger]);

  return (
    <ImageKitParent height={props.height} width={props.width}>
      <div
        style={{textAlign: 'center', position: 'relative', margin: '4px'}}
        className={`${!props.multiple && stateImage ? 'visible-image' : 'hidden-image'} ${
          uploadSuccess || currentImage ? 'upload-success' : ''
        }`}
      >
        <div style={{padding: '8px 16px'}}>
          <img id="main-image" src={stateImage} alt="current logo" />
          <Line percent={currentImage ? 100 : progress} strokeWidth="3" strokeColor="#f40028" />
        </div>

        {(uploadSuccess || currentImage) && (
          <div className={'success-message'}>
            <CheckCircle color="green" />
            <p>Uploaded successfully</p>
          </div>
        )}
      </div>

      {props.type === 'dashboard' && (
        <Dashboard style={{width: '79%'}} plugins={['Instagram', 'Url']} uppy={uppy.current} />
      )}

      {props.type === 'drag' && !stateImage && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              paddingTop: '8px',
              borderRadius: '4px',
              margin: '4px',
              border: props.error ? '1px solid var(--color-error)' : 'none',
            }}
          >
            <DragDrop
              width="200px"
              height="200px"
              note="Images up to 200×200px"
              uppy={uppy.current}
              locale={{
                strings: {
                  // Text to show on the droppable area.
                  // `%{browse}` is replaced with a link that opens the system file selection dialog.
                  dropHereOr: props.placeholder || 'Drop here or %{browse}',
                  // Used as the label for the link that opens the system file selection dialog.
                  browse: 'browse',
                },
              }}
            />

            <h4 style={{margin: '4px 0'}}>{props.label}</h4>
            {props.error && (
              <small style={{margin: '8px 0', color: 'var(--color-error)'}}>{props.error}</small>
            )}
          </div>
        </>
      )}
    </ImageKitParent>
  );
}

ImageKitUpload.propTypes = {
  currentImage: PropTypes.string,
  maxNumberOfFiles: PropTypes.number,
  folder: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onComplete: PropTypes.func,
  onProgress: PropTypes.func,
  type: PropTypes.oneOf(['dashboard', 'drag']),
  multiple: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  trigger: PropTypes.bool.isRequired,
  meta: PropTypes.object,
  autoProceed: PropTypes.bool,
  error: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

const ImageKitParent = styled.div`
  font-size: 14px;
  color: #353535;

  .hidden-image {
    visibility: hidden;
    height: 0;
  }

  .uppy-Root {
    width: 79%;
  }

  .success-message {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 24px;

    p {
      margin-left: 8px;
    }
  }

  .visible-image {
    visibility: visible;

    img {
      margin-bottom: 8px;
    }
  }

  .upload-success {
    text-align: center;
    border: 1px solid green;
    border-radius: 4px;
    width: min-content;
    min-width: 250px;
  }

  img {
    height: 100%;
    max-width: ${props => (props.width ? props.width : '180px')};
    max-height: ${props => (props.height ? props.height : '180px')};
    object-fit: contain;
  }
`;

export default ImageKitUpload;

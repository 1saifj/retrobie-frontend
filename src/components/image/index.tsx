import React, {CSSProperties} from 'react';
import Image from 'react-progressive-graceful-image';
import {DeadEyes2} from '../../constants/icons';

const RetroImage = function (
  {
    src,
    srcSet,
    alt,
    style,
    solidColor,
    placeholderStyle,
    ...props
  }: {
  src: string,
  alt: string,
  srcSet?: {sizes: string; srcSet: string},
  style?: CSSProperties,
  solidColor?: boolean,
  placeholderStyle?: CSSProperties,
  [key: string]: any
}) {

  const getPlaceholderUrl = (src)=> {
    if (!src) return '';
    const url = new URL(src);
    const queryParam = new URLSearchParams(url.search);
    queryParam.set('tr', 'bl-6,h-100')
    return `${url.protocol}//${url.host}${url.pathname}?${queryParam.toString()}`;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Image
        placeholder={getPlaceholderUrl(src)}
        src={src}
        srcSetData={srcSet}
      >
        {(src, loading, srcSetData) => {

          if (!src){
            return (
              <div style={{textAlign: 'center'}}>
                <img
                  style={{width: 48}}
                  src={DeadEyes2}
                  alt={'error'} />
                  <p>Could not load this image</p>
              </div>
            );
          }

          // if solid color placeholder is required
          if (loading) {
            if (solidColor) {
              return (
                <div
                  style={{
                    minWidth: 300,
                    minHeight: 500,
                    background: '#f5f5f5',
                    ...placeholderStyle,
                  }}
                />
              );
            }

            return <span>Loading...</span>
          }


          if (srcSet) {
            return (
              <img
                alt={alt}
                src={src}
                style={style}
                srcSet={srcSetData.srcSet}
                sizes={srcSetData.sizes}
                {...props}
              />);
          }


          return (
            <img
              src={src}
              style={style}
              alt={alt}
              {...props}
            />);
        }}

      </Image>
    </div>

  );
}

export default RetroImage;
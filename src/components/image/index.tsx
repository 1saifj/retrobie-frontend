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

  function getErrorImageUrl(){
    return `https://ik.imagekit.io/t25/image-not-found_1__GAADOys0Sw.webp?updatedAt=1631955885168`;
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
                  src={getErrorImageUrl()}
                  alt={'error'} />
              </div>
            );
          }

          // if solid color placeholder is required
          if (solidColor) {
            // show a simple square as the loading component
            if (loading) {
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
            // otherwise, the component will automatically show a scaled down
            // placeholder image
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

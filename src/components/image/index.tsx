import React from 'react';
import Image from 'react-progressive-graceful-image';

const RetroImage = ({src, srcSet, alt, style, solidColor, placeholderStyle}) => {

  const setPlaceholderQueryParam = (src)=> {
    if (!src) return '';
    const url = new URL(src);
    const queryParam = new URLSearchParams(url.search);
    queryParam.set('tr', 'bl-6,h-100')
    return `${url.protocol}//${url.host}${url.pathname}?${queryParam.toString()}`;
  }

  return (
    <div style={{
      minWidth: 250,
      minHeight: 250,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
      <Image
        placeholder={setPlaceholderQueryParam(src)}
        src={src}
        srcSetData={srcSet}
      >
        {(src, loading, srcSetData) => {
          // if solid color placeholder is required
          if (solidColor) {
            if (loading) {
              return (
                <div
                  style={{minWidth: 300, minHeight: 400, background: '#eee', ...placeholderStyle}}
                />
              );
            }
          }


          if (srcSet) {
            return (
              <img
                alt={alt}
                src={src}
                srcSet={srcSetData.srcSet}
                sizes={srcSetData.sizes}
              />);
          }


          return (
            <img
              src={src}
              alt={alt}
            />);
        }}

      </Image>
    </div>

  );
}

export default RetroImage;
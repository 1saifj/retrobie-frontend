import React, {CSSProperties} from 'react';
import Image from 'react-progressive-graceful-image';

const RetroImage = ({src, srcSet, alt, style, solidColor, placeholderStyle}: {
  src: string,
  alt: string,
  srcSet?: {sizes: string; srcSet: string},
  style?: CSSProperties,
  solidColor?: boolean,
  placeholderStyle?: CSSProperties
}) => {

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
          // if solid color placeholder is required
          if (solidColor) {
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
          }


          if (srcSet) {
            return (
              <img
                alt={alt}
                src={src}
                style={style}
                srcSet={srcSetData.srcSet}
                sizes={srcSetData.sizes}
              />);
          }


          return (
            <img
              src={src}
              style={style}
              alt={alt}
            />);
        }}

      </Image>
    </div>

  );
}

export default RetroImage;
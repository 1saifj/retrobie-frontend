import React, {CSSProperties} from 'react';
import Image from 'react-progressive-graceful-image';
import {DeadEyes2} from '../../constants/icons';


interface ImageProps {
  src: string,
  alt: string,
  srcSet?: {sizes: string; srcSet: string},
  style?: CSSProperties,
  solidColor?: boolean,
  placeholderStyle?: CSSProperties,

  [key: string]: any
}

/**
 * A utility 'img' tag wrapper for taking care of placeholder styles and loading spinners.
 * @param props.src -
 * @param props.srcSet - or pass a srcSet instead
 * @param props.alt - the image 'alt'
 * @param props.style - additional styles
 * @param props.solidColor - whether the loader should be a solid color
 * @param props.placeholderStyle - any styles to be passed to the placeholder 'img' tag
 * @param props.additionalProps - any more props to be passed to the 'img' tg
 * @constructor
 */
const RetroImage = function(props: ImageProps) {

  const {
    src,
    srcSet,
    alt,
    style,
    solidColor,
    placeholderStyle,
    // additional props can be passed to the "<img/>" tag
    ...additionalProps
  } = props;

  const getPlaceholderUrl = (src) => {
    if (!src) return '';
    const url = new URL(src);
    const queryParam = new URLSearchParams(url.search);
    queryParam.set('tr', 'bl-6,h-100');
    return `${url.protocol}//${url.host}${url.pathname}?${queryParam.toString()}`;
  };

  function getErrorImageUrl() {
    return `https://ik.imagekit.io/t25/image-not-found_1__GAADOys0Sw.webp?updatedAt=1631955885168`;
  }

  return (
    <>
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
                {...additionalProps}
              />);
          }


          return (
            <img
              src={src}
              style={style}
              alt={alt}
              {...additionalProps}
            />);
        }}

      </Image>
    </>

  );
}

export default RetroImage;

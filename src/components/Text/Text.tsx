import React from 'react';
import styled from 'styled-components';

const pixelRatio = window.devicePixelRatio;
const deviceWidth = window.screen.width;
const deviceHeight = window.screen.height;

console.log('Pixel ratio: ', pixelRatio);

// https://dev.to/jasurkurbanovinit/how-to-create-custom-fully-responsive-text-component-in-react-native-51d8
const getFontSize = (size) => {
  if (pixelRatio > 1) {
    if (pixelRatio >= 2 && pixelRatio < 3) {
      // iphone 5s and older Androids
      if (deviceWidth < 360) {
        return size * 0.95;
      }
      // iphone 5
      if (deviceHeight < 667) {
        return size;
        // iphone 6-6s
      }
      if (deviceHeight >= 667 && deviceHeight <= 735) {
        return size * 1.15;
      }
      // older phablets
      return size * 1.25;
    }

    if (pixelRatio >= 3 && pixelRatio < 3.5) {
      // catch Android font scaling on small machines
      // where pixel ratio / font scale ratio => 3:3
      if (deviceWidth <= 360) {
        return size;
      }
      // Catch other weird android width sizings
      if (deviceHeight < 667) {
        return size * 1.15;
        // catch in-between size Androids and scale font up
        // a tad but not too much
      }
      if (deviceHeight >= 667 && deviceHeight <= 735) {
        return size * 1.2;
      }
      // catch larger devices
      // ie iphone 6s plus / 7 plus / mi note 等等
      return size * 1.27;
    }

    if (pixelRatio >= 3.5) {
      // catch Android font scaling on small machines
      // where pixel ratio / font scale ratio => 3:3
      if (deviceWidth <= 360) {
        return size;
        // Catch other smaller android height sizings
      }
      if (deviceHeight < 667) {
        return size * 1.2;
        // catch in-between size Androids and scale font up
        // a tad but not too much
      }
      if (deviceHeight >= 667 && deviceHeight <= 735) {
        return size * 1.25;
      }
      // catch larger phablet devices
      return size * 1.4;
    }
  } else {

    if (deviceWidth >= 320 && deviceWidth <= 1024) {
      return size * 0.8;
    }

    return size;
  }

};

type TextProps = {
  children: any,
  fontSize?: number
  [key: string]: any
}

/**
 * The default size of a H1 component is 5em.
 * @param props.fontSize - An optional font size in em
 * @constructor
 */
const H1 = (props: TextProps) => <H1Container {...props}>{props.children}</H1Container>;

const H1Container = styled.h1<{fontSize?: number}>`
  font-size: ${props => getFontSize(props.fontSize ? props.fontSize : 5)}em;
`;

const H2 = (props: TextProps) => <H2Container {...props}>{props.children}</H2Container>;

const H2Container = styled.h2<{fontSize?: number}>`
  font-size: ${props => getFontSize(props.fontSize ? props.fontSize : 4)}em;
`;

const P = (props: TextProps) => <PContainer {...props}>{props.children}</PContainer>;

const PContainer = styled.p<{fontSize?: number}>`
  font-size: ${props => getFontSize(props.fontSize ? props.fontSize : 1)}em;
`;

export {H1, H2, P};

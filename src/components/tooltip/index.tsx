import React from 'react';
import Tippy, {TippyProps} from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

export default function ToolTip(props: TippyProps){

  return (
    <Tippy
      maxWidth={'unset'}
      content={props.content}
      {...props}
    >
      {props.children}
    </Tippy>
  )
}
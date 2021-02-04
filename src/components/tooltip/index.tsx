import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

export default function ToolTip({children, html, ...props}){

  return (
    <Tippy
      maxWidth={'unset'}
      content={html}
      {...props}
    >
      {children}
    </Tippy>
  )
}
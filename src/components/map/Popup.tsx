import {createContext, useContext, useEffect, useRef} from 'react';
import {Popup as MapboxPopup} from 'mapbox-gl'
import React from 'react';

export const Popup = ({ children, map, latitude, longitude, ...mapboxPopupProps }) => {
  // this is a mapbox map instance, you can pass it via props
  const popupRef = useRef();

  useEffect(() => {
    const popup = new MapboxPopup(mapboxPopupProps)
      .setLngLat([longitude, latitude])
      .setDOMContent(popupRef.current)
      .addTo(map);

    popup.remove();
  }, [children, mapboxPopupProps, longitude, latitude]);

  return (
    /**
     * This component has to have 2 divs.
     * Because if you remove outter div, React has some difficulties
     * with unmounting this component.
     * Also `display: none` is solving that map does not jump when hovering
     * ¯\_(ツ)_/¯
     */
    <div style={{ display: 'none' }}>
      <div ref={popupRef}>
        {children}
      </div>
    </div>
  );
};

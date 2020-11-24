import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Help} from 'bloomer';
import {extractErrorMessage} from '../helpers';
import {notify} from '../helpers/views';
import styled from 'styled-components';

export default function SimpleMap(props) {

  const [userLng, setUserLng] = useState('');
  const [userLat, setUserLat] = useState('');

  const mapContainerRef = useRef(null);

  useEffect(() => {

    let nairobiLongitude = 36.817223;
    let nairobiLatitude = -1.286389;

    const nairobiBoundingBox = [
      [36.650938, -1.444471],
      [37.103887, -1.163332],
    ];

    const kenyaBoundingBox = [
      [33.91, -4.9],
      [41.91, 4.62],
    ];

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnJhZGxleWtpbmd6IiwiYSI6ImNrMW9vbGJ0ajBtZ2IzbXRpZTZkbm81YTIifQ.AMi4cIv4A-q8hBjBPUS1JQ';
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: userLng && userLat? 15 : 13,
      center: userLng && userLat ? [userLng, userLat] : [nairobiLongitude, nairobiLatitude],
      maxBounds: kenyaBoundingBox,
    });

    // const geocoder = new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   marker: {
    //     color: 'orange',
    //   },
    //   mapboxgl,
    //   collapsed: true,
    //   countries: 'ke',
    //   localGeocoder: forwardGeocoder,
    //   localGeocoderOnly: true,
    // });
    //
    // map.addControl(geocoder);

    if (userLng && userLat) {
      const marker = new mapboxgl.Marker({
        draggable: true,
        color: 'var(--color-primary)'
      })
        .setLngLat([userLng, userLat])
        .addTo(map);

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        setUserLng(lngLat.lng);
        setUserLat(lngLat.lat);
      });

      if (props.onLocation && typeof props.onLocation === 'function') {
        props.onLocation([userLng, userLat]);
      }

    } else {
      map.fitBounds(nairobiBoundingBox);
    }

  }, [userLng, userLat]);

  function locateUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        setUserLat(userLatitude);
        setUserLng(userLongitude);
      }, (e) => {
        const message = extractErrorMessage(e);
        notify('error', message);
      });
    }

  }

  return (
    <>
      <MapParent
        className={'has-error'}
      >
        <div>
          <div
            style={{height: 500}}
            ref={mapContainerRef}/>
          <Help>
            {props.help}
          </Help>
        </div>
        <Button
          isColor={'primary'}
          onClick={() => locateUser()}>
          Detect your current location
        </Button>
      </MapParent>
    </>
  );
};

const MapParent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

SimpleMap.propTypes = {
  onLocation: PropTypes.func,
  help: PropTypes.string
}
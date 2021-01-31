import mapboxgl, {Map, Marker} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Help} from 'bloomer';
import {extractErrorMessage} from '../../helpers';
import {notify} from '../../helpers/views';
import styled from 'styled-components';
import axios from 'axios';
import AutoCompleteInput from '../input/AutoCompleteInput';
import CurrentLocationIcon from '../../assets/images/icons/current-location.svg';
import {HashLink} from 'react-router-hash-link';

type LocationIQPlace = {
  "place_id": string,
  "osm_id": string,
  "osm_type": string,
  "licence": string,
  "lat": string,
  "lon": string,
  "boundingbox": [
    string,
    string,
    string,
    string
  ],
  "class": string,
  "type": string,
  "display_name": string,
  "display_place": string,
  "display_address": string,
  "address": {
    "name": string,
    "road": string,
    "suburb": string,
    "city": string,
    "state": string,
    "postcode": string,
    "country": string,
    "country_code": string
  }
}

export type LngLat = {
  lat: number,
  lng: number
}

let nairobiLongitude = 36.817223;
let nairobiLatitude = -1.286389;

const nairobiBoundingBox: [number, number, number, number] = [
  36.650938, -1.444471,
  37.103887, -1.163332
];

const kenyaBoundingBox: [number, number, number, number] = [
  33.91, -4.9,
  41.91, 4.62
];

export type LocationItem = {
  location: string,
  value: {
    lat: number,
    lng: number,
    placeId: string
  }
}

type AutoCompleteLocationItem = Pick<LocationItem, 'value'> & {name: string;}

export default function SimpleMap(
  {
    onLocateUser,
    onZoom,
    help,
    initialZoom,
    initialLocation: {
      value: {
        lng: checkoutLng,
        lat: checkoutLat,
        placeId: checkoutPlaceId
      },
      location: checkoutName
    }
  }: {
    onLocateUser?: ([lng, lat]: [number, number], item?: LocationItem)=> void,
    initialZoom?: number,
    onZoom?: (level: number)=> void,
    help?: string,
    initialLocation: LocationItem
  }
  ) {

  const [queryResults, setQueryResults] = useState<Array<AutoCompleteLocationItem>>([]);
  const [userLng, setUserLng] = useState<number>(null);
  const [userLat, setUserLat] = useState<number>(null);

  const mapContainerRef = useRef(null);

  async function geoCodeQuery(q): Promise<[LocationIQPlace]> {
    const response = await axios.get(`https://us1.locationiq.com/v1/autocomplete.php?key=pk.0f7e04f1735b49798174c83d72c1cb41&q=${q}&countrycodes=ke&viewbox=${nairobiBoundingBox.join(",")}&format=json`);
    return response?.data;
  }

  function onMapLocateUser(lngLat: LngLat, location?: LocationItem){
    setUserLng(lngLat.lng);
    setUserLat(lngLat.lat);

    if (typeof onLocateUser === 'function') {
      onLocateUser([lngLat.lng, lngLat.lat], location);
    }
  }

  useEffect(() => {

    mapboxgl.accessToken = 'pk.eyJ1IjoiYnJhZGxleWtpbmd6IiwiYSI6ImNrMW9vbGJ0ajBtZ2IzbXRpZTZkbm81YTIifQ.AMi4cIv4A-q8hBjBPUS1JQ';
    const map = new Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: initialZoom ? initialZoom : userLng && userLat? 15 : 13,
      center: userLng && userLat ? [userLng, userLat] : [nairobiLongitude, nairobiLatitude],
      maxBounds: kenyaBoundingBox,
    });

    if (userLng && userLat) {
      const marker = new Marker({
        draggable: true,
        color: 'var(--color-primary)'
      })
        .setLngLat([userLng, userLat])
        .addTo(map);

      map.on('click', ({lngLat})=>{
        marker.setLngLat(lngLat);
        map.getCanvas().style.cursor = 'pointer'
        onMapLocateUser(lngLat);
      })

      map.on('zoom', ()=> {
        if (typeof onZoom === 'function') {
          onZoom(map.getZoom())
        }
      })

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        onMapLocateUser(lngLat);
      });

    } else if (checkoutLat && checkoutLng ){
      // if no address has been set yet,
      // set the address passed to this component by the parent
      // if it exists, it'll probably be passed down from state (redux)
      setUserLng(checkoutLng);
      setUserLat(checkoutLat);
      // consequently, that should cause this component to re-render
      // and the first block in this statement will be called
    } else {
      map.fitBounds(nairobiBoundingBox);
    }

  }, [userLng, userLat, checkoutLng, checkoutLat]);

  function locateUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        onMapLocateUser({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })

      }, (e) => {
        const message = extractErrorMessage(e);
        notify('error', message);
      });
    }

  }

  async function onAutoCompleteInputChange(value: any): Promise<Array<AutoCompleteLocationItem>> {
    if (value && value.length >= 5) {
      const data = await geoCodeQuery(value);
      return data.map((item)=> {
        return {
          value: {
            placeId: item.place_id,
            lat: Number(item.lat),
            lng: Number(item.lon),
          },
          name: item.display_name
        }
      })
    }

    return [];
  }

  return (
    <>
      <MapParent>
        <div>
          <div style={{display: 'flex'}}>
            <AutoCompleteInput
              label={"Search for a place"}
              help={()=> (
                  <HashLink to={`/support/delivery/maps#trouble-finding-location`}>
                    <Help>
                      Can't find your location?
                    </Help>
                  </HashLink>
              )}
              items={queryResults}
              initialItem={{
                name: checkoutName === undefined ? null: checkoutName,
                value: {
                  lng: checkoutLng,
                  lat: checkoutLat,
                  placeId: checkoutPlaceId
                }
              }}
              placeholder={'Your search query'}
              actionItem={()=> (
                <Button
                  isOutlined={true}
                  style={{padding: 9, borderWidth: 2}}
                  title={'Detect your current location'}
                  onClick={()=> locateUser()}>
                  <img
                    src={CurrentLocationIcon}
                    alt={'target icon'}
                       style={{width: 28}}/>
                </Button>
              )}
              onClickItem={(item: AutoCompleteLocationItem)=> {
                onMapLocateUser({
                  lat: item.value.lat,
                  lng: item.value.lng
                }, {
                  ...item,
                  location: item.name
                })
              }}
              onInputChange={async (value)=> {
                const results = await onAutoCompleteInputChange(value);
                if (results) {
                  setQueryResults(results)
                }
              }} />
          </div>
          <div
            style={{height: 500}}
            ref={mapContainerRef}/>
          <Help>
            {help}
          </Help>
          <div>
            <Button
              onClick={()=> {
                onMapLocateUser({lat: null, lng: null}, null);
              }}
            >
              Clear marker
            </Button>
          </div>
        </div>
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
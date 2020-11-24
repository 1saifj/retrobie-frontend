import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import places from 'places.js';
import {Input} from 'bloomer';


export default function PlacesField(props) {

  const [address, setAddress] = useState('');

  useEffect(() => {
    const placesAutocomplete = places({
      appId: 'pl25DFJIJLY9',
      apiKey: '7ffea3a2b0e0b9e5decd29a5fbbb43ab',
      container: document.querySelector('#address-input')
    });
    placesAutocomplete.configure({
      countries: ['ke'],
    });
    placesAutocomplete.on('change', (e) => {
      console.log('Agolia Received', e);
    });
  }, []);

  function handleChange(e) {
    setAddress(e);
    if (props.onChange && typeof props.onChange === 'function') {
      props.onChange(e);
    }
  }

  async function handleSelect(address) {
    if (props.onSelect && typeof props.onSelect === 'function') {
      props.onSelect(address);
    }
  }


  return (
    <>
      <Input id={'address-input'}/>
    </>
  );
};

PlacesField.propTypes = {
  onChange: PropTypes.func,
  onSelect: PropTypes.func
}
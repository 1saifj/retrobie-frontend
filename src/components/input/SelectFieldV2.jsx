import React from 'react';
import Downshift from 'downshift';
import {capitalize} from '../../helpers';
import {Input} from 'bloomer';
import PropTypes from 'prop-types';
import {AlertTriangle} from 'react-feather';


export default function SelectFieldV2(props) {

  function getItems(inputValue) {
    return props.items
      .filter(item => !inputValue || item.value.toLowerCase()
        .includes(inputValue.toLowerCase()));
  }

  return (
    <div>
      <Downshift
        onChange={value => {
          if (props.onChange && typeof props.onChange === 'function') {
            props.onChange(value);
          }
        }}
        itemToString={item => (item ? capitalize(item.value) : '')}
      >
        {({
            getInputProps,
            getItemProps,
            getLabelProps,
            getMenuProps,
            isOpen,
            openMenu,
            inputValue,
            highlightedIndex,
            selectedItem,
            getRootProps,
          }) => (
          <div style={{position: 'relative'}}>
            <div
              style={{display: 'inline-block'}}
              {...getRootProps({}, {suppressRefError: true})}
            >
              <label {...getLabelProps()}>
                {props.label}
              </label>
              <Input {...getInputProps()}
                     placeholder={props.placeholder}
                     onFocus={() => openMenu()}
              />
            </div>
            <ul {...getMenuProps({
              style: {
                padding: 0,
                border: isOpen ? '1px solid #ccc' : 'none',
                borderRadius: '2px',
                position: 'absolute',
                background: 'white',
                zIndex: '1',
                maxHeight: 250,
                overflowY: isOpen && getItems(inputValue)?.length ? 'scroll' : '',
                scrollbarWidth: isOpen ? '' : 'none',
                boxShadow: '0 2px 0 rgba(0, 0, 0, 0.06)',
              },
            })}>
              {isOpen
                ?
                getItems(inputValue).length ?
                  (
                    getItems(inputValue)
                      .map((item, index) => (
                        <li
                          {...getItemProps({
                            key: item.value,
                            index,
                            item,
                            style: {
                              margin: 0,
                              padding: '12px 12px',
                              backgroundColor:
                                highlightedIndex === index ? '#e5e5e5' : 'white',
                              cursor:
                                highlightedIndex === index ? 'pointer' : 'normal',
                              fontWeight: selectedItem === item ? 'bold' : 'normal',
                              listStyle: 'none',
                              transition: 'all 0.25s ease-in-out',
                            },
                          })}
                        >
                          {item.value}
                        </li>
                      ))
                  ) : (
                    <div style={{
                      padding: '0 12px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      minWidth: '250px',
                    }}>
                      <AlertTriangle/>
                      <p>
                        No data to show
                      </p>
                    </div>
                  )
                : null}
            </ul>
          </div>
        )}
      </Downshift>
    </div>
  );
};

SelectFieldV2.propTypes = {
  items: PropTypes.arrayOf({value: PropTypes.string}),
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func
}
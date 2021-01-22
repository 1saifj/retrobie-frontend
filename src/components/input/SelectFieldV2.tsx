import React, {useState} from 'react';
import Downshift, {useCombobox, useSelect} from 'downshift';
import {capitalize} from '../../helpers';
import {Input} from 'bloomer';
import {AlertTriangle} from 'react-feather';


export default function SelectFieldV2({onChange, items, label, placeholder}: {
  onChange?: Function,
  items: Array<{value: string}>,
  label: string,
  placeholder: string
}) {
  const [inputItems, setInputItems] = useState(items);

  const {
    isOpen,
    getComboboxProps,
    getLabelProps,
    getItemProps,
    getInputProps,
    getMenuProps,
    highlightedIndex,
    selectedItem,
    openMenu,
    closeMenu
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({inputValue}) => {
      setInputItems(
        items.filter(item => item.value.toLowerCase().includes(inputValue?.toLowerCase())),
      );
    },
  });

  return (
    <div>
      <div
        style={{display: 'inline-block'}}
        {...getComboboxProps()}
      >
        <label {...getLabelProps()}>
          {label}
        </label>
        <input
          className={'input'}
          {...getInputProps()}
          placeholder={placeholder}
          onFocus={() => openMenu()}
          onBlur={()=> closeMenu()}
        />
      </div>
      <div>
        <ul {...getMenuProps({
          style: {
            padding: 0,
            border: isOpen ? '1px solid #ccc' : 'none',
            borderRadius: '2px',
            position: 'absolute',
            background: 'white',
            zIndex: 1,
            maxHeight: 250,
            overflowY: isOpen && inputItems?.length ? 'scroll' : 'hidden',
            scrollbarWidth: 'none',
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.06)',
          },
        })}>
          {
            isOpen && inputItems.length ?
              (
                inputItems.map((item, index) => (
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
            }
        </ul>
      </div>
    </div>
  );
};
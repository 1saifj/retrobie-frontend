import React, {useEffect, useState} from 'react';
import {useCombobox} from 'downshift';
import styled from 'styled-components';
import {Tooltip} from 'react-tippy';
import Loading from '../loading';
import useScreenSize from 'use-screen-size';
import {Help} from 'bloomer';

export type AutocompleteItem = {
  name: string,
  value: unknown
}

export default function AutoCompleteInput(
  {
    placeholder,
    items,
    onInputChange,
    onClickItem,
    label,
    initialItem,
    help,
    actionItem: ActionItem
  }: {
    placeholder: string;
    items: Array<AutocompleteItem>
    onInputChange?: (e) => void;
    onClickItem?: (item: AutocompleteItem) => void
    label: string,
    help?: string | Function
    initialItem?: AutocompleteItem
    actionItem?: Function
  }) {

  const [inputItems, setInputItems] = useState<Array<AutocompleteItem>>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<AutocompleteItem>(initialItem);
  const [loading, setLoading] = useState(false);
  const size = useScreenSize()

  useEffect(()=> {
    // and there is no initial item provided
    if (!selectedItem) {
      setSelectedItem(initialItem);
    }
  }, [initialItem])

  const {
    isOpen,
    inputValue,
    openMenu,
    closeMenu,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => item?.name,
    selectedItem,
    onInputValueChange: async ({inputValue}) => {
      setLoading(true);
      if (typeof onInputChange === 'function') {
        // a little hack we use to check whether the values were provided by
        // the forward geocoder or a user
        // we don't ever expect the user to enter values more than 10 chars long
        if (inputValue?.length < 10) {
          await onInputChange(inputValue);
        }
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    setInputItems(items);
  }, [items]);

  function onSelectedItem(selectedItem: AutocompleteItem, index) {
    closeMenu();

    setSelectedIndex(index);
    setSelectedItem(selectedItem);
    if (typeof onClickItem === 'function') {
      onClickItem(selectedItem);
    }
  }

  return (
    <div style={{width: '100%'}}>
      <ul
        style={{
          padding: "12px 0",
          maxHeight: 300,
          overflowY: 'auto',
        }}
        {...getMenuProps()}
      >
        <Tooltip
          open={isOpen}
          interactive={true}
          theme={'light'}
          position={size.width < 600 ? 'bottom': 'bottom-start'}
          distance={10}
          popperOptions={{
            modifiers: {
              preventOverflow: {
                enabled: false,
              },
              flip: {
                enabled: false,
              },
            },
          }}
          html={(
            <div style={{
              width: size.width < 600 ? "90vw" : "auto",
              maxHeight: "60vh",
              overflow: "auto"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                height: "100%"
              }}>
                {
                  loading ?
                    <div style={{alignSelf: 'center'}}>
                      <Loading inline minor/>
                    </div>
                    :
                    inputItems?.length === 0  ?
                    (
                      <div style={{alignSelf: 'center'}}>
                        <p>
                          Please enter a new search query
                        </p>
                      </div>
                    ):
                      <div>
                        <div style={{textAlign: 'left'}}>
                          {
                            inputItems.length !== 0 &&
                            (
                              <div
                              >
                                {
                                  inputItems.map((item, index) => (
                                    <div
                                      onClick={() => onSelectedItem(item, index)}
                                    >
                                      <DropdownItem
                                        selected={selectedIndex === index}
                                        highlighted={highlightedIndex === index}
                                        key={`${item.name}${index}`}
                                        {...getItemProps({item, index})}
                                      >
                                        {item.name}
                                      </DropdownItem>
                                    </div>
                                  ))
                                }
                              </div>
                            )
                          }
                        </div>
                      </div>
                }
              </div>
            </div>
          )}
        >
          <div>
            <div {...getComboboxProps()}>
              <label {...getLabelProps()}>{label}</label>
              <InputParent>
                <input
                  style={{flex: ' 1 auto'}}
                  className={'input'}
                  onFocus={() => openMenu()}
                  onBlur={() => closeMenu()}
                  {...getInputProps()}
                  placeholder={placeholder}
                />
                <div style={{flex: '1 2 auto'}}>
                  {
                    ActionItem &&
                    ActionItem()
                  }
                </div>
              </InputParent>
              {
                typeof help === "string" ? (
                  <Help>
                    {help}
                  </Help>
                ) : (
                  <>
                    {help()}
                  </>
                )
              }
            </div>
          </div>
        </Tooltip>

      </ul>
    </div>
  );
};

const InputParent = styled.div`
  display: flex; 
  align-items: center;
  gap: 6px;
`

const DropdownItem = styled.li<{selected: boolean; highlighted: boolean}>`
  background-color: 
  ${
  p => p.selected ?
    '#bde4ff' :
    p.highlighted ?
      '#eee' :
      '#fff'
};
  padding: 12px;
  border-radius: 2px;
  transition: 0.25s ease-in-out;
  list-style: none;
  margin: 10px 12px 10px 0;
  border-bottom: 1px solid #eeeeee;
  
  &:hover {
    cursor:pointer;
  }
`;
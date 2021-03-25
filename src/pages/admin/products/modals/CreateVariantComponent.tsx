import {FieldArray} from 'formik';
import React, {useState} from 'react';
import {capitalize} from '../../../../helpers';
import {ProductOptionValue, ProductTypeType} from '../../../../types';
import {CheckboxField, TextField} from '../../../../components/input';
import {Column, Columns} from 'bloomer';
import { Trash2 } from 'react-feather';
import styled from 'styled-components';
import RadioField from '../../../../components/input/RadioField';


const CreateVariantComponent = (
  {
    allProductTypes,
    selectedProductType,
    onDeleteVariant,
    index,
  }: {
    allProductTypes: ProductTypeType[],
    selectedProductType: string,
    onDeleteVariant: Function,
    index: number
  })=> {

  if (!selectedProductType) return <span/>

  return (
    <VariantParent className="bordered">
      <header>
        <div>
          <h4>Variant #{index + 1}</h4>
        </div>
        <div className="trash" onClick={()=> onDeleteVariant(index)}>
          <Trash2/>
        </div>
      </header>
      <Columns>
        <Column>
          <TextField
            label={'Variant name'}
            name={`variants.${index}.name`}
            placeholder={'The name of this variant'}
            type={'text'}
          />
        </Column>
        <Column>
          <TextField
            label={'Stock count'}
            name={`variants.${index}.inStock`}
            placeholder={'e.g. 5'}
            type={'number'}
          />
        </Column>
      </Columns>
      <Columns>
        <Column>
          <TextField
            label={'Price'}
            name={`variants.${index}.originalPrice`}
            placeholder={'e.g. 5000'}
            type={'number'}
            help={"Leave this field blank if it costs the same as the product."}
          />
        </Column>
        <Column>
          <CheckboxField
            label={'Is this variant on offer?'}
            name={`variants.${index}.isOnOffer`}
          />
        </Column>
      </Columns>
      <FieldArray
        name={`variants.${index}.options`}
        render={(arrayHelpers)=> (
          <div className="product-types">
            {
              allProductTypes
                ?.find(type => type.uuid === selectedProductType)
                ?.options.map((option, optionIndex) => (
                <div className="bordered small product-type" key={option.uuid}>
                  <div>
                    <h4>
                      {capitalize(option.name)}
                    </h4>
                    <div
                      className="option">
                      <RadioField
                        name={`variants.${index}.options.${optionIndex}.value`}
                        bordered={true}
                        onChange={(value, index)=> arrayHelpers.replace(optionIndex, {
                          name: option.name,
                          uuid: option.uuid,
                          value: {
                            uuid: value,
                            value: option.values[index].value
                          }
                        })}
                        isGroup={true}
                        inline={true}
                        options={option.values.map((value, index) => ({
                          value: value.uuid,
                          label: capitalize(value.value)
                        }))}
                      />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      />
    </VariantParent>
  );
}

export default CreateVariantComponent;

const VariantParent = styled.div`
  width: 100%;
  header {
   display: flex; 
   align-items: center;
   justify-content: space-between
  }
  
  .trash {
    &:hover {
      cursor:pointer;
      opacity: 0.8;
    }
  }
`;

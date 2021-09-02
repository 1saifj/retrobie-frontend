import {FieldArray} from 'formik';
import React, {useEffect, useState} from 'react';
import {capitalize} from '../../../../helpers';
import {ProductTypeOptionValue, ProductTypeType} from '../../../../types';
import {CheckboxField, TextField} from '../../../../components/input';
import {Column, Columns} from 'bloomer';
import { Trash2 } from 'react-feather';
import styled from 'styled-components';
import RadioField from '../../../../components/input/RadioField';


const CreateVariantComponent = (
  {
    allProductTypes,
    productTypeId,
    onDeleteVariant,
    variantIndex,
  }: {
    allProductTypes: Array<ProductTypeType>
    productTypeId: string,
    onDeleteVariant: Function,
    variantIndex: number
  })=> {

  if (!productTypeId) return <span/>


  return (
    <VariantParent className="bordered">
      <header>
        <div>
          <h4>Variant #{variantIndex + 1}</h4>
        </div>
        <div className="trash" onClick={()=> onDeleteVariant(variantIndex)}>
          <Trash2/>
        </div>
      </header>
      <Columns>
        <Column>
          <TextField
            label={'Variant name'}
            name={`variants.${variantIndex}.name`}
            placeholder={'The name of this variant'}
            type={'text'}
          />
        </Column>
        <Column>
          <TextField
            label={'Stock count'}
            name={`variants.${variantIndex}.inStock`}
            placeholder={'e.g. 5'}
            type={'number'}
          />
        </Column>
      </Columns>
      <Columns>
        <Column>
          <TextField
            label={'Price'}
            name={`variants.${variantIndex}.originalPrice`}
            placeholder={'e.g. 5000'}
            type={'number'}
            help={"Leave this field blank if it costs the same as the product."}
          />
        </Column>
        <Column>
          <CheckboxField
            label={'Is this variant on offer?'}
            name={`variants.${variantIndex}.isOnOffer`}
          />
        </Column>
      </Columns>
      <FieldArray
        name={`variants.${variantIndex}.options`}
        render={(arrayHelpers)=> (
          <div className="product-type-options">
            {
              allProductTypes
                ?.find(type => type.uuid === productTypeId)
                ?.options?.map((option, optionIndex) => (
                <div className="bordered small product-type" key={option.uuid}>
                  <div>
                    <h4>
                      {capitalize(option.name)}
                    </h4>
                    <div
                      className="option">
                      <RadioField
                        name={`variants.${variantIndex}.options.${optionIndex}.value`}
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
  
  .product-type-options {
    display: flex;
    gap: 1rem;
  }
`;

import {FieldArray} from 'formik';
import React from 'react';
import {capitalize} from '../../../../helpers';
import {ProductTypeOption, ProductTypeOptionValue, VariantType} from '../../../../types';
import {CheckboxField, TextField} from '../../../../components/input';
import {Column, Columns} from 'bloomer';
import styled from 'styled-components';
import RadioField from '../../../../components/input/RadioField';


const EditVariantComponent = (
  {
    productTypeOptions,
    optionValues,
  }: {
    productTypeOptions: Array<ProductTypeOption>
    optionValues: Array<ProductTypeOptionValue>
  })=> {

  return (
    <VariantParent className="bordered">
      <header>
        <div>
          <h4>Primary Details</h4>
        </div>
      </header>
      <Columns>
        <Column>
          <TextField
            label={'Variant name'}
            name={`name`}
            placeholder={'The name of this variant'}
            type={'text'}
          />
        </Column>
        <Column>
          <TextField
            label={'Price'}
            name={`originalPrice`}
            placeholder={'e.g. 5000'}
            type={'number'}
            help={"Leave this field blank if it costs the same as the product."}
          />
        </Column>
      </Columns>
      <Columns>
        <Column>
          <CheckboxField
            label={'Is this variant on offer?'}
            name={`isOnOffer`}
          />
        </Column>
      </Columns>
      <Columns>
        <Column>
          <TextField
            label={'Stock count'}
            name={`stock.quantity`}
            placeholder={'e.g. 5'}
            type={'number'}
          />
        </Column>
        <Column>
          <TextField
            label={'Warehouse'}
            disabled
            name={`stock.warehouse.name`}
            placeholder={'e.g. 5'}
            type={'text'}
          />
        </Column>

      </Columns>
      <Columns>
        <Column>
          <TextField
            label={'Slug'}
            disabled
            name={`slug`}
            placeholder={'e.g. slug'}
            type={'text'}
          />
        </Column>

      </Columns>
      <div>
        <h4>Product type options</h4>
        <FieldArray
          name={`optionValues`}
          render={(arrayHelpers)=> (
            <div className="product-type-options">
              {
                productTypeOptions?.map((option, optionIndex) => (
                  <div className="bordered small product-type" key={option.uuid}>
                    <div>
                      <h4>
                        {capitalize(option.name)}
                      </h4>
                      <div className="option">
                        <RadioField
                          name={`optionValues.${optionIndex}.value`}
                          bordered={true}
                          onChange={(value, index)=> arrayHelpers.replace(optionIndex, {
                            uuid: value,
                            // using 'value' as a key here
                            // causes it not to show up on the resulting object.
                            // not sure why
                            optionValue: option.values[index].value
                          })}
                          isGroup={true}
                          inline={true}
                          selectedGroupItems={optionValues?.map(optionValue=> ({
                            label: optionValue.value,
                            value: optionValue.uuid
                          }))}
                          options={option.values.map((optionValue) => ({
                            value: optionValue.uuid,
                            label: capitalize(optionValue.value)
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

      </div>
    </VariantParent>
  );
}

export default EditVariantComponent;

const VariantParent = styled.div`
  width: 100%;
  header {
   display: flex; 
   align-items: center;
   justify-content: space-between
  }
  
  .product-type-options {
    display: flex;
    gap: 1rem;
  }
`;

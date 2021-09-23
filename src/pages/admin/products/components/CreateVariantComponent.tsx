import {FieldArray} from 'formik';
import React, {useEffect, useState} from 'react';
import defaultHelpers, {capitalize} from '../../../../helpers';
import {ProductTypeOptionValue, ProductTypeType} from '../../../../types';
import {CheckboxField, TextField} from '../../../../components/input';
import {Column, Columns} from 'bloomer';
import { Trash2 } from 'react-feather';
import styled from 'styled-components';
import RadioField from '../../../../components/input/RadioField';
import ImageUploader from '../../../../components/uploader/ImageUploader';


const CreateVariantComponent = ({allProductTypes, onDeleteVariant, productTypeId, folder, values, name, setFieldValue, variantIndex}: {
  allProductTypes: Array<ProductTypeType>
  productTypeId: string,
  onDeleteVariant: Function,
  variantIndex: number,
  setFieldValue: Function,
  values,
  folder: string
  name: string
}) => {

  const [uploaderName, setUploaderName] = useState(name);

  useEffect(() => {
    setUploaderName(name);
  }, [name]);

  if (!productTypeId) {
    return <span>No productId provided</span>;
  }

  return (
    <VariantParent className="bordered">
      <header>
        <div>
          <h4>Variant #{variantIndex + 1}</h4>
        </div>
        <div className="trash" onClick={() => onDeleteVariant(variantIndex)}>
          <Trash2 />
        </div>
      </header>
      <ImageUploader
        folder={folder}
        onIdGenerated={({uploadedImages}) => setFieldValue(`variants.${(variantIndex)}.images`, uploadedImages)}
        onUpload={(err, {uploadedImage}) => {
          const images = values.variants[variantIndex].images;
          const uploadedImages = images?.length ? [...images, uploadedImage] : [uploadedImage];
          setFieldValue(`variants.${(variantIndex)}.images`, uploadedImages);
        }}
        allowMultiple={true}
        id={uploaderName} />

      <Columns>
        <Column>
          <TextField
            label={'Variant name'}
            name={`variants.${(variantIndex)}.name`}
            placeholder={'The name of this variant'}
            type={'text'}
          />
        </Column>
      </Columns>
      <Columns>
        <Column>
          <TextField
            label={'Price'}
            name={`variants.${(variantIndex)}.originalPrice`}
            placeholder={'e.g. 5000'}
            type={'number'}
            help={'Leave this field blank if it costs the same as the product.'}
          />
        </Column>
        <Column>
          <CheckboxField
            label={'Is this variant on offer?'}
            name={`variants.${(variantIndex)}.isOnOffer`}
          />
        </Column>
      </Columns>
      <h4>Stock Information</h4>
      <Columns>
        <Column>
          <TextField
            label={'Stock count'}
            name={`variants.${(variantIndex)}.stock.quantity`}
            placeholder={'e.g. 5'}
            type={'number'}
          />
        </Column>
        <Column>
          <TextField
            label={'Cost price'}
            name={`variants.${(variantIndex)}.stock.costPrice`}
            placeholder={'e.g. 5'}
            type={'number'}
          />
        </Column>
      </Columns>
      <FieldArray
        name={`variants.${(variantIndex)}.options`}
        render={(arrayHelpers) => (
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
                        name={`variants.${(variantIndex)}.options.${optionIndex}.value`}
                        bordered={true}
                        onChange={(value, index)=> arrayHelpers.replace(optionIndex, {
                          name: option.name,
                          uuid: option.uuid,
                          attribute: {
                            uuid: value,
                            value: option.values[index].value,
                          },
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

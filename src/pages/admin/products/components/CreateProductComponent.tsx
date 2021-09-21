import React from 'react';
import {FieldArray} from 'formik';
import {Button, Columns} from 'bloomer';
import CreateVariantComponent from './CreateVariantComponent';
import {ProductTypeType, VariantType} from '../../../../types';


function CreateProductComponent(props: {
  allProductTypes: Array<ProductTypeType>;
  setFieldValue
  values

}){

  return (
    <div className="bordered">
      <h4>Product variants</h4>
      <p>
        Select <b>one</b> value in every
        one of the available variant options.
      </p>
      <div>
        <FieldArray
          name={'variants'}
          render={arrayHelpers=> (
            <div>
              <div>
                {
                  props.values.variants?.map((variant, index) => (
                    <Columns>
                      <CreateVariantComponent
                        variantIndex={index}
                        onDeleteVariant={(index) => arrayHelpers.remove(index)}
                        productTypeId={props.values.productTypeId}
                        allProductTypes={props.allProductTypes}
                        setFieldValue={props.setFieldValue}
                        name={variant.name}
                        values={props.values}
                        folder={props.values.folder}
                      />
                    </Columns>
                  ))
                }
              </div>
              <div>
                <Button
                  onClick={() => arrayHelpers.push({})}
                  style={{width: '100%'}}>
                  Add variant
                </Button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default CreateProductComponent;

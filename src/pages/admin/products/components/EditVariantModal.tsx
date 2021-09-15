import CustomModal from '../../../../components/CustomModal';
import {Form, Formik} from 'formik';
import ImageUploader from '../../../../components/uploader/ImageUploader';
import EditVariantComponent from './EditVariantComponent';
import React from 'react';
import {ProductTypeOption, VariantType} from '../../../../types';
import {Button} from 'bloomer';
import {useApi, useNotify} from '../../../../hooks';
import defaultHelpers, {extractErrorMessage} from '../../../../helpers';
import useSWR from 'swr/esm/use-swr';
import {useDispatch} from 'react-redux';
import {deleteUploadedImageAction} from '../../../../state/actions';


const EditVariantModal = (props: {
  variantId: string,
  onClose: Function,
  isActive: boolean,
  productTypeOptions: Array<ProductTypeOption>
}) => {

  const api = useApi();
  const notify = useNotify();
  const dispatch = useDispatch();

  const uploaderId = 'create-or-edit-variant-modal';

  const singleVariantFetcher = () => api.variants.getOne(props.variantId).then(({data}) => data);
  const {data: workingVariant} = useSWR<VariantType>(props.variantId ? `/variants/${props.variantId}` : undefined, singleVariantFetcher);

  if (!workingVariant) return <span />;

  const removeLocalUploaderId = (id) => {
    return dispatch(deleteUploadedImageAction({uploaderId: id}));
  };

  return (
    <div>
      <CustomModal
        onClose={() => props.onClose()}
        closeOnClickBackground={true}
        isActive={props.isActive}>
        <div>
          <h2>{workingVariant.name}</h2>
          <h5>View or edit this varian't details. </h5>

          <Formik
            initialValues={{
              ...workingVariant,
              stock: {
                ...workingVariant.stock,
                warehouse: {
                  name: "retrobie warehouse"
                }
              }
            }}
            onSubmit={async (values, {setSubmitting}) => {
              const {uuid, ...rest} = values;

              let noNewImages = defaultHelpers.arraysEqual(workingVariant.images, values.images);

              // @ts-ignore
              let diff = defaultHelpers.objectDiff(workingVariant, values);

              // Delete them from the object if they don't exist
              if (noNewImages) {
                delete diff.images;
              } else {
                // otherwise, delete the 'local' id used by the image uploader
                rest.images = diff.images.map((image: any) => {
                  const {id, ...rest} = image;

                  return rest;
                });
              }

              // @ts-ignore
              const {optionValues} = rest;

              try {
                // const diff = defaultHelpers.objectDiff(workingVariant.optionValues, optionValues);
                const editedValues = optionValues.filter(value => {
                  // only include options values that use 'optionValue'
                  // as a key
                  // @ts-ignore
                  return value.optionValue;
                }).map(value => ({
                  // @ts-ignore
                  value: value.optionValue,
                  uuid: value.uuid,
                }));


                await api.variants.updateOne({
                  uuid,
                  payload: {
                    ...rest,
                    optionValues: editedValues,
                  },
                });

                removeLocalUploaderId(uploaderId);
                setSubmitting(false);
                notify.success('Updated variant successfully.');
                // props.onClose();
              } catch (e){
                const message = extractErrorMessage(e);
                notify.error(message);
                setSubmitting(false);
              }
            }}
          >
            {({values, isSubmitting, setFieldValue}) => (
              <Form>
                <div>
                  <div className='bordered'>
                    <ImageUploader
                      folder={'fold'}
                      onUpload={(err, {images, uploaderId}) => {
                        setFieldValue('images', images);
                      }}
                      allowMultiple={true}
                      onInit={(images) => {
                        setFieldValue('images', images);
                      }}
                      id={uploaderId} />
                  </div>
                  <div>
                    <EditVariantComponent
                      productTypeOptions={props.productTypeOptions}
                      optionValues={values.optionValues}
                    />
                  </div>
                  <div>
                    <Button
                      style={{width: "100%", marginTop: '1rem'}}
                      type="submit"
                      isColor="primary">
                      Submit
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </CustomModal>
    </div>

  )

}

export default EditVariantModal;

import React from 'react';
import CustomModal from '../../../../components/CustomModal';
import {Form, Formik} from 'formik';
import {TextField} from '../../../../components/input';
import {Button} from 'bloomer';
import ImageUploader from '../../../../components/uploader/ImageUploader';
import {slugify} from '../../../../helpers';
import {useDispatch} from 'react-redux';
import {useApi} from '../../../../hooks';

export default function({isActive, onClose}){

  const api = useApi();
  const dispatch = useDispatch();

  return (
    <div>
      <CustomModal
        closeOnClickBackground={true}
        isActive={isActive} onClose={onClose}>
        <div>
          <h2>Create a New Category</h2>
          <div>
            <Formik
              initialValues={{
                name: '',
                landingImage: null,
                description: '',
              }}
              onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true);
                await dispatch<any>(api.category.create({
                  ...values,
                  description: {
                    seo: values.description,
                  },
                }));
                setSubmitting(false);
                onClose();
              }}>
              {({values, setFieldValue, isSubmitting}) => (
                <Form>
                  <ImageUploader
                    folder={`/category/${slugify(values.name, {strict: true})}`}
                    id={values.name}
                    onUpload={(err, {uploadedImage}) => {
                      if (!err) {
                        setFieldValue('landingImage', uploadedImage);
                      }
                    }}
                    allowMultiple={false} />
                  <TextField
                    type={'text'}
                    label={'Category Name'}
                    name={'name'}
                    placeholder={'eg. Men\'s Shoes'}
                  />
                  <TextField
                    label={'Description'}
                    name={'description'}
                    placeholder={'eg. dope shoes'}
                    type={'textarea'} />

                  <div style={{marginTop: 12}}>
                    <Button
                      isLoading={isSubmitting}
                      isColor={'primary'} type={'submit'}>
                      Submit
                    </Button>
                  </div>
                </Form>

              )}
            </Formik>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

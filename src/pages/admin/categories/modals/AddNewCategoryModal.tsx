import React from 'react';
import CustomModal from '../../../../components/CustomModal';
import {Form, Formik} from 'formik';
import {TextField} from '../../../../components/input';
import {Button} from 'bloomer';
import CustomImageUploader from '../../../../components/upload/CustomImageUploader';
import {slugify} from '../../../../helpers';
import {useDispatch} from 'react-redux';
import {useAuth} from '../../../../hooks';

export default function({isActive, onClose}){

  const api = useAuth();
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
                landingImage: null
              }}
              onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true);
                await dispatch<any>(api.category.create(values));
                setSubmitting(false);
                onClose();
              }}>
              {({values, setFieldValue, isSubmitting})=>(
                <Form>
                  <CustomImageUploader
                    id={slugify(values.name, {strict: true})}
                    onInit={(images => {
                      if (images && images.length) {
                        setFieldValue('landingImage', images[0])
                      }
                    })}
                    onUpload={(err, images) => {
                      if (!err){
                        setFieldValue('landingImage', images[0])
                      }
                    }}
                    allowMultiple={false}/>
                  <TextField
                    label={'Category Name'}
                    name={'name'}
                    placeholder={'eg. Men\'s Shoes'}
                  />

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
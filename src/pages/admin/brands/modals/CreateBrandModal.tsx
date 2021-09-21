/**
 * TODO:
 *  - Save images locally
 *  - Improve loading, success & error ux
 *  - Get 'add more' working
 */

import React, {useEffect} from 'react';
import {Button, Checkbox, Field, Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import {Form, Formik, useFormikContext} from 'formik';
import {Persist} from 'formik-persist';
import TextField from '../../../../components/input/TextField';
import '../../../../assets/style/bulma-fx';
import {v4 as uuidv4} from 'uuid';
import {notify} from '../../../../helpers/views';
import {cleanString, extractErrorMessage} from '../../../../helpers';
import * as Yup from 'yup';
import {useApi} from '../../../../network';
import {useDispatch} from 'react-redux';
import {PromiseThunk} from '../../../../types';
import ImageUploader from '../../../../components/uploader/ImageUploader';

const CreateBrandValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required("This field is required")
        .min(2, "Too short")
        .max(64, "Too long"),
    long: Yup.string()
        .required("This field is required")
        .min(180, "Should be at least 180 characters long")
        .max(320, "Too long"),
    seo: Yup.string()
        .required("This field is required")
        .min(80, "SEO copy should not be less than 80 chars")
        .max(130, "SEO copy should not be more than 130 chars"),
    uuid: Yup.string().required(),
    abbrev: Yup.string().required().min(2)

})


const uuid = uuidv4();

/**
 * This function is called every time a value changes somewhere on the form.
 * @returns {*}
 * @constructor
 */
function Monitor() {
    const {values} = useFormikContext<{name: string; abbrev: string; slug: string}>();

    useEffect(() => {
        // If the form contains a value for 'name'
        if (values.name) {
            // Replace any spaces in the name with an empty string
            const cleanName = cleanString(values.name, "");
            // If no abbrev has been provided, is too short or the clean string is less than 4 chars long
            if (!values.abbrev || values.abbrev.length < 3 || cleanName.length <= 3) {
                values.abbrev = cleanName.substr(0, 3).toUpperCase();
            }

            const sluggified = cleanString(values.name, "-")
            values.slug = sluggified.toLowerCase();


        } else {
            // If no name has been provided, empty the abbrev field
            values.abbrev = "";
            values.slug = ""
        }
    }, [values]);

    return <span/>
}


const CreateBrandModal = (
  {
      isActive,
      onClose,
      onCreate,
      onError
  }: {
      isActive?,
      onClose?,
      onCreate?,
      onError?
  }) => {
    const api = useApi();
    const dispatch = useDispatch<PromiseThunk<any>>();

  return (
    <>
      <div>
        <Modal isActive={isActive} className={'modal-fx-fadeInScale'}>
          <ModalBackground onClick={() => onClose()} />
          <ModalContent>
            <div style={{
              background: 'white',
              display: isActive ? 'block' : 'none',
              padding: '24px',
              borderRadius: '4px',
              textAlign: 'left',
            }}>
              <h2>Create a new brand</h2>

              <Formik
                initialValues={{
                  name: '',
                  long: '',
                  short: '',
                  seo: '',
                  uuid,
                  slug: '',
                  logo: null,
                }}
                validationSchema={CreateBrandValidationSchema}
                onSubmit={async (values, {setSubmitting, setFieldError}) => {
                  setSubmitting(true);

                  const {long, short, seo, ...rest} = values;

                  const createData = {
                    ...rest,
                    description: {
                      long, short,
                      seo: seo
                    }
                  }
                  try {
                    setSubmitting(false);
                    const response = await dispatch(api.brands.create(createData));
                    if (typeof onCreate === 'function') {
                      onCreate(response.data);
                    }
                  } catch (e) {
                    setSubmitting(false);
                    const message = extractErrorMessage(e);
                    notify('error', message);

                    if (e.response && e.response.data.errors) {
                      if (typeof onError === 'function') {
                        onError(e.response.data);
                      }
                      const responseErrors = e.response.data.errors;
                      responseErrors.forEach(error => {
                        const field = error.path;
                        setFieldError(field, error.message);
                      });
                    }
                  }
                }}
              >
                {({values, setFieldValue}) => (
                  <Form>
                    <div style={{border: '1px solid grey', padding: '12px 8px'}}>
                      <h4>Upload a logo</h4>
                      <ImageUploader
                        folder={`logos/${values.slug}`}
                        id={values.name}
                        onUpload={(err, {uploadedImage}) => {
                          setFieldValue('logo', uploadedImage);
                        }}
                        allowMultiple={false} />
                    </div>
                    <Field isGrouped style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr',
                      gridGap: '18px',
                    }}>
                      <TextField
                        label="Name"
                        placeholder="Name"
                        type="text"
                        name="name" />

                      <TextField
                        label="Abbreviation"
                        placeholder="Abbrev"
                        type="text"
                        name="abbrev" />
                    </Field>
                    <Monitor />
                    <Field>
                      <TextField label={'Where this brand will be accessible from'}
                                 disabled
                                 prefix={'https://retrobie.com/brands/'}
                                 placeholder={'eg./nike'} name={'slug'}
                                 type={'text'} />
                    </Field>

                    <Field>
                      <TextField
                        label={<>Provide a <span
                          className='accented'>general description</span> of
                          this brand.</>}
                        placeholder="Description"
                        type="textarea"
                        chars={320}
                        name="long" />
                    </Field>
                    <Field>
                      <TextField
                        label={<>Describe <span
                          className='accented'>who this product is ideal for</span> in 80
                          chars or
                          less</>}
                        placeholder="Short description"
                        type="textarea"
                        chars={80}
                        name="short" />
                    </Field>
                    <Field>
                      <TextField
                        label={<>With suitable keywords, write an <span
                          className="accented">SEO copy</span> for
                          this product in 80 - 130 chars</>}
                        placeholder="seo"
                        type="textarea"
                        chars={130}
                        name="seo" />
                    </Field>
                    <Field>
                      <TextField disabled
                                 placeholder={'uuid'}
                                 label={<>Don't worry. This is filled <span
                                   className='accented'>automatically</span>.</>}
                                 type="text"
                                 name="uuid" />

                    </Field>
                    <Field>
                      <Persist name="new-brand-form" />
                    </Field>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}>
                      <Button isColor="primary" type="submit">
                        Submit
                      </Button>
                      <div style={{margin: '8px 12px', display: 'flex'}}>
                        <Checkbox style={{marginRight: '8px'}} />
                        <label>Add more</label>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </ModalContent>
          <ModalClose onClick={() => onClose()} />
        </Modal>
      </div>
    </>
  );
};

export default CreateBrandModal;

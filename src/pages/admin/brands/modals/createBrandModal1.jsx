/**
 * TODO:
 *  - Save images locally
 *  - Improve loading, success & error ux
 *  - Get 'add more' working
 */

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Field, Modal, ModalBackground, ModalClose, ModalContent} from 'bloomer';
import {Form, Formik, useFormikContext} from 'formik';
import {Persist} from 'formik-persist';
import TextField from '../../../../components/input/TextField';
import ImageKitUpload from '../../../../components/upload';
import '../../../../assets/style/bulma-fx';
import {v4 as uuidv4} from 'uuid';
import {notify} from '../../../../helpers/views';
import {cleanString, extractErrorMessage} from '../../../../helpers';
import useApi from '../../../../network/useApi';

const uuid = uuidv4();

function Monitor() {
    const {values, submitForm} = useFormikContext();

    useEffect(() => {
        if (values.name) {
            const cleanName = cleanString(values.name, "");
            if (!values.abbrev || values.abbrev.length < 3 || cleanName.length <= 3) {
                const abbrev = cleanName.substr(0, 3).toUpperCase();
                values.abbrev = abbrev;
            }
        } else {
            values.abbrev = "";
        }
    }, [values]);

    return <span/>
}


const CreateBrandModal1 = props => {
    const api = useApi();
    const [triggerUpload, setTriggerUpload] = useState(false);

    const storedFeatured = JSON.parse(localStorage.getItem('new-brand-featured-image'));
    const storedLogo = JSON.parse(localStorage.getItem('new-brand-logo'));

    const [logo, setLogo] = useState(storedLogo);
    const [featuredImage, setFeaturedImage] = useState(storedFeatured);

    return (
        <>
            <div>
                <Modal isActive={props.isActive} className={'modal-fx-fadeInScale'}>
                    <ModalBackground onClick={() => props.onClose()}/>
                    <ModalContent>
                        <div style={{
                            background: 'white',
                            display: props.isActive ? 'block' : 'none',
                            padding: '24px',
                            borderRadius: '4px'
                        }}>
                            <h2>Create a new brand</h2>
                            <Formik
                                initialValues={{
                                    uuid
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.name) {
                                        errors.name = "Required"
                                    } else if (values.name.length < 3) {
                                        errors.name = "Should be at least 3 chars"
                                    }

                                    if (!values.long) {
                                        errors.long = "Required";
                                    }

                                    if (!values.short) {
                                        errors.short = "Required"
                                    }

                                    if (!values.copy) {
                                        errors.copy = "Required"
                                    } else {
                                        if (values.copy.length > 120) {
                                            errors.copy = "SEO copy should not be more than 120 chars"
                                        }

                                        if (values.copy.length < 80) {
                                            errors.copy = "SEO copy should not be less than 80 chars"
                                        }
                                    }

                                    if (values.stock === 0 || values.stock === 'undefined') {
                                        errors.stock = "Cannot be 0"
                                    } else {
                                        if (typeof values.stock !== "number") {
                                            errors.stock = "Must be a number"
                                        }
                                        if (values.stock < 0) {
                                            errors.stock = "Cannot be less than 0"
                                        }
                                    }

                                    if (!values.uuid) {
                                        errors.uuid = "Required";
                                    }

                                    if (!logo) {
                                        errors.logo = "Required"
                                    }

                                    if (!featuredImage) {
                                        errors.featuredImage = "Required";
                                    }

                                    return errors;
                                }}
                                onSubmit={async (values, {setSubmitting, submitForm, setErrors, setFieldError}) => {
                                    const merged = {...values, logo, featuredImage};
                                    try {
                                        setSubmitting(false);
                                        const response = await api.brands.create(merged);
                                        if (props.onCreate && typeof props.onCreate === 'function') {
                                            props.onCreate(response.data);
                                        }
                                    } catch (e) {
                                        setSubmitting(false);
                                        if (e.response && e.response.data.errors) {
                                            if (props.onError && typeof props.onError === 'function') {
                                                props.onError(e.response.data)
                                            }
                                            const responseErrors = e.response.data.errors;
                                            responseErrors.forEach(error => {
                                                const field = Object.keys(error)[0];
                                                setFieldError(field, error[field]);
                                            })
                                        } else {
                                            const message = extractErrorMessage(e);
                                            notify('error', message);
                                        }
                                    }
                                }}
                            >
                                {({errors, touched, isSubmitting, validateForm}) => (
                                    <Form>
                                        <div style={{
                                            display: 'grid',
                                            justifyItems: 'center',
                                            marginBottom: '42px'
                                        }}>
                                            <ImageKitUpload label="Upload a new logo"
                                                            type='drag'
                                                            name="logo"
                                                            autoProceed={true}
                                                            currentImage={logo ? logo.url : ""}
                                                            placeholder="Drag and drop or %{browse} your computer"
                                                            folder={'brands'}
                                                            trigger={false}
                                                            error={errors.logo ? "This field is required" : null}
                                                            onComplete={(result) => {
                                                                console.log(result);
                                                                if (result.successful && result.successful.length) {
                                                                    const {response} = result.successful[0];
                                                                    if (response.body) {
                                                                        setTriggerUpload(false);
                                                                        const logo = {
                                                                            name: 'logo',
                                                                            fileName: response.body.name,
                                                                            fileId: response.body.fileId,
                                                                            url: response.body.url,
                                                                            thumbnailUrl: response.body.thumbnailUrl
                                                                        };
                                                                        setLogo(logo);
                                                                        localStorage.setItem('new-brand-logo', JSON.stringify(logo));
                                                                    } else {
                                                                        console.log(result.successful);
                                                                        notify("error", 'Could not process that result')
                                                                    }
                                                                } else {
                                                                    notify('error', "Could not upload that image")
                                                                }
                                                            }}
                                                            onError={() => {
                                                                setTriggerUpload(false)
                                                            }}
                                            />
                                            <ImageKitUpload label="Upload a featured image"
                                                            type='drag'
                                                            name="featuredImage"
                                                            autoProceed={true}
                                                            width={"552px"}
                                                            height={"552px"}
                                                            currentImage={featuredImage ? featuredImage.url : ""}
                                                            placeholder="Drag and drop or %{browse} your computer"
                                                            folder={'brands'}
                                                            trigger={false}
                                                            error={errors.featuredImage ? "This field is required" : null}
                                                            onComplete={(result) => {
                                                                if (result && result.successful) {
                                                                    const {response} = result.successful[0];
                                                                    if (response.body) {
                                                                        setTriggerUpload(false);
                                                                        const featuredImage = {
                                                                            name: 'featuredImage',
                                                                            fileName: response.body.name,
                                                                            fileId: response.body.fileId,
                                                                            url: response.body.url,
                                                                            thumbnailUrl: response.body.thumbnailUrl
                                                                        };
                                                                        setFeaturedImage(featuredImage);
                                                                        localStorage.setItem('new-brand-featured-image', JSON.stringify(featuredImage));
                                                                    }
                                                                } else {
                                                                    notify('error', "Could not upload that image")
                                                                }
                                                            }}
                                                            onError={() => {
                                                                setTriggerUpload(false)
                                                            }}
                                            />
                                        </div>
                                        <Field isGrouped style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr',
                                            gridGap: '18px'
                                        }}>
                                            <TextField label="Name" placeholder="Name" type="text" name="name"/>
                                            <TextField label="Abbreviation" placeholder="Abbrev" type="text"
                                                       name="abbrev"/>
                                        </Field>
                                        <Monitor/>
                                        <TextField
                                            label={<>Provide a <span className='accented'>general description</span> of
                                                this brand. TODO Add link to example</>}
                                            placeholder="Description"
                                            type="textarea"
                                            chars={320}
                                            name="long"/>
                                        <TextField
                                            label={<>Describe <span
                                                className='accented'>who this product is ideal for</span> in 80 chars or
                                                less</>}
                                            placeholder="Short description"
                                            type="textarea"
                                            chars={80}
                                            name="short"/>
                                        <TextField label={<>With suitable keywords, write an <span className="accented">SEO copy</span> for
                                            this product in 80 - 120 chars</>}
                                                   placeholder="Copy"
                                                   type="textarea"
                                                   chars={120}
                                                   name="copy"/>
                                        <Field isGrouped style={{display: 'grid', gridTemplateColumns: '1fr'}}>
                                            <TextField
                                                label={<>
                                                    <span className='accented'>How many products</span> of this
                                                    brand are available?</>}
                                                type="number"
                                                placeholder="10"
                                                name="stock"/>
                                            <TextField disabled
                                                       label={<>Don't worry. This is filled <span
                                                           className='accented'>automatically</span>.</>}
                                                       type="text"
                                                       name="uuid"/>
                                        </Field>
                                        <Field>
                                            <Persist name="new-brand-form"/>
                                        </Field>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column'
                                        }}>
                                            <Button isColor="primary" type="submit">
                                                Submit
                                            </Button>
                                            <div style={{margin: '8px 12px', display: 'flex'}}>
                                                <Checkbox style={{marginRight: '8px'}}/>
                                                <label>Add more</label>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </ModalContent>
                    <ModalClose onClick={() => props.onClose()}/>
                </Modal>
            </div>
        </>
    );
};

CreateBrandModal1.propTypes = {
    isActive: PropTypes.bool,
    onCreate: PropTypes.func,
    onError: PropTypes.func
};

export default CreateBrandModal1;

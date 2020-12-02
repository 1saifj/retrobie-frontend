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
import '../../../../assets/style/bulma-fx';
import {v4 as uuidv4} from 'uuid';
import {notify} from '../../../../helpers/views';
import {cleanString, extractErrorMessage} from '../../../../helpers';
import * as Yup from 'yup';
import useApi from '../../../../network/useApi';
import {useAuth} from '../../../../network';
import {useDispatch} from 'react-redux';

const CreateBrandValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required("This field is required")
        .min(2, "Too short")
        .max(64, "Too long"),
    long: Yup.string()
        .required("This field is required")
        .min(180, "Should be at least 180 characters long")
        .max(320, "Too long"),
    copy: Yup.string()
        .required("This field is required")
        .min(80, "SEO copy should not be less than 80 chars")
        .max(120, "SEO copy should not be more than 120 chars"),
    stock: Yup.number()
        .required("This field is required.")
        .moreThan(0, "Stock cannot less than one."),
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
    const {values} = useFormikContext();

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


const CreateBrandModal = props => {
    const api = useAuth();
    const dispatch = useDispatch();

    const storedFeatured = JSON.parse(localStorage.getItem('new-brand-featured-image'));
    const storedLogo = JSON.parse(localStorage.getItem('new-brand-logo'));

    const [logo,] = useState(storedLogo);
    const [featuredImage,] = useState(storedFeatured);

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
                            borderRadius: '4px',
                            textAlign: 'left',
                        }}>
                            <h2>Create a new brand</h2>
                            <Formik
                                initialValues={{
                                    uuid
                                }}
                                validationSchema={CreateBrandValidationSchema}
                                onSubmit={async (values, {setSubmitting, setFieldError}) => {
                                    setSubmitting(true);
                                    const merged = {...values, logo, featuredImage};
                                    try {
                                        setSubmitting(false);
                                        const response = await dispatch(api.brands.create(merged));
                                        if (props.onCreate && typeof props.onCreate === 'function') {
                                            props.onCreate(response.data);
                                        }
                                    } catch (e) {
                                        setSubmitting(false);
                                        const message = extractErrorMessage(e);
                                        notify('error', message);

                                        if (e.response && e.response.data.errors) {
                                            if (props.onError && typeof props.onError === 'function') {
                                                props.onError(e.response.data)
                                            }
                                            const responseErrors = e.response.data.errors;
                                            responseErrors.forEach(error => {
                                                const field = error.path;
                                                setFieldError(field, error.message);
                                            })
                                        }
                                    }
                                }}
                            >
                                {({errors}) => (
                                    <Form>
                                        <div style={{
                                            display: 'grid',
                                            justifyItems: 'center',
                                            marginBottom: '42px'
                                        }}>
                                            {/*
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
*/}
                                            {/*
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
*/}
                                        </div>
                                        <Field isGrouped style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr',
                                            gridGap: '18px'
                                        }}>
                                            <TextField label="Name"
                                                       placeholder="Name"
                                                       type="text"
                                                       name="name"/>

                                            <TextField label="Abbreviation" placeholder="Abbrev" type="text"
                                                       name="abbrev"/>
                                        </Field>
                                        <Monitor/>
                                        <Field>
                                            <TextField label={'Where this brand will be accessible from'}
                                                       disabled
                                                       prefix={"https://retrobie.com/brands/"}
                                                       placeholder={'eg./nike'} name={'slug'}
                                                       type={'text'}/>
                                        </Field>

                                        <Field>
                                            <TextField
                                                label={<>Provide a <span
                                                    className='accented'>general description</span> of
                                                    this brand. TODO Add link to example</>}
                                                placeholder="Description"
                                                type="textarea"
                                                chars={320}
                                                name="long"/>
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
                                                name="short"/>
                                        </Field>
                                        <Field>
                                            <TextField
                                                label={<>With suitable keywords, write an <span className="accented">SEO copy</span> for
                                                    this product in 80 - 120 chars</>}
                                                placeholder="Copy"
                                                type="textarea"
                                                chars={120}
                                                name="copy"/>
                                        </Field>
                                        <Field>
                                            <TextField
                                                label={<>
                                                    <span className='accented'>How many products</span> of this
                                                    brand are available?</>}
                                                type="number"
                                                placeholder="10"
                                                name="stock"/>
                                        </Field>
                                        <Field>
                                            <TextField disabled
                                                       placeholder={'uuid'}
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

CreateBrandModal.propTypes = {
    isActive: PropTypes.bool,
    onCreate: PropTypes.func,
    onError: PropTypes.func
};

export default CreateBrandModal;

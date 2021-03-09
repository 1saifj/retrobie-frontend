import React, {useState} from 'react';
import {Box, Button, TextArea} from 'bloomer';
import {Loading} from '../../../components';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useSWR from 'swr/esm/use-swr';
import {useAuth} from '../../../hooks';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const BrandLogoParent = styled('div')`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    
    h3 {
      margin-bottom: 0;
    }
    
    p {
      margin-top: 0;
    }
    
`;

function AdminBrand({match}) {
    const api = useAuth();

    const getSingleBrand = (id)=> api.brands.getBrandByUuid({uuid: id}).then(({data}) => data)

    const {data: singleOrderData} = useSWR(['brands/single', match.params.id.toLowerCase()], (url, id)=> getSingleBrand(id));

    if (!singleOrderData) {
        return (
          <Loading/>
        )
    }

    const modules = {
        toolbar: [
            [{'header': [1, 2, 3, 4, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'font'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <>
            <div style={{textAlign: 'center', marginBottom: '24px'}}>
                <img src={singleOrderData.logo?.thumbnailUrl} style={{marginBottom: '16px'}} alt="logo"/>
            </div>
            <Box style={{minWidth: '600px', display: 'grid', justifyContent: 'center'}}>
                <div style={{display: 'flex'}}>
                    <BrandLogoParent>
                        <div>
                            <h3>{singleOrderData.name}</h3>
                        </div>

                        <div style={{textAlign: 'center'}}>
                            <img style={{height: '200px'}} src={singleOrderData.featuredImage?.url} alt="logo"/>
                        </div>
                    </BrandLogoParent>
                </div>

                <div style={{maxWidth: '650px'}}>

                    <div>
                        <h4>Brand description</h4>
                        <ReactQuill theme="snow"
                                    modules={modules}
                                    defaultValue={singleOrderData.description.long}
                                    formats={formats}
                                    style={{borderRadius: '4px'}}
                        />

                    </div>
                    <div>
                        <h4>SEO Copy</h4>
                        <TextArea defaultValue={singleOrderData.description.seo}/>

                    </div>
                    <div>
                        <h4>Short description</h4>
                        <TextArea defaultValue={singleOrderData.description.short}/>

                    </div>
                    <div style={{marginTop: '24px'}}>
                        <Button isColor="primary" style={{width: '100%'}}>
                            Submit changes
                        </Button>
                    </div>
                </div>
            </Box>
        </>
    );
}

export default AdminBrand;

import React, {useState} from 'react';
import {useQuery} from 'react-query';
import {Box, Button, TextArea} from 'bloomer';
import Loading from '../../../components/loading';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useApi from '../../../network/useApi';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMinMax() {
    return getRandomInt(1000, 10000);
}


function getAnalyticsData() {
    const analyticsData = [
        {
            name: 'Page A', uv: getMinMax(), pv: getMinMax(), amt: 2400,
        },
        {
            name: 'Page B', uv: getMinMax(), pv: getMinMax(), amt: 2210,
        },
        {
            name: 'Page C', uv: getMinMax(), pv: getMinMax(), amt: 2290,
        },
        {
            name: 'Page D', uv: getMinMax(), pv: getMinMax(), amt: 2000,
        },
        {
            name: 'Page E', uv: getMinMax(), pv: getMinMax(), amt: 2181,
        },
        {
            name: 'Page F', uv: getMinMax(), pv: getMinMax(), amt: 2500,
        },
        {
            name: 'Page G', uv: getMinMax(), pv: getMinMax(), amt: 2100,
        },
    ];
    return analyticsData;
}



// async function getAll(brandId) {
//     await Promise.all([getSingleBrand(brandId), getSingleBrandProducts(brandId)])
// }

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
    const api = useApi();

    async function getSingleBrand(id) {
        const {data} = await api.brands.getSingle(id);
        return data;
    }


    async function getSingleProduct(id) {
        const {data} = await api.products.getSingle(id);
        return data;
    }

    const [value, setValue] = useState('');
    const [brand, setBrand] = useState('');
    const [brandDetails, setBrandDetails] = useState({});

    const {status, data, error, isFetching} = useQuery([match.params.id.toLowerCase()], getSingleBrand);

    async function getImageKitDetails(name) {
        const signature = await api.imageKit.getSignature();
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

    if (status === 'loading') {
        return (
            <Loading message={false}/>
        )
    }
    return (
        <>
            <div style={{textAlign: 'center', marginBottom: '24px'}}>
                <img src={data.logo?.thumbnailUrl} style={{marginBottom: '16px'}} alt="logo"/>
            </div>
            <Box style={{minWidth: '600px', display: 'grid', justifyContent: 'center'}}>
                <div style={{display: 'flex'}}>
                    <BrandLogoParent>
                        <div>
                            <h3>{data.name}</h3>
                        </div>

                        <div style={{textAlign: 'center'}}>
                            <img style={{height: '200px'}} src={data.featuredImage?.url} alt="logo"/>
                        </div>
                    </BrandLogoParent>
                </div>

                <div style={{maxWidth: '650px'}}>

                    <div>
                        <h4>Brand description</h4>
                        <ReactQuill theme="snow"
                                    modules={modules}
                                    defaultValue={data.description.long}
                                    formats={formats}
                                    style={{borderRadius: '4px'}}
                        />

                    </div>
                    <div>
                        <h4>SEO Copy</h4>
                        <TextArea defaultValue={data.description.seo}/>

                    </div>
                    <div>
                        <h4>Short description</h4>
                        <TextArea defaultValue={data.description.short}/>

                    </div>
                    <div style={{marginTop: '24px'}}>
                        <Button isColor="primary" style={{width: '100%'}}>
                            Submit changes
                        </Button>
                    </div>
                </div>
            </Box>

            <div>

{/*
                <div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridGap: '24px',
                        marginBottom: '24px'
                    }}>
                        <Box style={{margin: 0}}>
                            <h4 style={{marginTop: 0}}>Units sold in the last 30 days</h4>
                            <AreaChart
                                width={255}
                                height={60}
                                data={getAnalyticsData()}
                                margin={{
                                    top: 5, right: 0, left: 0, bottom: 5,
                                }}
                            >
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8"/>
                            </AreaChart>

                        </Box>
                        <Box>
                            <h4 style={{marginTop: 0}}>Projected sales</h4>
                            <AreaChart
                                width={255}
                                height={60}
                                data={getAnalyticsData()}
                                margin={{
                                    top: 5, right: 0, left: 0, bottom: 5,
                                }}
                            >
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8"/>
                            </AreaChart>

                        </Box>
                    </div>
                    <Box>
                        <h4>Recent activity</h4>
                        <Box style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Check/>
                            <div className="activity-type">
                                <p>PURCHASE</p>
                            </div>
                            <p>
                                Someone bought shit!
                            </p>
                            <p className="channel">
                                DIRECT
                            </p>
                        </Box>
                    </Box>
                    <Box>
                        <h4>Stock information</h4>
                        <LineChart
                            width={500}
                            height={300}
                            data={getAnalyticsData()}
                        >
                            <XAxis stroke="#ccc" tick={false}/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
                        </LineChart>
                    </Box>
                </div>
*/}

            </div>
        </>
    );
    // return (
    //     <InternalLayout>
    //
    //         <Modal isActive={this.state.modal.logo.show}>
    //             <ModalBackground onClick={() => openModal('logo')}/>
    //             <ModalContent>
    //                 <Box>
    //                     <Title>
    //                         Change Logo
    //                     </Title>
    //                     {
    //                         this.state.modal.logo.details ?
    //                             <ImageKitUpload signature={this.state.modal.logo.details.signature}
    //                                             publicKey={this.state.modal.logo.details.publicKey}
    //                                             currentImage={brandDetails.logo.url}
    //                                             folder={`brands/${this.state.brand}/main`}
    //                                             token={this.state.modal.logo.details.token}
    //                                             expire={this.state.modal.logo.details.expire}
    //                                             onSuccess={(result) => {
    //                                                 //It fails if you access the object directly for some reason
    //                                                 let actual = Object.assign({}, result);
    //                                                 this.sendUploadedUrl('logo', actual.successful[0]);
    //                                                 /**
    //                                                  *
    //                                                  fileId: "5e4a58a38b528c7019d42f94"
    //                                                  ​​​​​filePath: "/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
    //                                                  ​​​​​fileType: "image"
    //                                                  ​​​​​height: 400
    //                                                  ​​​​​name: "nike-swoosh-vector-logo_I1AZRGWLU.png"
    //                                                  ​​​​​size: 2416
    //                                                  ​​​​​thumbnailUrl: "https://ik.imagekit.io/t25/tr:n-media_library_thumbnail/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
    //                                                  url: "https://ik.imagekit.io/t25/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
    //                                                  */
    //
    //                                             }}
    //                             />
    //                             :
    //                             <div>
    //                                 <Loading minor/>
    //                             </div>
    //                     }
    //                 </Box>
    //             </ModalContent>
    //             <ModalClose onClick={() => openModal('logo')}/>
    //         </Modal>
    //
    //         <Modal isActive={this.state.modal.description.show}>
    //             <ModalBackground onClick={() => openModal('description')}/>
    //             <ModalContent>
    //                 <Box>
    //                     <Title>
    //                         Change Description
    //                     </Title>
    //                     <div>
    //                         <form>
    //                             <Field isGroup>
    //                                 <label>Description</label>
    //                                 <TextArea id={'descriptionControl'} rows={5} componentClass="textarea"
    //                                           placeholder={"Enter something"}/>
    //                             </Field>
    //                             <Field isGroup style={{textAlign: 'center'}}>
    //                                 <Button isColor='primary' type='submit'
    //                                         onClick={(e) => {
    //                                             let element = document.getElementById('descriptionControl');
    //                                             this.sendUploadedUrl('description', element.value)
    //                                         }}
    //                                         style={{padding: "10px", minWidth: "200px"}}>
    //                                     Change
    //                                 </Button>
    //                             </Field>
    //                         </form>
    //                     </div>
    //                 </Box>
    //             </ModalContent>
    //             <ModalClose onClick={() => openModal('description')}/>
    //         </Modal>
    //
    //         <Modal isActive={this.state.modal.featuredImage.show}>
    //             <ModalBackground onClick={() => openModal('featuredImage')}/>
    //             <ModalContent>
    //                 <Box>
    //                     <Title>
    //                         Change Image
    //                     </Title>
    //                     {
    //                         this.state.modal.featuredImage.details ?
    //                             <ImageKitUpload signature={this.state.modal.featuredImage.details.signature}
    //                                             publicKey={this.state.modal.featuredImage.details.publicKey}
    //                                             trigger={false}
    //                                             folder={`brands/${this.state.brand}/main`}
    //                                             token={this.state.modal.featuredImage.details.token}
    //                                             expire={this.state.modal.featuredImage.details.expire}
    //                                             onSuccess={(result) => {
    //                                                 let actual = Object.assign({}, result);
    //                                                 this.sendUploadedUrl('featured_image', actual.successful[0]);
    //                                             }}
    //                             />
    //                             :
    //                             <div>
    //                                 <Loading minor/>
    //                             </div>
    //
    //                     }
    //                 </Box>
    //             </ModalContent>
    //         </Modal>
    //     </InternalLayout>
    // )
}

// class AdminBrand extends Component {
//     state = {
//         brand: "",
//         brandProducts: [],
//         brandDetails: {},
//         loading: {
//             products: false
//         },
//         modal: {
//             logo: {
//                 show: false
//             },
//             featuredImage: {
//                 show: false
//             },
//             description: {
//                 show: false
//             }
//         }
//     };
//
//     render() {
//         return (
//             <>
//
//                 <Modal isActive={this.state.modal.logo.show}
//                        onEnter={() => this.getImageKitDetails('logo')}>
//                     <ModalBackground onClick={() => this.closeModal('logo')}/>
//                     <ModalContent>
//                         <Box>
//                             <Title>
//                                 Change Logo
//                             </Title>
//                             {
//                                 this.state.modal.logo.details ?
//                                     <ImageKitUpload signature={this.state.modal.logo.details.signature}
//                                                     publicKey={this.state.modal.logo.details.publicKey}
//                                                     currentImage={this.state.brandDetails.logo.url}
//                                                     folder={`brands/${this.state.brand}/main`}
//                                                     token={this.state.modal.logo.details.token}
//                                                     expire={this.state.modal.logo.details.expire}
//                                                     onSuccess={(result) => {
//                                                         //It fails if you access the object directly for some reason
//                                                         let actual = Object.assign({}, result);
//                                                         this.sendUploadedUrl('logo', actual.successful[0]);
//                                                         /**
//                                                          *
//                                                          fileId: "5e4a58a38b528c7019d42f94"
//                                                          ​​​​​filePath: "/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
//                                                          ​​​​​fileType: "image"
//                                                          ​​​​​height: 400
//                                                          ​​​​​name: "nike-swoosh-vector-logo_I1AZRGWLU.png"
//                                                          ​​​​​size: 2416
//                                                          ​​​​​thumbnailUrl: "https://ik.imagekit.io/t25/tr:n-media_library_thumbnail/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
//                                                          url: "https://ik.imagekit.io/t25/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
//                                                          */
//
//                                                     }}
//                                     />
//                                     :
//                                     <div>
//                                         <Loading minor/>
//                                     </div>
//                             }
//                         </Box>
//                     </ModalContent>
//                     <ModalClose onClick={() => this.closeModal('logo')}/>
//                 </Modal>
//
//
//                 <Modal isActive={this.state.modal.featuredImage.show}
//                        onEnter={() => this.getImageKitDetails('featuredImage')}
//                 >
//                     <ModalBackground onClick={() => this.closeModal('featuredImage')}/>
//                     <ModalContent>
//                         <Box>
//                             <Title>
//                                 Change Image
//                             </Title>
//                             {
//                                 this.state.modal.featuredImage.details ?
//                                     <ImageKitUpload signature={this.state.modal.featuredImage.details.signature}
//                                                     publicKey={this.state.modal.featuredImage.details.publicKey}
//                                                     folder={`brands/${this.state.brand}/main`}
//                                                     token={this.state.modal.featuredImage.details.token}
//                                                     expire={this.state.modal.featuredImage.details.expire}
//                                                     onSuccess={(result) => {
//                                                         let actual = Object.assign({}, result);
//                                                         this.sendUploadedUrl('featured_image', actual.successful[0]);
//                                                     }}
//                                     />
//                                     :
//                                     <div>
//                                         <Loading minor/>
//                                     </div>
//                             }
//                         </Box>

// class AdminBrand extends Component {
//     state = {
//         brand: "",
//         brandProducts: [],
//         brandDetails: {},
//         loading: {
//             products: false
//         },
//         modal: {
//             logo: {
//                 show: false
//             },
//             featuredImage: {
//                 show: false
//             },
//             description: {
//                 show: false
//             }
//         }
//     };
//
//     componentDidMount() {
//         this.setState({
//             ...this.state,
//             brand: this.props.match.params.id
//         });
//         axis.get(`/brands/single/${this.props.match.params.id}`)
//             .then(response => {
//                 this.setState({
//                     ...this.state,
//                     brandDetails: response.data
//                 })
//             }).catch(err => {
//             console.error(err);
//         });
//         axis.get(`/brands/single/${this.props.match.params.id}/products`)
//             .then(response => {
//                 response.data.items.forEach(item => {
//                     axis.get(`/products/single/${item}/minimal`)
//                         .then(response => {
//                             this.setState({
//                                 ...this.state,
//                                 brandProducts: [...this.state.brandProducts, response.data],
//                                 loading: {
//                                     ...this.state.loading,
//                                     products: false
//                                 }
//                             })
//                         })
//                 })
//             }).catch(err => {
//             this.setState({
//                 ...this.state,
//                 loading: {
//                     ...this.state.loading,
//                     products: false
//                 }
//             });
//
//         })
//
//     }
//
//     openModal(name) {
//         this.setState({
//             ...this.state,
//             modal: {
//                 ...this.state.modal,
//                 [name]: {
//                     ...this.state.modal[name],
//                     show: true
//                 }
//             }
//         })
//     }
//
//     closeModal(name) {
//         this.setState({
//             ...this.state,
//             modal: {
//                 ...this.state.modal,
//                 [name]: {
//                     ...this.state.modal[name],
//                     show: false
//                 }
//             }
//         })
//     }
//
//     getImageKitDetails(name) {
//         axis.get('/auth/imagekit/signature')
//             .then(response => {
//                 this.setState({
//                     ...this.state,
//                     modal: {
//                         ...this.state.modal,
//                         [name]: {
//                             ...this.state.modal[name],
//                             details: response.data
//                         }
//                     }
//                 })
//             })
//     }
//
//     sendUploadedUrl(field, result) {
//         if (!field || !result)
//             return;
//
//         let {thumbnailUrl, url, fileId} = result.response ? result.response.body : {};
//         axis.put(`/brands/single/${this.state.brand}`, {
//             [field]: thumbnailUrl && url && fileId ? {
//                 thumbnailUrl,
//                 url,
//                 fileId
//             } : result
//         })
//             .then(response => {
//                 this.setState({
//                     ...this.state,
//                     brandDetails: {
//                         ...this.state.brandDetails,
//                         [field]: response.data[field]
//                     }
//                 });
//                 notify('success',"Uploaded successfully.")
//             }).catch(err => {
//             console.error(err);
//         })
//     }
//
//     render() {
//         return (
//             <>
//                 <h1>Single Brand</h1>
//                 <div>
//                     <h2>Brand Description</h2>
//                     <p>Name: {this.state.brandDetails.name}</p>
//                     <p>Id: {this.state.brandDetails._id}</p>
//                     <div>
//                         <p>Description</p>
//                         <p style={{color: "#353535"}}>{this.state.brandDetails.description || "No description set"}</p>
//                         <Button isColor='white'
//                                 onClick={() => this.openModal('description')}
//                                 style={{padding: "10px"}}>
//                             Edit
//                         </Button>
//                     </div>
//                     <div>
//                         <p>Logo</p>
//                         <div>
//                             {
//                                 this.state.brandDetails.logo && this.state.brandDetails.logo.url ?
//                                     <img src={this.state.brandDetails.logo.thumbnailUrl} alt={'logo'}/>
//                                     :
//                                     <p>
//                                         No logo uploaded yet.
//                                     </p>
//                             }
//                         </div>
//                         <Button isColor='primary'
//                                 onClick={() => this.openModal('logo')}
//                                 style={{padding: "10px"}}>Change</Button>
//                     </div>
//                     <div>
//                         <div>
//                             <p>Featured Image:</p>
//                             {
//                                 this.state.brandDetails.featured_image && this.state.brandDetails.featured_image.url ?
//                                     <img src={this.state.brandDetails.featured_image.thumbnailUrl}
//                                          alt={'featured_image'}/>
//                                     :
//                                     <p>
//                                         No featured_image uploaded yet.
//                                     </p>
//                             }
//                         </div>
//
//                         <Button isColor='primary'
//                                 onClick={() => this.openModal('featuredImage')}
//                                 style={{padding: "10px"}}>Change</Button>
//                     </div>
//                 </div>
//
//                 <Modal isActive={this.state.modal.logo.show}
//                        onEnter={() => this.getImageKitDetails('logo')}>
//                     <ModalBackground onClick={() => this.closeModal('logo')}/>
//                     <ModalContent>
//                         <Box>
//                             <Title>
//                                 Change Logo
//                             </Title>
//                             {
//                                 this.state.modal.logo.details ?
//                                     <ImageKitUpload signature={this.state.modal.logo.details.signature}
//                                                     publicKey={this.state.modal.logo.details.publicKey}
//                                                     currentImage={this.state.brandDetails.logo.url}
//                                                     folder={`brands/${this.state.brand}/main`}
//                                                     token={this.state.modal.logo.details.token}
//                                                     expire={this.state.modal.logo.details.expire}
//                                                     onSuccess={(result) => {
//                                                         //It fails if you access the object directly for some reason
//                                                         let actual = Object.assign({}, result);
//                                                         this.sendUploadedUrl('logo', actual.successful[0]);
//                                                         /**
//                                                          *
//                                                          fileId: "5e4a58a38b528c7019d42f94"
//                                                          ​​​​​filePath: "/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
//                                                          ​​​​​fileType: "image"
//                                                          ​​​​​height: 400
//                                                          ​​​​​name: "nike-swoosh-vector-logo_I1AZRGWLU.png"
//                                                          ​​​​​size: 2416
//                                                          ​​​​​thumbnailUrl: "https://ik.imagekit.io/t25/tr:n-media_library_thumbnail/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
//                                                          url: "https://ik.imagekit.io/t25/brands/nike/main/nike-swoosh-vector-logo_I1AZRGWLU.png"
//                                                          */
//
//                                                     }}
//                                     />
//                                     :
//                                     <div>
//                                         <Loading minor/>
//                                     </div>
//                             }
//                         </Box>
//                     </ModalContent>
//                     <ModalClose onClick={() => this.closeModal('logo')}/>
//                 </Modal>
//
//                 <Modal isActive={this.state.modal.description.show}>
//                     <ModalBackground onClick={() => this.closeModal('description')}/>
//                     <ModalContent>
//                         <Box>
//                             <Title>
//                                 Change Description
//                             </Title>
//                             <div>
//                                 <form>
//                                     <Field isGroup>
//                                         <label>Description</label>
//                                         <TextArea id={'descriptionControl'} rows={5} componentClass="textarea"
//                                                   placeholder={"Enter something"}/>
//                                     </Field>
//                                     <Field isGroup style={{textAlign: 'center'}}>
//                                         <Button isColor='primary' type='submit'
//                                                 onClick={(e) => {
//                                                     let element = document.getElementById('descriptionControl');
//                                                     this.sendUploadedUrl('description', element.value)
//                                                 }}
//                                                 style={{padding: "10px", minWidth: "200px"}}>
//                                             Change
//                                         </Button>
//                                     </Field>
//                                 </form>
//                             </div>
//                         </Box>
//                     </ModalContent>
//                     <ModalClose onClick={() => this.closeModal('description')}/>
//                 </Modal>
//
//             </>
//         );
//     }
// }

export default AdminBrand;

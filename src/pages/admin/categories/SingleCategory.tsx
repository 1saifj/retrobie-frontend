import React, {useState} from 'react';
import useSWR from 'swr/esm/use-swr';
import {useAuth, useNotify} from '../../../hooks';
import {Loading} from '../../../components';
import {CategoryType} from '../../../types';
import ImageUploader from '../../../components/uploader/ImageUploader';
import {useDispatch} from 'react-redux';
import {Button} from 'bloomer';


export default function({match}){

  const api = useAuth();
  const notify = useNotify();
  const dispatch = useDispatch();

  const [uploadedImage, setUploadedImage] = useState(null);

  const singleCategoryFetcher = (key, id) => api.category.getOne(id).then(({data})=> data);
  const {data: thisCategory} = useSWR<CategoryType>(
    [`/category/${match.params.slug}`, match.params.slug],
    singleCategoryFetcher
  );

  if (!thisCategory) {
    return <Loading/>
  }

  async function uploadLandingImage(landingImage){
    const response = await dispatch<any>(api.category.update(thisCategory.uuid, {landingImage}));

    if (response.data){
      notify.success('Uploaded image successfully');
    }
  }

  return (
    <div>
      <div>
        <h2>
          {thisCategory.name}
        </h2>
      </div>
      <div>
        <h3>Landing image</h3>
        <div>
          {
            thisCategory.landingImage ? (
              <div>
                <img src={thisCategory.landingImage.thumbnailUrl} alt={'landing image'}/>
              </div>
            ) : (
              <div>
                <div>
                  <ImageUploader
                    folder={`/category/${match.params.slug}`}
                    onInit={(images)=> {
                      if (images?.length) {
                        setUploadedImage(images[0]);
                      }
                    }}
                    initialImages={thisCategory.landingImage && [
                      {
                        ...thisCategory.landingImage,
                        md5: null,
                        fileId: thisCategory.landingImage.fileId,
                        uploaded: true,
                        id: null
                      }
                    ]}
                    onUpload={async (err, {images}) => await uploadLandingImage(images[0])}
                    allowMultiple={false}
                    id={`category/${match.params.slug}`}/>
                </div>
                <div>
                  {
                    // if the landing image has been uploaded to Imagekit
                    // but not to our servers
                    uploadedImage && !thisCategory.landingImage && (
                      <Button onClick={async ()=> {
                        await uploadLandingImage(uploadedImage);
                      }}>
                        Upload to server
                      </Button>
                    )
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

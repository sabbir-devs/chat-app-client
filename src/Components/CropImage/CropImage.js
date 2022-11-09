import { Slider } from '@mui/material';
import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import Cropper from 'react-easy-crop';
import { baseUrl } from '../../utils/constantData/constantData';
import './CropImage.css';

const CropImage = ({ image, setProfileImage }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);


    const onCropComplete = useCallback((croppedArea, CroppedAreaPixels) => {
        console.log('corped area', croppedArea, CroppedAreaPixels)
        setCroppedArea(CroppedAreaPixels)
    }, [])

    console.log('cropped Area', croppedArea);

    const handleUploadProfilePic = () => {
        fetch(`${baseUrl}/user/profile-picture`,{
            method: "POST",
            body: JSON.stringify(image)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
    }

    return (
        <>
            <div className="image-cropper">
                <div className='crop-image'>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className="buttons">
                    <button onClick={()=> {setProfileImage(null)}} className='cancle-btn'>Cancle</button>
                    <button onClick={handleUploadProfilePic} className='upload-btn'>Upload</button>
                </div>
            </div>
        </>
    );
};

export default CropImage;
import React, { useState, useRef } from 'react';

const ImageUploader = ({image,setImage}) => {
    // const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setImage(imageUrl);
                }
            }
        }
    };

    return (
        <div onPaste={handlePaste}  className='bg-gray-900 p-2 flex rounded-md justify-center max-w-[700px] py-4 mx-auto items-center gap-5'>
            <input
                type="file"
                accept="image/*"
                id="image-upload"
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide the input
                onChange={handleFileChange}
            />
            <label htmlFor="image-upload" style={{
                border: '1px dashed #ccc',
                padding: '10px',
                cursor: 'pointer',
                display: 'inline-block',
            }}>
                Drop or Select File
            </label>
            <div className='w-[182px] border-dotted  border-2 h-[200px] overflow-hidden'>
            {image && (
                    <img src={image} alt="Preview" className='w-[180px] h-[198px] object-cover' />
            )}
            </div>
        </div>
    );
};

export default ImageUploader;

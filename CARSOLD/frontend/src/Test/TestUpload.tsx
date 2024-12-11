import React, { useState } from 'react';
import { api } from "../Config/AxiosConfig/AxiosConfig.tsx";

const ImageUpload: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('');

    // Handle file selection
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    // Handle form submission (image upload)
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (!selectedImage) {
            setMessage('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedImage);

        setIsUploading(true);
        setMessage('');
        setImageUrl('');

        try {
            const response = await api.post(
                'storage/upload', // Assuming this is your backend endpoint for file upload
                formData,
            );

            if (response.data && response.data !== 'Error') {
                setImageUrl(response.data);  // Assuming the backend returns the file URL
                setMessage('Upload successful!');
            } else {
                setMessage('Image is sensitive, upload failed.');
            }
        } catch (error) {
            setMessage('Error: Unable to upload the file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <h2>Upload Image</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="submit" disabled={isUploading}>Upload Image</button>
            </form>

            {isUploading && <p>Uploading...</p>}

            {message && <p>{message}</p>}

            {imageUrl && <div>
                <h3>Uploaded Image:</h3>
                <img src={imageUrl} alt="Uploaded" width="200" />
            </div>}
        </div>
    );
};

export default ImageUpload;
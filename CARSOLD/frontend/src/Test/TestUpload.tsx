import React, {useState} from 'react';
import {api} from "../Config/AxiosConfig/AxiosConfig.tsx";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 10MB in bytes

const ImageUpload: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('');

    const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setMessage("Couldn't upload, image is too large.");
                setSelectedImage(null);
            } else {
                setMessage('');
                setSelectedImage(file);
            }
        }
    };

    // Handle form submission (image upload)
    const handleSubmit = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append('file', selectedImage);

            setIsUploading(true);
            setMessage('');
            setImageUrl('');

            try {
                const response = await api.post('storage/upload', formData);

                if (response.data) {
                    const {info} = response.data;
                    if (info.startsWith("https://storage.googleapis.com")) {
                        setImageUrl(info);  // Assuming the backend returns the file URL
                        setMessage("Uploaded successfully")
                    } else {
                        setMessage(info);
                    }
                }
            } catch (error) {
                setMessage('Error: Unable to upload the file');
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div>
            <h2>Upload Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleSelectImage}/>
                <button type="submit" disabled={isUploading}>Upload Image</button>
            </form>

            {isUploading && <p>Uploading...</p>}

            {message && <p>{message}</p>}

            {imageUrl && <div>
                {message === "Uploaded successfully" ?
                <img src={imageUrl} alt="Uploaded" width="200"/> : null}
            </div>}
        </div>
    );
};

export default ImageUpload;


import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useFoldersStore } from '~/store/folders';
import { useLoginStore } from '~/store/loginStore';
import { getSignedUrl } from '~/utils/s3Utils';

const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();
    const path = router.asPath
    const { isLoggedIn, user: token } = useLoginStore();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setFile(selectedFile);
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        
        console.log('File:', file);

        console.log('Path:', path);
        let correctedPath = '';
        if (path) {
            correctedPath = path.split('/').slice(2).join('/');
            console.log('Corrected Path:', correctedPath);
        }

        const {signedUrl, key} = await getSignedUrl(correctedPath, file.name, file.type, token as string );
        console.log('Signed URL:', signedUrl);

        const response = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
            'Content-Type': file.type,
            },
            body: file,
        });

        if (response.ok) {
            console.log('File uploaded successfully');
            router.push('/folder/' + correctedPath);
        } else {
            alert('File upload failed');
        }

    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-themeColor2 text-white p-6 rounded shadow-md">
                <input type="file" onChange={handleFileChange} className="mb-4" />
                <button type="submit" className="bg-themeColor3 text-white py-2 px-4 rounded">
                    Upload
                </button>
            </form>
        </div>
    );
};

export default UploadForm;
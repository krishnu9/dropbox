

import React, { useEffect } from 'react';
import { useFoldersStore } from '~/store/folders';
import { useLoginStore } from '~/store/loginStore';

interface FileItem {
    id: string;
    name: string;
    size: string;
}


const FileList = () => {

    const {currentFolder, setCurrentFolder} = useFoldersStore();
    const {user: token} = useLoginStore();
    const [files, setFiles] = React.useState<FileItem[]>([]);

    useEffect(() => {
        console.log({currentFolder});
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/folder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ folderId: currentFolder?.id })
        }).then(res => res.json())
            .then(data => {
                console.log("data from files/", {data});
                // write this data into folder list state
                const newFilesData = data.files.map((file: any) => {
                    return ({...file})
                })
                setFiles(newFilesData);
            }).catch(err => {
                console.log("error in fetching files")
                console.log(err)
            }
        )
    }, [currentFolder]);

    const handleFileClick = (fileId: string) => {
        console.log('File clicked:', fileId);
        let path;
        if (currentFolder?.path.endsWith('/')) {
            path = currentFolder.path.slice(0, -1);
        } else {
            path = currentFolder?.path;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ path: path, fileId: fileId})
        }).then(res => res.json())
            .then(async data => {
                console.log("data from files/download", {data});
                const signedUrl = data.signedUrl;
                const receivedFile = await fetch(signedUrl, {
                    method: 'GET',
                });
                const blob = await receivedFile.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = data.key || 'downloadedFile';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

            }).catch(err => {
                console.log("error in fetching files")
                console.log(err)
            })
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">File List</h2>
            <ul className="space-y-2">
                {files.map(file => (
                    <li key={file.id} className="flex justify-between items-center p-2 border rounded shadow-sm hover:bg-themeColor2" onClick={e => handleFileClick(file.id)}>
                        <span className="font-medium">{file.name}</span>
                        <span className="text-gray-500">{file.size}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;


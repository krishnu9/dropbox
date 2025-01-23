
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useLoginStore } from '~/store/loginStore';

const NewFolder = () => {
    const router = useRouter();
    const path = router.asPath;
    const [name, setName] = useState('');
    const [newFolderPath, setNewFolderPath] = useState<string>('');
    const {isLoggedIn, user: token } = useLoginStore();

    console.log({ path });
    console.log({ newFolderPath });  

    useEffect(() => {
        if (path) {
            const correctedPath = path.split('/').slice(2).join('/');
            setNewFolderPath(correctedPath);
        }
    }, [path]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Path:', path);
        console.log('Name:', name);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/folders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({ path: newFolderPath, name })
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                router.push(`/folder/${newFolderPath}`);
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="bg-themeColor2 p-6 rounded text-white shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Create New Folder</h2>
                <div className="mb-4">
                    <label htmlFor="path" className="block">Path</label>
                    <input
                        type="text"
                        id="path"
                        value={newFolderPath}
                        onChange={(e) => setNewFolderPath(e.target.value)}
                        className="mt-1 p-2 w-full border rounded bg-transparent"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="block">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 p-2 w-full border rounded bg-transparent"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Create
                </button>
            </form>
        </div>
    );
};

export default NewFolder;
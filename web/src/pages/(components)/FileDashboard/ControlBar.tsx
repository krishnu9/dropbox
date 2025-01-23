

import { useRouter } from 'next/router';
import React from 'react';

const ControlBar: React.FC = () => {
    const router = useRouter();
    const { path } = router.query;
    return (
        <div className="flex justify-between items-center p-4 bg-transparent">
            <input
                type="text"
                placeholder="Search..."
                className="p-2 border text-white border-gray-300 rounded bg-transparent"
            />
            <div className="flex space-x-2">
                <a href={`/newfolder/${path ? path : ''}`}>
                    <button className="px-4 py-2 bg-themeColor2 text-white rounded hover:bg-gray-600">
                        New Folder
                    </button>
                </a>
                <a href={`/upload/${path ? path : ''}`}>
                <button className="px-4 py-2 bg-themeColor3 text-white rounded hover:bg-teal-400">
                    Upload
                </button>
                </a>
            </div>
        </div>
    );
};

export default ControlBar;
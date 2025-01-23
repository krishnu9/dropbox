import React from 'react';
import ControlBar from './ControlBar';
import FileList from './FileList';


const FileDashboard = () => {
    // console.log({path});
    return (
        <div className="flex flex-col text-white h-full gap-12 w-full ">
            <ControlBar />
            <FileList />
        </div>
    );
};

export default FileDashboard;
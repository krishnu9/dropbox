import { use, useEffect } from "react";
import useSWR from "swr";
import { useLoginStore } from "~/store/loginStore";
import { useFoldersStore, type Folder } from "~/store/folders";
import { useRouter } from "next/router";

// const fetcher = (...args: any) => fetch(...args).then((res) => res.json())

const SideBar = () => {

    const { isLoggedIn, user: token } = useLoginStore();
    const { folders, setFolders, currentFolder, setCurrentFolder } = useFoldersStore();
    const router = useRouter();
    
    console.log(isLoggedIn, token)

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/folders`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json', 
            'Authorization': `${token}`
            },
        })
        .then(res => res.json())
        .then(data => {
            console.log({data})
            // write this data into folder list state
            const newFilesData = data.map((folder: any) => {
                const folderName = folder.name + '/';
                return ({...folder, name: folderName})
            })
            setFolders(newFilesData);
        }).catch(err => {
            console.log(err)
        })
    }, [isLoggedIn])

    const handleFolderClick = (folder: Folder) => {
        console.log({folder});
        setCurrentFolder(folder);
        router.push(`/folder/${folder.name}`);
    }

    return (
        <div className="sidebar bg-themeColor2 text-white h-full w-64 fixed left-0 top-0 pl-2">
            <h1 className="sidebar-header text-3xl font-bold p-4">My<span className="text-themeColor3">Box</span></h1>
            <h2 className="sidebar-subheader text-xl font-semibold p-2">File Manager</h2>
            <ul className="sidebar-menu">
            {folders.map((folder: Folder) => (
                    <li className="sidebar-menu-item p-2 hover:bg-themeColor3" onClick={e => handleFolderClick(folder)}>{folder.name}</li>
            ))}
            </ul>
        </div>
    );
}

export default SideBar;


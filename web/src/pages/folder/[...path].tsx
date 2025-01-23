import { useRouter } from 'next/router';
import FileDashboard from '~/pages/(components)/FileDashboard/FileDashboard';
import { useFoldersStore } from '~/store/folders';

const FolderView = () => {
    const router = useRouter();
    const { path } = router.query;
    console.log({ path });
    return <>
        <FileDashboard />
    </>
}

export default FolderView;
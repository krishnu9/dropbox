import { useRouter } from 'next/router';
import FileDashboard from '~/pages/(components)/FileDashboard/FileDashboard';

const FolderView = () => {
    const router = useRouter();
    const { path } = router.query;
    return <>
    <FileDashboard />
    </>
}

export default FolderView;
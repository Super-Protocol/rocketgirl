import { useParams } from 'react-router-dom';

import { Content as ContentUIKit } from '@/uikit';

export const Content = () => {
    const { id } = useParams();

    return (
        <ContentUIKit>
            <div>{id}</div>
        </ContentUIKit>
    );
};

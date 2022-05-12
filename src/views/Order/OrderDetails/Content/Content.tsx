import { useParams } from 'react-router-dom';

import { Content as ContentUIKit } from '@/uikit';
import { Details } from './Details';

export const Content = () => {
    const { id } = useParams();

    return (
        <ContentUIKit>
            <Details id={id} />
        </ContentUIKit>
    );
};

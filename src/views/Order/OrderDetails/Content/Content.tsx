import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { Content as ContentUIKit } from '@/uikit';
import { Details } from './Details';

export const Content = (): ReactElement => {
    const { id } = useParams<{ id: string }>();

    return (
        <ContentUIKit>
            <Details id={id} />
        </ContentUIKit>
    );
};

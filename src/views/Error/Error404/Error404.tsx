import { memo, FC } from 'react';

import { Error404Props } from './types';

const Error404: FC<Error404Props> = () => {
    return <div>Page not found</div>;
};

export default memo(Error404);

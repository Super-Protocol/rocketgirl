import { memo, FC, ReactElement } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Spinner } from '@/uikit';
import { useBlockchainConnector } from '@/common/hooks/useBlockchainConnector';

dayjs.extend(relativeTime);

export interface GlobalProps {
    children: ReactElement;
}

const Global: FC<GlobalProps> = ({ children }) => {
    const init = useBlockchainConnector();
    if (!init) return <Spinner fullscreen />;
    return children;
};

export default memo(Global);

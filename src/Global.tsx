import { memo, FC, ReactElement } from 'react';
import { useBlockchainConnector } from '@/common/hooks/useBlockchainConnector';

export interface GlobalProps {
    children: ReactElement;
}

const Global: FC<GlobalProps> = ({ children }) => {
    const init = useBlockchainConnector();
    if (!init) return null;
    return children;
};

export default memo(Global);

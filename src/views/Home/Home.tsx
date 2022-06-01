import {
    memo, FC,
} from 'react';
import { Box } from '@/uikit';
import { Content } from './Content';
import { Header } from './Header';
import { HomeProps } from './types';

const Home: FC<HomeProps> = () => {
    return (
        <Box direction="column">
            <Header />
            <Content />
        </Box>
    );
};

export default memo(Home);

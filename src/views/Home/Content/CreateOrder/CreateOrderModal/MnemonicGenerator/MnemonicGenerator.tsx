import { ReactElement, memo } from 'react';

import { LabelToolkit } from '@/common/components';
import { tooltipText } from './helpers';
import { MnemonicGeneratorComponent } from '.';
import { MnemonicGeneratorProps } from './types';

export const MnemonicGenerator = memo<MnemonicGeneratorProps>(({
    classNameWrap, ...rest
}): ReactElement => (
    <LabelToolkit
        tooltipText={tooltipText}
        title="Encryption passphrase"
        classNameWrap={classNameWrap}
    >
        <MnemonicGeneratorComponent {...rest} />
    </LabelToolkit>
));

import {
    memo,
    FC,
    SyntheticEvent,
} from 'react';
import { useAccordionToggle } from 'react-bootstrap';
import cn from 'classnames';

import { DetailWidgetToggleProps } from './types';
import classes from './DetailWidgetToggle.module.scss';

export const DetailWidgetToggle: FC<DetailWidgetToggleProps> = memo(({
    eventKey,
    onSelect,
    isOpen,
    titleOpen,
    titleClose,
    classNameWrap,
}) => {
    const decoratedOnClick: (event: SyntheticEvent) => void = useAccordionToggle(eventKey, () => {
        onSelect(!isOpen);
    });

    return (
        <div
            onClick={decoratedOnClick}
            className={cn(classes.btn, { [classes.open]: isOpen }, classNameWrap)}
        >
            {isOpen ? titleOpen : titleClose}
        </div>
    );
});

import {
    memo, FC, useState, useCallback,
} from 'react';
import { Accordion } from 'react-bootstrap';
import cn from 'classnames';
import { DetailWidgetProps } from './types';
import { DetailWidgetToggle } from './DetailWidgetToggle';
import classes from './DetailWidget.module.scss';

const EVENT_KEY = '1';

export const DetailWidget: FC<DetailWidgetProps> = memo(({
    children,
    defaultOpen = false,
    titleOpen,
    titleClose,
    classNameWrap,
    fullWidth = true,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
    const onSelect: (isOpen: boolean) => void = useCallback((isOpen: boolean) => {
        setIsOpen(isOpen);
    }, []);

    return (
        <Accordion
            defaultActiveKey={defaultOpen ? EVENT_KEY : ''}
            className={cn(classes.accordion, { [classes.fullWidth]: fullWidth }, classNameWrap)}
        >
            <DetailWidgetToggle
                eventKey={EVENT_KEY}
                classNameWrap={classes.toggle}
                {...{
                    isOpen, titleOpen, titleClose, onSelect,
                }}
            />
            <Accordion.Collapse eventKey={EVENT_KEY}>
                <div className={classes.accordionCollapse}>
                    {children}
                </div>
            </Accordion.Collapse>
        </Accordion>
    );
});

import {
    memo, FC, useState, useCallback,
} from 'react';
import { Accordion } from 'react-bootstrap';
import cn from 'classnames';
import { SidebarWidgetProps } from './types';
import { SideBarWidgetToggle } from './SideBarWidgetToggle';
import classes from './SideBarWidget.module.scss';

const EVENT_KEY = '1';

export const SideBarWidget: FC<SidebarWidgetProps> = memo(({
    children,
    defaultOpen = false,
    icon,
    title,
    theme = 'light',
    classNameWrap,
    classNameAccordionCollapse,
    onSelect: onSelectProps = () => {},
    dataTestId = '',
    fullWidth = true,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
    const onSelect: (isOpen: boolean) => void = useCallback((isOpen: boolean) => {
        setIsOpen(isOpen);
        onSelectProps(isOpen);
    }, [onSelectProps]);

    return (
        <Accordion
            defaultActiveKey={defaultOpen ? EVENT_KEY : ''}
            className={cn(classes.accordion, { [classes.fullWidth]: fullWidth }, classes[theme], classNameWrap)}
            data-testid={`${dataTestId ? `${dataTestId}-` : dataTestId}sidebar-widget`}
        >
            <SideBarWidgetToggle
                eventKey={EVENT_KEY}
                {...{
                    isOpen, title, icon, theme, onSelect, dataTestId,
                }}
            />
            <Accordion.Collapse eventKey={EVENT_KEY}>
                <div className={cn(classes.accordionCollapse, classNameAccordionCollapse)}>
                    {children}
                </div>
            </Accordion.Collapse>
        </Accordion>
    );
});

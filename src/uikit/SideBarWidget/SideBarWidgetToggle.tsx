import {
    memo,
    FC,
    useMemo,
    cloneElement,
    ReactNode,
    SyntheticEvent,
} from 'react';
import { useAccordionToggle } from 'react-bootstrap';
import cn from 'classnames';

import { Box, Icon } from '@/uikit';
import { SideBarWidgetToggleProps } from './types';
import classes from './SideBarWidgetToggle.module.scss';

export const SideBarWidgetToggle: FC<SideBarWidgetToggleProps> = memo(({
    eventKey,
    onSelect,
    isOpen,
    title,
    icon,
    theme,
    dataTestId = '',
}) => {
    const decoratedOnClick: (event: SyntheticEvent) => void = useAccordionToggle(eventKey, () => {
        onSelect(!isOpen);
    });

    const iconWithFill: ReactNode = useMemo(() => !!icon && cloneElement(
        icon,
        {
            className: cn(classes.icon, icon?.props?.className),
            'data-testid': `${dataTestId ? `${dataTestId}-` : dataTestId}sidebar-widget-toggle-icon`,
        },
    ),
    [icon, dataTestId]);

    const dataTestIdIcon = useMemo(() => {
        const hasdataTestId = dataTestId ? `${dataTestId}-` : dataTestId;
        return `${hasdataTestId}sidebar-widget-toggle-${isOpen ? 'defis' : 'plus'}`;
    },
    [isOpen, dataTestId]);

    return (
        <button
            type="button"
            onClick={decoratedOnClick}
            data-testid="sidebar-widget-toggle-btn"
            className={cn(classes.btn, classes[theme], { [classes.open]: isOpen })}
        >
            <div className={classes.inner}>
                <div className={classes.left}>
                    {!!iconWithFill && <Box alignItems="center" className={classes.iconWrap}>{iconWithFill}</Box>}
                    <div className={classes.title}>{title}</div>
                </div>
                <div className={classes.right}>
                    <Icon
                        name={isOpen ? 'minus' : 'add_2'}
                        className={classes.icon}
                        width={12}
                        data-testid={dataTestIdIcon}
                    />
                </div>
            </div>
        </button>
    );
});

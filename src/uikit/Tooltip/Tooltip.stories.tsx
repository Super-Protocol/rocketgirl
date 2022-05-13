import React, { FC } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import {
    Tooltip as TooltipUikit, Icon, Box,
} from '@/uikit';
import classes from './TooltipStories.module.scss';
import { title, tooltip, titlewhite } from './helpersStories';
import { TooltipTheme } from './types';

const TooltipElement = () => {
    return (
        <Box direction="column" className={classes.tooltip}>
            <div className={classes.description}>Description</div>
            <p>Link with a detailed description with the ability to click on the&nbsp;
                <a href="https://" className={classes.link}>link</a>
            </p>
        </Box>
    );
};

export const Tooltip: FC = () => {
    return (
        <Container className={classes.wrap}>
            <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipUikit
                        tooltip={tooltip}
                        placement="bottom"
                        initialShow
                        hideArrow
                        classNamePopover={classes.popover}
                    >
                        <div className={classes.header}>{`${title} bottom`}</div>
                    </TooltipUikit>
                </Col>
            </Row>
            <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipUikit
                        tooltip={tooltip}
                        placement="top"
                        hideArrow
                        classNamePopover={classes.popover}
                    >
                        <div className={classes.header}>{`${title} top`}</div>
                    </TooltipUikit>
                </Col>
            </Row>
            <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipUikit
                        tooltip={<TooltipElement />}
                        placement="top"
                        theme={TooltipTheme.white}
                        classNamePopoverText={classes.popoverWhite}
                    >
                        <div className={classes.header}>{`${titlewhite} top`}</div>
                    </TooltipUikit>
                </Col>
            </Row>
            <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipUikit tooltip={tooltip} placement="top" classNamePopover={classes.limitWidth}>
                        <div className={classes.header}>{`${title} top`}</div>
                    </TooltipUikit>
                </Col>
            </Row>
            <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipUikit tooltip={tooltip} placement="top" />
                </Col>
            </Row>
            <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipUikit tooltip={tooltip} placement="top" classNamePopover={classes.limitWidth}>
                        <Icon name="verification" className={classes.icon} />
                    </TooltipUikit>
                </Col>
            </Row>
        </Container>
    );
};

export default {
    title: 'Tooltips',
};

import React, { FC } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import {
    Tooltip as TooltipUikit, Icon,
} from '@/uikit';
import classes from './TooltipStories.module.scss';
import { title, tooltip, fileName } from './helpersStories';

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
                    >
                        <div className={classes.header}>{`${title} bottom`}</div>
                    </TooltipUikit>
                </Col>
            </Row>
            <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipUikit tooltip={tooltip} placement="top">
                        <div className={classes.header}>{`${title} top`}</div>
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
            {/* <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipUikit tooltip={tooltip} placement="top">
                        <FeatherIcon
                            icon="help-circle"
                            className={classes.trashIcon}
                        />
                    </TooltipUikit>
                </Col>
            </Row> */}
            {/* <Row className={classes.row}>
                <Col md={3} className={classes.col}>
                    <TooltipWithEllipsis maxLen={20}>{fileName}</TooltipWithEllipsis>
                </Col>
            </Row> */}
        </Container>
    );
};

export default {
    title: 'Tooltips',
};

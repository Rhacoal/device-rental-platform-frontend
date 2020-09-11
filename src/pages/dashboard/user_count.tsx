import {Avatar, Card, CardContent, colors, createStyles, Grid, Typography, useTheme} from "@material-ui/core";
import clsx from "clsx";
import DnsOutlinedIcon from "@material-ui/icons/DnsOutlined";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {IDashboard} from "../../wrapper/types";


const useStyles = makeStyles(() => createStyles({
    root: {
        height: '100%'
    }
}));

export function UserCount(props: {
    dashboard: IDashboard
    className: string
} & any) {
    const {className, dashboard: _dashboard, ...rest} = props;
    const dashboard: IDashboard = _dashboard;
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardContent>
                <div>
                    <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="h6"
                    >
                        用户
                    </Typography>
                    <Typography
                        color="textPrimary"
                        variant="h4"
                    >
                        {dashboard.platform_borrower}
                    </Typography>
                </div>
                <div>
                    <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="h6"
                    >
                        设备提供者
                    </Typography>
                    <Typography
                        color="textPrimary"
                        variant="h4"
                    >
                        {dashboard.platform_provider}
                    </Typography>
                </div>
                <div>
                    <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="h6"
                    >
                        管理员
                    </Typography>
                    <Typography
                        color="textPrimary"
                        variant="h4"
                    >
                        {dashboard.platform_admin}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}
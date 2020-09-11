import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    colors,
    createStyles,
    Divider, Grid,
    Typography,
    useTheme
} from "@material-ui/core";
import {IDashboard} from "../../wrapper/types";
import clsx from "clsx";
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%'
    },
    avatar: {
        backgroundColor: colors.green[600],
        height: 56,
        width: 56
    },
    differenceIcon: {
        color: colors.green[900]
    },
    differenceValue: {
        color: colors.green[900],
        marginRight: theme.spacing(1)
    }
}));

export function BorrowThisMonth(props: any) {
    const {className, dashboard: _dashboard, ...rest} = props;
    const dashboard: IDashboard = _dashboard;
    const classes = useStyles();

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardContent>
                <Grid
                    container
                    justify="space-between"
                    spacing={3}
                >
                    <Grid item>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h6"
                        >
                            设备借用次数
                        </Typography>
                        <Typography
                            color="textPrimary"
                            variant="h4"
                        >
                            {dashboard.device_borrowed}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <DnsOutlinedIcon/>
                        </Avatar>
                    </Grid>
                </Grid>
                {/*<Box*/}
                {/*    mt={2}*/}
                {/*    display="flex"*/}
                {/*    alignItems="center"*/}
                {/*>*/}
                {/*    <ArrowUpwardIcon className={classes.differenceIcon}/>*/}
                {/*    <Typography*/}
                {/*        className={classes.differenceValue}*/}
                {/*        variant="body2"*/}
                {/*    >*/}
                {/*        16%*/}
                {/*    </Typography>*/}
                {/*    <Typography*/}
                {/*        color="textSecondary"*/}
                {/*        variant="caption"*/}
                {/*    >*/}
                {/*        Since last month*/}
                {/*    </Typography>*/}
                {/*</Box>*/}
            </CardContent>
        </Card>
    );
}